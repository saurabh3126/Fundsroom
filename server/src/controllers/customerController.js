const customerService = require("../services/customerService");


// =========================================
// CREATE CUSTOMER
// =========================================

const createCustomer = async (req, res) => {

    try {

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
        } = req.body;


        // Required fields

        if (
            !customer_name ||
            !company_name ||
            !address ||
            !city ||
            !state ||
            !pincode
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Customer name, company name, address, city, state and pincode are required."

            });

        }


        // Validate customer type

        const validTypes = [
            "Retail",
            "Wholesale",
            "Distributor"
        ];


        if (
            customer_type &&
            !validTypes.includes(
                customer_type
            )
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Customer type must be Retail, Wholesale or Distributor."

            });

        }


        // Validate status

        const validStatuses = [
            "Lead",
            "Active",
            "Inactive"
        ];


        if (
            status &&
            !validStatuses.includes(
                status
            )
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Status must be Lead, Active or Inactive."

            });

        }


        const result =
            await customerService.createCustomer(
                req.body
            );


        return res.status(201).json(
            result
        );


    } catch (error) {

        console.error(
            "Create Customer Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                error.message

        });

    }

};


// =========================================
// GET ALL CUSTOMERS
// =========================================

const getAllCustomers = async (req, res) => {

    try {

        const page =
            parseInt(
                req.query.page
            ) || 1;


        const limit =
            parseInt(
                req.query.limit
            ) || 10;


        const result =
            await customerService.getAllCustomers(
                page,
                limit
            );


        return res.status(200).json(
            result
        );


    } catch (error) {

        console.error(
            "Get Customers Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                error.message

        });

    }

};


// =========================================
// GET CUSTOMER BY ID
// =========================================

const getCustomerById = async (
    req,
    res
) => {

    try {

        const result =
            await customerService.getCustomerById(
                req.params.id
            );


        return res.status(200).json(
            result
        );


    } catch (error) {

        console.error(
            "Get Customer Error:",
            error
        );


        return res.status(404).json({

            success: false,

            message:
                error.message

        });

    }

};


// =========================================
// UPDATE CUSTOMER
// =========================================

const updateCustomer = async (
    req,
    res
) => {

    try {

        const {
            customer_type,
            status
        } = req.body;


        const validTypes = [
            "Retail",
            "Wholesale",
            "Distributor"
        ];


        if (
            customer_type &&
            !validTypes.includes(
                customer_type
            )
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Customer type must be Retail, Wholesale or Distributor."

            });

        }


        const validStatuses = [
            "Lead",
            "Active",
            "Inactive"
        ];


        if (
            status &&
            !validStatuses.includes(
                status
            )
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Status must be Lead, Active or Inactive."

            });

        }


        const result =
            await customerService.updateCustomer(
                req.params.id,
                req.body
            );


        return res.status(200).json(
            result
        );


    } catch (error) {

        console.error(
            "Update Customer Error:",
            error
        );


        return res.status(404).json({

            success: false,

            message:
                error.message

        });

    }

};


// =========================================
// DELETE CUSTOMER
// =========================================

const deleteCustomer = async (
    req,
    res
) => {

    try {

        const result =
            await customerService.deleteCustomer(
                req.params.id
            );


        return res.status(200).json(
            result
        );


    } catch (error) {

        console.error(
            "Delete Customer Error:",
            error
        );


        return res.status(404).json({

            success: false,

            message:
                error.message

        });

    }

};


// =========================================
// SEARCH CUSTOMERS
// =========================================

const searchCustomers = async (
    req,
    res
) => {

    try {

        const {
            query
        } = req.query;


        if (
            !query ||
            !query.trim()
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Search query is required."

            });

        }


        const result =
            await customerService.searchCustomers(
                query
            );


        return res.status(200).json(
            result
        );


    } catch (error) {

        console.error(
            "Search Customers Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                error.message

        });

    }

};


// =========================================
// EXPORT
// =========================================

module.exports = {

    createCustomer,

    getAllCustomers,

    getCustomerById,

    updateCustomer,

    deleteCustomer,

    searchCustomers

};