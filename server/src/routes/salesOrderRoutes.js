const express = require("express");
const router = express.Router();

const salesOrderController = require("../controllers/salesOrderController");
const authMiddleware = require("../middleware/authMiddleware");


// =====================================================
// GET ALL SALES ORDERS
// =====================================================
router.get(
    "/",
    authMiddleware,
    salesOrderController.getAllSalesOrders
);


// =====================================================
// CANCEL SALES ORDER
// =====================================================
router.put(
    "/:id/cancel",
    authMiddleware,
    salesOrderController.cancelSalesOrder
);


// =====================================================
// UPDATE SALES ORDER STATUS
// =====================================================
router.put(
    "/:id/status",
    authMiddleware,
    salesOrderController.updateSalesOrderStatus
);


// =====================================================
// GET SALES ORDER BY ID
// =====================================================
router.get(
    "/:id",
    authMiddleware,
    salesOrderController.getSalesOrderById
);


// =====================================================
// CREATE SALES ORDER
// =====================================================
router.post(
    "/",
    authMiddleware,
    salesOrderController.createSalesOrder
);


module.exports = router;