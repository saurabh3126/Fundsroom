const pool = require("../db/db");

// Create Inventory
const createInventory = async (data) => {
    const {
        product_id,
        quantity,
        minimum_stock,
    } = data;

    const result = await pool.query(
        `INSERT INTO inventory
        (
            product_id,
            quantity,
            minimum_stock
        )
        VALUES ($1, $2, $3)
        RETURNING *`,
        [
            product_id,
            quantity,
            minimum_stock,
        ]
    );

    return {
        success: true,
        message: "Inventory created successfully",
        data: result.rows[0],
    };
};

// Get All Inventory
const getAllInventory = async () => {
    console.log("SERVICE STARTED");

    const result = await pool.query({
        text: "SELECT * FROM inventory ORDER BY id ASC",
        statement_timeout: 5000
    });

    console.log("DATABASE QUERY FINISHED");

    return {
        success: true,
        count: result.rows.length,
        data: result.rows,
    };
};

// Get Inventory By ID
const getInventoryById = async (id) => {
    const result = await pool.query({
        text: `SELECT
                inventory.id,
                inventory.product_id,
                products.product_name,
                products.sku,
                inventory.quantity,
                inventory.minimum_stock,
                inventory.updated_at
            FROM inventory
            INNER JOIN products
                ON inventory.product_id = products.id
            WHERE inventory.id = $1`,
        values: [id],
        statement_timeout: 5000
    });

    if (result.rows.length === 0) {
        throw new Error("Inventory not found");
    }

    return {
        success: true,
        data: result.rows[0],
    };
};

// Update Inventory
const updateInventory = async (id, data) => {
    const {
        quantity,
        minimum_stock,
    } = data;

    const result = await pool.query({
        text: `UPDATE inventory
               SET
                   quantity = $1,
                   minimum_stock = $2,
                   updated_at = CURRENT_TIMESTAMP
               WHERE id = $3
               RETURNING *`,
        values: [
            quantity,
            minimum_stock,
            id,
        ],
        statement_timeout: 5000
    });

    if (result.rows.length === 0) {
        throw new Error("Inventory not found");
    }

    return {
        success: true,
        message: "Inventory updated successfully",
        data: result.rows[0],
    };
};
// Delete Inventory
const deleteInventory = async (id) => {
    const result = await pool.query({
        text: `DELETE FROM inventory
               WHERE id = $1
               RETURNING *`,
        values: [id],
        statement_timeout: 5000
    });

    if (result.rows.length === 0) {
        throw new Error("Inventory not found");
    }

    return {
        success: true,
        message: "Inventory deleted successfully",
        data: result.rows[0],
    };
};
// Get Low Stock Inventory
const getLowStockInventory = async () => {
    const result = await pool.query({
        text: `SELECT
                inventory.id,
                inventory.product_id,
                products.product_name,
                products.sku,
                inventory.quantity,
                inventory.minimum_stock,
                inventory.updated_at
              FROM inventory
              INNER JOIN products
                  ON inventory.product_id = products.id
              WHERE inventory.quantity <= inventory.minimum_stock
              ORDER BY inventory.quantity ASC`,
        statement_timeout: 5000
    });

    return {
        success: true,
        count: result.rows.length,
        data: result.rows,
    };
};

module.exports = {
    createInventory,
    getAllInventory,
    getInventoryById,
    updateInventory,
    deleteInventory,
    getLowStockInventory,
};