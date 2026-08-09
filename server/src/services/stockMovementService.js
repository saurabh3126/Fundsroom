const pool = require("../db/db");

// Create stock movement
const createStockMovement = async (data) => {

    const {
        product_id,
        quantity,
        movement_type,
        reason,
        created_by
    } = data;

    if (!product_id || !quantity || !movement_type || !reason) {
        throw new Error("All stock movement fields are required");
    }

    if (!["IN", "OUT"].includes(movement_type)) {
        throw new Error("Movement type must be IN or OUT");
    }

    if (quantity <= 0) {
        throw new Error("Quantity must be greater than 0");
    }

    // Check product
    const productResult = await pool.query(
        `SELECT id
         FROM products
         WHERE id = $1`,
        [product_id]
    );

    if (productResult.rows.length === 0) {
        throw new Error("Product not found");
    }

    // Insert movement
    const result = await pool.query(
        `INSERT INTO stock_movements
        (
            product_id,
            quantity,
            movement_type,
            reason,
            created_by
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *`,
        [
            product_id,
            quantity,
            movement_type,
            reason,
            created_by || null
        ]
    );

    return {
        success: true,
        message: "Stock movement created successfully",
        data: result.rows[0]
    };
};


// Get all stock movements
const getAllStockMovements = async () => {

    const result = await pool.query({
        text: `
            SELECT
                stock_movements.id,
                stock_movements.product_id,
                products.product_name,
                products.sku,
                stock_movements.quantity,
                stock_movements.movement_type,
                stock_movements.reason,
                stock_movements.created_by,
                stock_movements.created_at
            FROM stock_movements
            INNER JOIN products
                ON stock_movements.product_id = products.id
            ORDER BY stock_movements.id DESC
        `,
        statement_timeout: 5000
    });

    return {
        success: true,
        count: result.rows.length,
        data: result.rows
    };
};


module.exports = {
    createStockMovement,
    getAllStockMovements
};