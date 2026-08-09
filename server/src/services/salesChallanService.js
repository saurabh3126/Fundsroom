const pool = require("../db/db");


// ======================================================
// CREATE DRAFT CHALLAN
// ======================================================

const createSalesChallan = async (data) => {

    const { customer_id, items } = data;

    if (!customer_id || !items || items.length === 0) {
        throw new Error("Customer and items are required");
    }

    const client = await pool.connect();

    try {

        await client.query("BEGIN");


        // Check customer

        const customerResult = await client.query(
            `SELECT id
             FROM customers
             WHERE id = $1`,
            [customer_id]
        );

        if (customerResult.rows.length === 0) {
            throw new Error("Customer not found");
        }


        let totalAmount = 0;

        const challanItems = [];


        // Get products and calculate total

        for (const item of items) {

            const { product_id, quantity } = item;

            if (
                !product_id ||
                !quantity ||
                Number(quantity) <= 0
            ) {
                throw new Error(
                    "Invalid product or quantity"
                );
            }


            const productResult = await client.query(
                `SELECT
                    id,
                    product_name,
                    price
                 FROM products
                 WHERE id = $1`,
                [product_id]
            );


            if (productResult.rows.length === 0) {

                throw new Error(
                    `Product ${product_id} not found`
                );

            }


            const product =
                productResult.rows[0];

            const price =
                Number(product.price);

            const subtotal =
                price * Number(quantity);


            totalAmount += subtotal;


            challanItems.push({
                product_id,
                quantity: Number(quantity),
                price,
                subtotal
            });

        }


        // Create draft challan

        const challanResult = await client.query(
            `INSERT INTO sales_challans
            (
                customer_id,
                status,
                total_amount
            )
            VALUES ($1, 'Draft', $2)
            RETURNING *`,
            [
                customer_id,
                totalAmount
            ]
        );


        const challan =
            challanResult.rows[0];


        // Add challan items

        for (const item of challanItems) {

            await client.query(
                `INSERT INTO sales_challan_items
                (
                    challan_id,
                    product_id,
                    quantity,
                    price,
                    subtotal
                )
                VALUES ($1, $2, $3, $4, $5)`,
                [
                    challan.id,
                    item.product_id,
                    item.quantity,
                    item.price,
                    item.subtotal
                ]
            );

        }


        await client.query("COMMIT");


        return {
            success: true,
            message:
                "Sales challan created successfully",
            data: challan
        };


    } catch (error) {

        await client.query("ROLLBACK");

        throw error;


    } finally {

        client.release();

    }

};


// ======================================================
// GET ALL CHALLANS
// ======================================================

const getAllSalesChallans = async () => {

    const result = await pool.query({

        text: `
            SELECT
                sales_challans.id,
                sales_challans.customer_id,
                customers.customer_name,
                customers.company_name,
                sales_challans.challan_date,
                sales_challans.status,
                sales_challans.total_amount,

                COALESCE(
                    JSON_AGG(
                        JSON_BUILD_OBJECT(
                            'id',
                            sales_challan_items.id,

                            'product_id',
                            sales_challan_items.product_id,

                            'product_name',
                            products.product_name,

                            'sku',
                            products.sku,

                            'unit',
                            products.unit,

                            'quantity',
                            sales_challan_items.quantity,

                            'price',
                            sales_challan_items.price,

                            'subtotal',
                            sales_challan_items.subtotal
                        )
                        ORDER BY sales_challan_items.id
                    )
                    FILTER (
                        WHERE sales_challan_items.id IS NOT NULL
                    ),
                    '[]'::json
                ) AS items

            FROM sales_challans

            INNER JOIN customers
                ON sales_challans.customer_id =
                   customers.id

            LEFT JOIN sales_challan_items
                ON sales_challans.id =
                   sales_challan_items.challan_id

            LEFT JOIN products
                ON sales_challan_items.product_id =
                   products.id

            GROUP BY
                sales_challans.id,
                sales_challans.customer_id,
                customers.customer_name,
                customers.company_name,
                sales_challans.challan_date,
                sales_challans.status,
                sales_challans.total_amount

            ORDER BY sales_challans.id DESC
        `,

        statement_timeout: 5000

    });


    return {

        success: true,

        count: result.rows.length,

        data: result.rows

    };

};


// ======================================================
// GET CHALLAN BY ID
// ======================================================

const getSalesChallanById = async (id) => {

    const challanResult = await pool.query(

        `SELECT
            sales_challans.id,
            sales_challans.customer_id,
            customers.customer_name,
            customers.company_name,
            sales_challans.challan_date,
            sales_challans.status,
            sales_challans.total_amount

         FROM sales_challans

         INNER JOIN customers
            ON sales_challans.customer_id =
               customers.id

         WHERE sales_challans.id = $1`,

        [id]

    );


    if (
        challanResult.rows.length === 0
    ) {

        throw new Error(
            "Sales challan not found"
        );

    }


    const itemsResult = await pool.query(

        `SELECT
            sales_challan_items.id,
            sales_challan_items.product_id,
            products.product_name,
            products.sku,
            products.unit,
            sales_challan_items.quantity,
            sales_challan_items.price,
            sales_challan_items.subtotal

         FROM sales_challan_items

         INNER JOIN products
            ON sales_challan_items.product_id =
               products.id

         WHERE sales_challan_items.challan_id = $1

         ORDER BY sales_challan_items.id ASC`,

        [id]

    );


    return {

        success: true,

        data: {

            ...challanResult.rows[0],

            items: itemsResult.rows

        }

    };

};


// ======================================================
// CONFIRM CHALLAN AND REDUCE STOCK
// ======================================================

const confirmSalesChallan = async (
    id,
    userId
) => {

    const client = await pool.connect();

    try {

        await client.query("BEGIN");


        // Get challan

        const challanResult =
            await client.query(

                `SELECT *
                 FROM sales_challans
                 WHERE id = $1
                 FOR UPDATE`,

                [id]

            );


        if (
            challanResult.rows.length === 0
        ) {

            throw new Error(
                "Sales challan not found"
            );

        }


        const challan =
            challanResult.rows[0];


        // Only Draft challans can be confirmed

        if (
            challan.status !== "Draft"
        ) {

            throw new Error(
                `Only Draft challans can be confirmed. Current status: ${challan.status}`
            );

        }


        // Get challan items

        const itemsResult =
            await client.query(

                `SELECT
                    product_id,
                    quantity

                 FROM sales_challan_items

                 WHERE challan_id = $1`,

                [id]

            );


        if (
            itemsResult.rows.length === 0
        ) {

            throw new Error(
                "Sales challan has no items"
            );

        }


        // ==========================================
        // CHECK AND REDUCE STOCK
        // ==========================================

        for (
            const item
            of itemsResult.rows
        ) {

            const inventoryResult =
                await client.query(

                    `SELECT
                        products.product_name,
                        inventory.quantity

                     FROM products

                     LEFT JOIN inventory
                        ON products.id =
                           inventory.product_id

                     WHERE products.id = $1

                     FOR UPDATE OF products`,

                    [item.product_id]

                );


            // Product does not exist

            if (
                inventoryResult.rows.length === 0
            ) {

                throw new Error(
                    `Product ${item.product_id} not found`
                );

            }


            const productName =
                inventoryResult.rows[0]
                    .product_name;


            const availableStock =
                inventoryResult.rows[0]
                    .quantity;


            // No inventory

            if (
                availableStock === null ||
                availableStock === undefined ||
                Number(availableStock) <= 0
            ) {

                throw new Error(
                    `${productName} is not in stock`
                );

            }


            // Insufficient stock

            if (
                Number(availableStock) <
                Number(item.quantity)
            ) {

                throw new Error(
                    `Only ${availableStock} units of ${productName} are available`
                );

            }


            // Reduce inventory

            await client.query(

                `UPDATE inventory

                 SET
                    quantity =
                        quantity - $1,

                    updated_at =
                        CURRENT_TIMESTAMP

                 WHERE product_id = $2`,

                [
                    item.quantity,
                    item.product_id
                ]

            );


            // Create stock OUT movement

            await client.query(

                `INSERT INTO stock_movements
                (
                    product_id,
                    quantity,
                    movement_type,
                    reason,
                    created_by
                )

                VALUES
                (
                    $1,
                    $2,
                    'OUT',
                    $3,
                    $4
                )`,

                [
                    item.product_id,
                    item.quantity,
                    `Sales Challan #${id}`,
                    userId || null
                ]

            );

        }


        // Confirm challan

        const updatedResult =
            await client.query(

                `UPDATE sales_challans

                 SET status = 'Confirmed'

                 WHERE id = $1

                 RETURNING *`,

                [id]

            );


        await client.query("COMMIT");


        return {

            success: true,

            message:
                "Sales challan confirmed successfully",

            data:
                updatedResult.rows[0]

        };


    } catch (error) {

        await client.query("ROLLBACK");

        throw error;


    } finally {

        client.release();

    }

};


// ======================================================
// CANCEL CHALLAN
// ======================================================

const cancelSalesChallan = async (
    id,
    userId
) => {

    const client = await pool.connect();

    try {

        await client.query("BEGIN");


        // Get challan

        const challanResult =
            await client.query(

                `SELECT *
                 FROM sales_challans
                 WHERE id = $1
                 FOR UPDATE`,

                [id]

            );


        if (
            challanResult.rows.length === 0
        ) {

            throw new Error(
                "Sales challan not found"
            );

        }


        const challan =
            challanResult.rows[0];


        // Already cancelled

        if (
            challan.status === "Cancelled"
        ) {

            throw new Error(
                "Sales challan is already cancelled"
            );

        }


        // Get items

        const itemsResult =
            await client.query(

                `SELECT
                    product_id,
                    quantity

                 FROM sales_challan_items

                 WHERE challan_id = $1`,

                [id]

            );


        // Restore stock only for confirmed challan

        if (
            challan.status === "Confirmed"
        ) {

            for (
                const item
                of itemsResult.rows
            ) {

                const inventoryResult =
                    await client.query(

                        `SELECT id
                         FROM inventory
                         WHERE product_id = $1
                         FOR UPDATE`,

                        [item.product_id]

                    );


                if (
                    inventoryResult.rows.length === 0
                ) {

                    throw new Error(
                        `Inventory not found for product ${item.product_id}`
                    );

                }


                // Restore inventory

                await client.query(

                    `UPDATE inventory

                     SET
                        quantity =
                            quantity + $1,

                        updated_at =
                            CURRENT_TIMESTAMP

                     WHERE product_id = $2`,

                    [
                        item.quantity,
                        item.product_id
                    ]

                );


                // Create stock IN movement

                await client.query(

                    `INSERT INTO stock_movements
                    (
                        product_id,
                        quantity,
                        movement_type,
                        reason,
                        created_by
                    )

                    VALUES
                    (
                        $1,
                        $2,
                        'IN',
                        $3,
                        $4
                    )`,

                    [
                        item.product_id,
                        item.quantity,
                        `Cancelled Sales Challan #${id}`,
                        userId || null
                    ]

                );

            }

        }


        // Cancel challan

        const updatedResult =
            await client.query(

                `UPDATE sales_challans

                 SET status = 'Cancelled'

                 WHERE id = $1

                 RETURNING *`,

                [id]

            );


        await client.query("COMMIT");


        return {

            success: true,

            message:
                "Sales challan cancelled successfully",

            data:
                updatedResult.rows[0]

        };


    } catch (error) {

        await client.query("ROLLBACK");

        throw error;


    } finally {

        client.release();

    }

};


// ======================================================
// EXPORTS
// ======================================================

module.exports = {

    createSalesChallan,

    getAllSalesChallans,

    getSalesChallanById,

    confirmSalesChallan,

    cancelSalesChallan

};