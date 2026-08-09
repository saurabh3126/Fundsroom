const express = require("express");

const router = express.Router();

const customerController =
    require("../controllers/customerController");

const authMiddleware =
    require("../middleware/authMiddleware");

const roleMiddleware =
    require("../middleware/roleMiddleware");


// =========================================
// GET ALL CUSTOMERS
// =========================================

router.get(
    "/",
    authMiddleware,
    roleMiddleware(
        "Admin",
        "Sales",
        "Warehouse",
        "Accounts"
    ),
    customerController.getAllCustomers
);


// =========================================
// SEARCH CUSTOMERS
// =========================================

router.get(
    "/search",
    authMiddleware,
    roleMiddleware(
        "Admin",
        "Sales",
        "Warehouse",
        "Accounts"
    ),
    customerController.searchCustomers
);


// =========================================
// GET CUSTOMER BY ID
// =========================================

router.get(
    "/:id",
    authMiddleware,
    roleMiddleware(
        "Admin",
        "Sales",
        "Warehouse",
        "Accounts"
    ),
    customerController.getCustomerById
);


// =========================================
// CREATE CUSTOMER
// =========================================

router.post(
    "/",
    authMiddleware,
    roleMiddleware(
        "Admin",
        "Sales"
    ),
    customerController.createCustomer
);


// =========================================
// UPDATE CUSTOMER
// =========================================

router.put(
    "/:id",
    authMiddleware,
    roleMiddleware(
        "Admin",
        "Sales"
    ),
    customerController.updateCustomer
);


// =========================================
// DELETE CUSTOMER
// =========================================

router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware(
        "Admin"
    ),
    customerController.deleteCustomer
);


module.exports = router;