const express = require("express");
const router = express.Router();

const productController = require("../controllers/productController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Get All Products
router.get(
    "/",
    authMiddleware,
    roleMiddleware("Admin", "Sales", "Warehouse", "Accounts"),
    productController.getAllProducts
);

// Search Products
router.get(
    "/search",
    authMiddleware,
    roleMiddleware("Admin", "Sales", "Warehouse", "Accounts"),
    productController.searchProducts
);

// Get Products With Pagination
router.get(
    "/pagination",
    authMiddleware,
    roleMiddleware("Admin", "Sales", "Warehouse", "Accounts"),
    productController.getProductsWithPagination
);

// Get Product By ID
router.get(
    "/:id",
    authMiddleware,
    roleMiddleware("Admin", "Sales", "Warehouse", "Accounts"),
    productController.getProductById
);

// Create Product
router.post(
    "/",
    authMiddleware,
    roleMiddleware("Admin", "Warehouse"),
    productController.createProduct
);

// Update Product
router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("Admin", "Warehouse"),
    productController.updateProduct
);

// Delete Product
router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("Admin"),
    productController.deleteProduct
);

module.exports = router;