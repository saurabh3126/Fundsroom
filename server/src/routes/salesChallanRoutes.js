const express = require("express");

const router = express.Router();

const salesChallanController =
    require("../controllers/salesChallanController");

const authMiddleware =
    require("../middleware/authMiddleware");

// Get all challans
router.get(
    "/",
    authMiddleware,
    salesChallanController.getAllSalesChallans
);

// Confirm challan
router.put(
    "/:id/confirm",
    authMiddleware,
    salesChallanController.confirmSalesChallan
);

// Cancel challan
router.put(
    "/:id/cancel",
    authMiddleware,
    salesChallanController.cancelSalesChallan
);

// Get challan by ID
router.get(
    "/:id",
    authMiddleware,
    salesChallanController.getSalesChallanById
);

// Create challan
router.post(
    "/",
    authMiddleware,
    salesChallanController.createSalesChallan
);

module.exports = router;