const pool = require("../db/db");


// =========================================
// CREATE CUSTOMER
// =========================================

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
        customer_type = "Retail",
        status = "Lead",
        follow_up_date,
        notes = null
    } = data;


    // Empty date should become NULL
    const cleanFollowUpDate =
        follow_up_date &&
        follow_up_date.trim() !== ""
            ? follow_up_date
            : null;


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
            pincode,
            customer_type,
            status,
            follow_up_date,
            notes
        )
        VALUES
        (
            $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13
        )
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
            customer_type,
            status,
            cleanFollowUpDate,
            notes
        ]
    );


    return {
        success: true,
        message: "Customer created successfully",
        data: result.rows[0]
    };

};


// =========================================
// GET ALL CUSTOMERS
// =========================================

const getAllCustomers = async (
    page = 1,
    limit = 10
) => {

    page = Number(page);
    limit = Number(limit);


    if (page < 1) {
        page = 1;
    }


    if (limit < 1) {
        limit = 10;
    }


    const offset =
        (page - 1) * limit;


    const result = await pool.query(
        `SELECT *
         FROM customers
         ORDER BY id ASC
         LIMIT $1
         OFFSET $2`,
        [
            limit,
            offset
        ]
    );


    const countResult =
        await pool.query(
            `SELECT COUNT(*)
             FROM customers`
        );


    const totalCustomers =
        parseInt(
            countResult.rows[0].count
        );


    const totalPages =
        Math.ceil(
            totalCustomers / limit
        );


    return {

        success: true,

        page,

        limit,

        totalCustomers,

        totalPages,

        data: result.rows

    };

};


// =========================================
// GET CUSTOMER BY ID
// =========================================

const getCustomerById = async (id) => {

    const result = await pool.query(
        `SELECT *
         FROM customers
         WHERE id = $1`,
        [id]
    );


    if (
        result.rows.length === 0
    ) {

        throw new Error(
            "Customer not found"
        );

    }


    return {

        success: true,

        data: result.rows[0]

    };

};


// =========================================
// UPDATE CUSTOMER
// =========================================

const updateCustomer = async (
    id,
    data
) => {

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
        customer_type,
        status,
        follow_up_date,
        notes
    } = data;


    // Empty date should become NULL

    const cleanFollowUpDate =
        follow_up_date &&
        follow_up_date.trim() !== ""
            ? follow_up_date
            : null;


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
            pincode = $9,
            customer_type = $10,
            status = $11,
            follow_up_date = $12,
            notes = $13
         WHERE id = $14
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
            customer_type,
            status,
            cleanFollowUpDate,
            notes || null,
            id
        ]
    );


    if (
        result.rows.length === 0
    ) {

        throw new Error(
            "Customer not found"
        );

    }


    return {

        success: true,

        message:
            "Customer updated successfully",

        data: result.rows[0]

    };

};


// =========================================
// DELETE CUSTOMER
// =========================================

const deleteCustomer = async (id) => {

    const result = await pool.query(
        `DELETE FROM customers
         WHERE id = $1
         RETURNING *`,
        [id]
    );


    if (
        result.rows.length === 0
    ) {

        throw new Error(
            "Customer not found"
        );

    }


    return {

        success: true,

        message:
            "Customer deleted successfully",

        data: result.rows[0]

    };

};


// =========================================
// SEARCH CUSTOMERS
// =========================================

const searchCustomers = async (
    query
) => {

    const search =
        query?.trim() || "";


    const result = await pool.query(
        `SELECT *
         FROM customers
         WHERE
            customer_name ILIKE $1
            OR company_name ILIKE $1
            OR email ILIKE $1
            OR phone ILIKE $1
            OR gst_number ILIKE $1
            OR customer_type ILIKE $1
            OR status ILIKE $1
         ORDER BY id ASC`,
        [
            `%${search}%`
        ]
    );


    return {

        success: true,

        count:
            result.rows.length,

        data:
            result.rows

    };

};


module.exports = {

    createCustomer,

    getAllCustomers,

    getCustomerById,

    updateCustomer,

    deleteCustomer,

    searchCustomers

};