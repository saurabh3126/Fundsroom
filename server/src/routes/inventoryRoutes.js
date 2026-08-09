const express = require("express");
const router = express.Router();

const inventoryController = require("../controllers/inventoryController");
const authMiddleware = require("../middleware/authMiddleware");

// Get All Inventory
router.get(
    "/",
    authMiddleware,
    inventoryController.getAllInventory
);

// Get Low Stock Inventory
router.get(
    "/low-stock",
    authMiddleware,
    inventoryController.getLowStockInventory
);

// Get Inventory By ID
router.get(
    "/:id",
    authMiddleware,
    inventoryController.getInventoryById
);

// Create Inventory
router.post(
    "/",
    authMiddleware,
    inventoryController.createInventory
);

// Update Inventory
router.put(
    "/:id",
    authMiddleware,
    inventoryController.updateInventory
);

// Delete Inventory
router.delete(
    "/:id",
    authMiddleware,
    inventoryController.deleteInventory
);

module.exports = router;