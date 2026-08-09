const pool = require("../db/db");

// Create Product
const createProduct = async (data) => {
    const {
        product_name,
        sku,
        description,
        category,
        unit,
        price,
    } = data;

    const result = await pool.query(
        `INSERT INTO products
        (
            product_name,
            sku,
            description,
            category,
            unit,
            price
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *`,
        [
            product_name,
            sku,
            description,
            category,
            unit,
            price,
        ]
    );

    return {
        success: true,
        message: "Product created successfully",
        data: result.rows[0],
    };
};

// Get All Products
const getAllProducts = async () => {
    const result = await pool.query(
        "SELECT * FROM products ORDER BY id ASC"
    );

    return {
        success: true,
        count: result.rows.length,
        data: result.rows,
    };
};

// Get Product By ID
const getProductById = async (id) => {
    const result = await pool.query(
        "SELECT * FROM products WHERE id = $1",
        [id]
    );

    if (result.rows.length === 0) {
        throw new Error("Product not found");
    }

    return {
        success: true,
        data: result.rows[0],
    };
};

// Update Product
const updateProduct = async (id, data) => {
    const {
        product_name,
        sku,
        description,
        category,
        unit,
        price,
    } = data;

    const result = await pool.query(
        `UPDATE products
         SET
            product_name = $1,
            sku = $2,
            description = $3,
            category = $4,
            unit = $5,
            price = $6
         WHERE id = $7
         RETURNING *`,
        [
            product_name,
            sku,
            description,
            category,
            unit,
            price,
            id,
        ]
    );

    if (result.rows.length === 0) {
        throw new Error("Product not found");
    }

    return {
        success: true,
        message: "Product updated successfully",
        data: result.rows[0],
    };
};
// Delete Product
const deleteProduct = async (id) => {
    const result = await pool.query(
        "DELETE FROM products WHERE id = $1 RETURNING *",
        [id]
    );

    if (result.rows.length === 0) {
        throw new Error("Product not found");
    }

    return {
        success: true,
        message: "Product deleted successfully",
        data: result.rows[0],
    };
};
// Search Products
const searchProducts = async (query) => {
    const result = await pool.query(
        `SELECT * FROM products
         WHERE product_name ILIKE $1
            OR sku ILIKE $1
            OR category ILIKE $1
            OR description ILIKE $1
         ORDER BY id ASC`,
        [`%${query}%`]
    );

    return {
        success: true,
        count: result.rows.length,
        data: result.rows,
    };
};

// Get Products With Pagination
const getProductsWithPagination = async (page, limit) => {
    const offset = (page - 1) * limit;

    // Get total number of products
    const countResult = await pool.query(
        "SELECT COUNT(*) FROM products"
    );

    const totalProducts = parseInt(countResult.rows[0].count);

    // Get products for current page
    const result = await pool.query(
        `SELECT * FROM products
         ORDER BY id ASC
         LIMIT $1 OFFSET $2`,
        [limit, offset]
    );

    const totalPages = Math.ceil(totalProducts / limit);

    return {
        success: true,
        page,
        limit,
        totalProducts,
        totalPages,
        data: result.rows,
    };
};
module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    searchProducts,
    getProductsWithPagination,
};