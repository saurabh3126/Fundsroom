const pool = require("../db/db");

// =====================================================
// CREATE SALES ORDER
// =====================================================
const createSalesOrder = async (data) => {
    if (!data) {
        throw new Error("Request body is missing");
    }

    const {
        customer_id,
        items
    } = data;

    if (!customer_id || !items || items.length === 0) {
        throw new Error("Customer and order items are required");
    }

    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        // Check customer
        const customerResult = await client.query(
            `SELECT *
             FROM customers
             WHERE id = $1`,
            [customer_id]
        );

        if (customerResult.rows.length === 0) {
            throw new Error("Customer not found");
        }

        let totalAmount = 0;
        const orderItems = [];

        // Check products and inventory
        for (const item of items) {
            const {
                product_id,
                quantity
            } = item;

            if (!product_id || !quantity || quantity <= 0) {
                throw new Error("Invalid product or quantity");
            }

            // Get product
            const productResult = await client.query(
                `SELECT *
                 FROM products
                 WHERE id = $1`,
                [product_id]
            );

            if (productResult.rows.length === 0) {
                throw new Error(
                    `Product ${product_id} not found`
                );
            }

            const product = productResult.rows[0];

            // Get inventory and lock the row
            const inventoryResult = await client.query(
                `SELECT *
                 FROM inventory
                 WHERE product_id = $1
                 FOR UPDATE`,
                [product_id]
            );

            if (inventoryResult.rows.length === 0) {
                throw new Error(
                    `Inventory not found for product ${product_id}`
                );
            }

            const inventory = inventoryResult.rows[0];

            // Check stock
            if (inventory.quantity < quantity) {
                throw new Error(
                    `Insufficient stock for ${product.product_name}. Available: ${inventory.quantity}`
                );
            }

            // Calculate price
            const price = Number(product.price);
            const subtotal = price * quantity;

            totalAmount += subtotal;

            orderItems.push({
                product_id,
                quantity,
                price,
                subtotal
            });

            // Deduct inventory
            await client.query(
                `UPDATE inventory
                 SET quantity = quantity - $1,
                     updated_at = CURRENT_TIMESTAMP
                 WHERE product_id = $2`,
                [
                    quantity,
                    product_id
                ]
            );
        }

        // Create sales order
        const orderResult = await client.query(
            `INSERT INTO sales_orders
            (
                customer_id,
                status,
                total_amount
            )
            VALUES ($1, $2, $3)
            RETURNING *`,
            [
                customer_id,
                "Pending",
                totalAmount
            ]
        );

        const order = orderResult.rows[0];

        // Create order items
        for (const item of orderItems) {
            await client.query(
                `INSERT INTO sales_order_items
                (
                    sales_order_id,
                    product_id,
                    quantity,
                    price,
                    subtotal
                )
                VALUES ($1, $2, $3, $4, $5)`,
                [
                    order.id,
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
            message: "Sales order created successfully",
            data: order
        };

    } catch (error) {
        await client.query("ROLLBACK");
        throw error;

    } finally {
        client.release();
    }
};


// =====================================================
// GET ALL SALES ORDERS
// =====================================================
const getAllSalesOrders = async () => {

    const result = await pool.query({
        text: `
            SELECT
                sales_orders.id,
                sales_orders.customer_id,
                customers.customer_name,
                customers.company_name,
                sales_orders.order_date,
                sales_orders.status,
                sales_orders.total_amount
            FROM sales_orders
            INNER JOIN customers
                ON sales_orders.customer_id = customers.id
            ORDER BY sales_orders.id ASC
        `,
        statement_timeout: 5000
    });

    return {
        success: true,
        count: result.rows.length,
        data: result.rows
    };
};


// =====================================================
// GET SALES ORDER BY ID
// =====================================================
const getSalesOrderById = async (id) => {

    const orderResult = await pool.query({
        text: `
            SELECT
                sales_orders.id,
                sales_orders.customer_id,
                customers.customer_name,
                customers.company_name,
                sales_orders.order_date,
                sales_orders.status,
                sales_orders.total_amount
            FROM sales_orders
            INNER JOIN customers
                ON sales_orders.customer_id = customers.id
            WHERE sales_orders.id = $1
        `,
        values: [id],
        statement_timeout: 5000
    });

    if (orderResult.rows.length === 0) {
        throw new Error("Sales order not found");
    }

    const order = orderResult.rows[0];

    // Get order items
    const itemsResult = await pool.query({
        text: `
            SELECT
                sales_order_items.id,
                sales_order_items.product_id,
                products.product_name,
                products.sku,
                sales_order_items.quantity,
                sales_order_items.price,
                sales_order_items.subtotal
            FROM sales_order_items
            INNER JOIN products
                ON sales_order_items.product_id = products.id
            WHERE sales_order_items.sales_order_id = $1
            ORDER BY sales_order_items.id ASC
        `,
        values: [id],
        statement_timeout: 5000
    });

    return {
        success: true,
        data: {
            ...order,
            items: itemsResult.rows
        }
    };
};


// =====================================================
// UPDATE SALES ORDER STATUS
// =====================================================
const updateSalesOrderStatus = async (id, status) => {

    const allowedStatuses = [
        "Pending",
        "Confirmed",
        "Completed",
        "Cancelled"
    ];

    if (!allowedStatuses.includes(status)) {
        throw new Error(
            "Invalid status. Allowed: Pending, Confirmed, Completed, Cancelled"
        );
    }

    const result = await pool.query(
        `UPDATE sales_orders
         SET status = $1
         WHERE id = $2
         RETURNING *`,
        [
            status,
            id
        ]
    );

    if (result.rows.length === 0) {
        throw new Error("Sales order not found");
    }

    return {
        success: true,
        message: "Sales order status updated successfully",
        data: result.rows[0]
    };
};


// =====================================================
// CANCEL SALES ORDER
// =====================================================
const cancelSalesOrder = async (id) => {

    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        // Get order and lock it
        const orderResult = await client.query(
            `SELECT *
             FROM sales_orders
             WHERE id = $1
             FOR UPDATE`,
            [id]
        );

        if (orderResult.rows.length === 0) {
            throw new Error("Sales order not found");
        }

        const order = orderResult.rows[0];

        // Already cancelled
        if (order.status === "Cancelled") {
            throw new Error("Sales order is already cancelled");
        }

        // Completed orders cannot be cancelled
        if (order.status === "Completed") {
            throw new Error("Completed order cannot be cancelled");
        }

        // Get order items
        const itemsResult = await client.query(
            `SELECT
                product_id,
                quantity
             FROM sales_order_items
             WHERE sales_order_id = $1`,
            [id]
        );

        // Restore inventory
        for (const item of itemsResult.rows) {

            const inventoryResult = await client.query(
                `SELECT id
                 FROM inventory
                 WHERE product_id = $1
                 FOR UPDATE`,
                [item.product_id]
            );

            if (inventoryResult.rows.length === 0) {
                throw new Error(
                    `Inventory not found for product ${item.product_id}`
                );
            }

            await client.query(
                `UPDATE inventory
                 SET quantity = quantity + $1,
                     updated_at = CURRENT_TIMESTAMP
                 WHERE product_id = $2`,
                [
                    item.quantity,
                    item.product_id
                ]
            );
        }

        // Change status to Cancelled
        const updatedOrder = await client.query(
            `UPDATE sales_orders
             SET status = 'Cancelled'
             WHERE id = $1
             RETURNING *`,
            [id]
        );

        await client.query("COMMIT");

        return {
            success: true,
            message: "Sales order cancelled successfully",
            data: updatedOrder.rows[0]
        };

    } catch (error) {
        await client.query("ROLLBACK");
        throw error;

    } finally {
        client.release();
    }
};


// =====================================================
// EXPORT
// =====================================================
module.exports = {
    createSalesOrder,
    getAllSalesOrders,
    getSalesOrderById,
    updateSalesOrderStatus,
    cancelSalesOrder
};