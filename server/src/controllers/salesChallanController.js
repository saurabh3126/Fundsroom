const salesChallanService = require("../services/salesChallanService");

// Create challan
const createSalesChallan = async (req, res) => {
    try {
        const result =
            await salesChallanService.createSalesChallan(req.body);

        res.status(201).json(result);

    } catch (error) {
        console.error("Create Sales Challan Error:", error);

        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


// Get all challans
const getAllSalesChallans = async (req, res) => {
    try {
        const result =
            await salesChallanService.getAllSalesChallans();

        res.status(200).json(result);

    } catch (error) {
        console.error("Get Sales Challans Error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Get challan by ID
const getSalesChallanById = async (req, res) => {
    try {
        const result =
            await salesChallanService.getSalesChallanById(
                req.params.id
            );

        res.status(200).json(result);

    } catch (error) {
        console.error("Get Sales Challan Error:", error);

        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};


// Confirm challan
const confirmSalesChallan = async (req, res) => {
    try {
        const userId = req.user ? req.user.id : null;

        const result =
            await salesChallanService.confirmSalesChallan(
                req.params.id,
                userId
            );

        res.status(200).json(result);

    } catch (error) {
        console.error("Confirm Sales Challan Error:", error);

        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


// Cancel challan
const cancelSalesChallan = async (req, res) => {
    try {
        const userId = req.user ? req.user.id : null;

        const result =
            await salesChallanService.cancelSalesChallan(
                req.params.id,
                userId
            );

        res.status(200).json(result);

    } catch (error) {
        console.error("Cancel Sales Challan Error:", error);

        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


module.exports = {
    createSalesChallan,
    getAllSalesChallans,
    getSalesChallanById,
    confirmSalesChallan,
    cancelSalesChallan
};