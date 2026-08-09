const salesOrderService = require("../services/salesOrderService");

// =====================================================
// CREATE SALES ORDER
// =====================================================
const createSalesOrder = async (req, res) => {
    try {
        const result = await salesOrderService.createSalesOrder(
            req.body
        );

        res.status(201).json(result);

    } catch (error) {
        console.error(
            "Create Sales Order Error:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// =====================================================
// GET ALL SALES ORDERS
// =====================================================
const getAllSalesOrders = async (req, res) => {
    try {
        const result =
            await salesOrderService.getAllSalesOrders();

        res.status(200).json(result);

    } catch (error) {
        console.error(
            "Get All Sales Orders Error:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// =====================================================
// GET SALES ORDER BY ID
// =====================================================
const getSalesOrderById = async (req, res) => {
    try {
        const result =
            await salesOrderService.getSalesOrderById(
                req.params.id
            );

        res.status(200).json(result);

    } catch (error) {
        console.error(
            "Get Sales Order By ID Error:",
            error
        );

        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};


// =====================================================
// UPDATE SALES ORDER STATUS
// =====================================================
const updateSalesOrderStatus = async (req, res) => {
    try {
        const result =
            await salesOrderService.updateSalesOrderStatus(
                req.params.id,
                req.body.status
            );

        res.status(200).json(result);

    } catch (error) {
        console.error(
            "Update Sales Order Status Error:",
            error
        );

        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


// =====================================================
// CANCEL SALES ORDER
// =====================================================
const cancelSalesOrder = async (req, res) => {
    try {
        const result =
            await salesOrderService.cancelSalesOrder(
                req.params.id
            );

        res.status(200).json(result);

    } catch (error) {
        console.error(
            "Cancel Sales Order Error:",
            error
        );

        res.status(400).json({
            success: false,
            message: error.message
        });
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