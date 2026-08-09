const inventoryService = require("../services/inventoryService");

// Create Inventory
const createInventory = async (req, res) => {
    try {
        const result = await inventoryService.createInventory(req.body);

        res.status(201).json(result);
    } catch (error) {
        console.error("Create Inventory Error:", error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Get All Inventory
const getAllInventory = async (req, res) => {
    try {
        const result = await inventoryService.getAllInventory();

        res.status(200).json(result);
    } catch (error) {
        console.error("GET INVENTORY ERROR:", error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Get Inventory By ID
const getInventoryById = async (req, res) => {
    try {
        const result = await inventoryService.getInventoryById(
            req.params.id
        );

        res.status(200).json(result);
    } catch (error) {
        console.error("GET INVENTORY BY ID ERROR:", error);

        res.status(404).json({
            success: false,
            message: error.message,
        });
    }
};

// Update Inventory
const updateInventory = async (req, res) => {
    try {
        const result = await inventoryService.updateInventory(
            req.params.id,
            req.body
        );

        res.status(200).json(result);
    } catch (error) {
        console.error("UPDATE INVENTORY ERROR:", error);

        res.status(404).json({
            success: false,
            message: error.message,
        });
    }
};

// Delete Inventory
const deleteInventory = async (req, res) => {
    try {
        const result = await inventoryService.deleteInventory(
            req.params.id
        );

        res.status(200).json(result);
    } catch (error) {
        console.error("DELETE INVENTORY ERROR:", error);

        res.status(404).json({
            success: false,
            message: error.message,
        });
    }
};

// Get Low Stock Inventory
const getLowStockInventory = async (req, res) => {
    try {
        const result = await inventoryService.getLowStockInventory();

        res.status(200).json(result);
    } catch (error) {
        console.error("GET LOW STOCK ERROR:", error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    createInventory,
    getAllInventory,
    getInventoryById,
    updateInventory,
    deleteInventory,
    getLowStockInventory,
};