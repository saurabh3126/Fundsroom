const express = require("express");
const router = express.Router();

const customerController = require("../controllers/customerController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Get All Customers
router.get(
    "/",
    authMiddleware,
    roleMiddleware("Admin", "Sales", "Warehouse", "Accounts"),
    customerController.getAllCustomers
);

// Search Customers
router.get(
    "/search",
    authMiddleware,
    roleMiddleware("Admin", "Sales", "Warehouse", "Accounts"),
    customerController.searchCustomers
);

// Get Customer By ID
router.get(
    "/:id",
    authMiddleware,
    roleMiddleware("Admin", "Sales", "Warehouse", "Accounts"),
    customerController.getCustomerById
);

// Create Customer
router.post(
    "/",
    authMiddleware,
    roleMiddleware("Admin", "Sales"),
    customerController.createCustomer
);

// Update Customer
router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("Admin", "Sales"),
    customerController.updateCustomer
);

// Delete Customer
router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("Admin"),
    customerController.deleteCustomer
);

module.exports = router;