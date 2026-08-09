const stockMovementService = require("../services/stockMovementService");

// Create stock movement
const createStockMovement = async (req, res) => {

    try {

        const data = {
            ...req.body,
            created_by: req.user ? req.user.id : null
        };

        const result =
            await stockMovementService.createStockMovement(data);

        res.status(201).json(result);

    } catch (error) {

        console.error("Create Stock Movement Error:", error);

        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


// Get all stock movements
const getAllStockMovements = async (req, res) => {

    try {

        const result =
            await stockMovementService.getAllStockMovements();

        res.status(200).json(result);

    } catch (error) {

        console.error("Get Stock Movements Error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


module.exports = {
    createStockMovement,
    getAllStockMovements
};