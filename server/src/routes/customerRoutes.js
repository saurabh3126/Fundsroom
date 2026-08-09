const express = require("express");
const router = express.Router();

const customerController = require("../controllers/customerController");
const authMiddleware = require("../middleware/authMiddleware");

// Create Customer
router.post("/", authMiddleware, customerController.createCustomer);

module.exports = router;