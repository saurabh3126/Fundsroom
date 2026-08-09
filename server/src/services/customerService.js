const pool = require("../db/db");

// Create Customer
const createCustomer = async (data) => {
    const {
        customer_name,
        company_name,
        email,
        phone,
        gst_number,
        address,
        city,
        state,
        pincode,
    } = data;

    const result = await pool.query(
        `INSERT INTO customers
        (
            customer_name,
            company_name,
            email,
            phone,
            gst_number,
            address,
            city,
            state,
            pincode
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
        RETURNING *`,
        [
            customer_name,
            company_name,
            email,
            phone,
            gst_number,
            address,
            city,
            state,
            pincode,
        ]
    );

    return {
        success: true,
        message: "Customer created successfully",
        data: result.rows[0],
    };
};

// Get All Customers
// Get All Customers with Pagination
const getAllCustomers = async (page = 1, limit = 10) => {
    const offset = (page - 1) * limit;

    // Get customers for current page
    const result = await pool.query(
        `SELECT * FROM customers
         ORDER BY id ASC
         LIMIT $1 OFFSET $2`,
        [limit, offset]
    );

    // Get total number of customers
    const countResult = await pool.query(
        "SELECT COUNT(*) FROM customers"
    );

    const totalCustomers = parseInt(countResult.rows[0].count);

    const totalPages = Math.ceil(totalCustomers / limit);

    return {
        success: true,
        page,
        limit,
        totalCustomers,
        totalPages,
        data: result.rows,
    };
};

// Get Customer By ID
const getCustomerById = async (id) => {
    const result = await pool.query(
        "SELECT * FROM customers WHERE id = $1",
        [id]
    );

    if (result.rows.length === 0) {
        throw new Error("Customer not found");
    }

    return {
        success: true,
        data: result.rows[0],
    };
};

// Update Customer
const updateCustomer = async (id, data) => {
    const {
        customer_name,
        company_name,
        email,
        phone,
        gst_number,
        address,
        city,
        state,
        pincode,
    } = data;

    const result = await pool.query(
        `UPDATE customers
         SET
            customer_name = $1,
            company_name = $2,
            email = $3,
            phone = $4,
            gst_number = $5,
            address = $6,
            city = $7,
            state = $8,
            pincode = $9
         WHERE id = $10
         RETURNING *`,
        [
            customer_name,
            company_name,
            email,
            phone,
            gst_number,
            address,
            city,
            state,
            pincode,
            id,
        ]
    );

    if (result.rows.length === 0) {
        throw new Error("Customer not found");
    }

    return {
        success: true,
        message: "Customer updated successfully",
        data: result.rows[0],
    };
};

// Delete Customer
const deleteCustomer = async (id) => {
    const result = await pool.query(
        "DELETE FROM customers WHERE id = $1 RETURNING *",
        [id]
    );

    if (result.rows.length === 0) {
        throw new Error("Customer not found");
    }

    return {
        success: true,
        message: "Customer deleted successfully",
        data: result.rows[0],
    };
};

// Search Customers
const searchCustomers = async (query) => {
    const result = await pool.query(
        `SELECT * FROM customers
         WHERE customer_name ILIKE $1
            OR company_name ILIKE $1
            OR email ILIKE $1
            OR phone ILIKE $1
            OR gst_number ILIKE $1
         ORDER BY id ASC`,
        [`%${query}%`]
    );

    return {
        success: true,
        count: result.rows.length,
        data: result.rows,
    };
};

module.exports = {
    createCustomer,
    getAllCustomers,
    getCustomerById,
    updateCustomer,
    deleteCustomer,
    searchCustomers,
};