const express = require("express");

const router = express.Router();

const stockMovementController =
    require("../controllers/stockMovementController");

const authMiddleware =
    require("../middleware/authMiddleware");

// Get all stock movements
router.get(
    "/",
    authMiddleware,
    stockMovementController.getAllStockMovements
);

// Create stock movement
router.post(
    "/",
    authMiddleware,
    stockMovementController.createStockMovement
);

module.exports = router;