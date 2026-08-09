const customerService = require("../services/customerService");

// Create Customer
const createCustomer = async (req, res) => {
    try {
        const result = await customerService.createCustomer(req.body);

        res.status(201).json(result);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Get All Customers
// Get All Customers with Pagination
const getAllCustomers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const result = await customerService.getAllCustomers(
            page,
            limit
        );

        res.status(200).json(result);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Get Customer By ID
const getCustomerById = async (req, res) => {
    try {
        const result = await customerService.getCustomerById(req.params.id);

        res.status(200).json(result);
    } catch (error) {
        console.error(error);

        res.status(404).json({
            success: false,
            message: error.message,
        });
    }
};

// Update Customer
const updateCustomer = async (req, res) => {
    try {
        const result = await customerService.updateCustomer(
            req.params.id,
            req.body
        );

        res.status(200).json(result);
    } catch (error) {
        console.error(error);

        res.status(404).json({
            success: false,
            message: error.message,
        });
    }
};

// Delete Customer
const deleteCustomer = async (req, res) => {
    try {
        const result = await customerService.deleteCustomer(req.params.id);

        res.status(200).json(result);
    } catch (error) {
        console.error(error);

        res.status(404).json({
            success: false,
            message: error.message,
        });
    }
};

// Search Customers
const searchCustomers = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({
                success: false,
                message: "Search query is required",
            });
        }

        const result = await customerService.searchCustomers(query);

        res.status(200).json(result);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    createCustomer,
    getAllCustomers,
    getCustomerById,
    updateCustomer,
    deleteCustomer,
    searchCustomers,
};