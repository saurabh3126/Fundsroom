const pool = require("../db/db");

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

module.exports = {
    createCustomer,
};