const productService = require("../services/productService");

// Create Product
const createProduct = async (req, res) => {
    try {
        const result = await productService.createProduct(req.body);

        res.status(201).json(result);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Get All Products
const getAllProducts = async (req, res) => {
    try {
        const result = await productService.getAllProducts();

        res.status(200).json(result);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Get Product By ID
const getProductById = async (req, res) => {
    try {
        const result = await productService.getProductById(req.params.id);

        res.status(200).json(result);
    } catch (error) {
        console.error(error);

        res.status(404).json({
            success: false,
            message: error.message,
        });
    }
};

// Update Product
const updateProduct = async (req, res) => {
    try {
        const result = await productService.updateProduct(
            req.params.id,
            req.body
        );

        res.status(200).json(result);
    } catch (error) {
        console.error(error);

        res.status(404).json({
            success: false,
            message: error.message,
        });
    }
};
// Delete Product
const deleteProduct = async (req, res) => {
    try {
        const result = await productService.deleteProduct(req.params.id);

        res.status(200).json(result);
    } catch (error) {
        console.error(error);

        res.status(404).json({
            success: false,
            message: error.message,
        });
    }
};
// Search Products
const searchProducts = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({
                success: false,
                message: "Search query is required",
            });
        }

        const result = await productService.searchProducts(query);

        res.status(200).json(result);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
// Get Products With Pagination
const getProductsWithPagination = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        if (page < 1 || limit < 1) {
            return res.status(400).json({
                success: false,
                message: "Page and limit must be greater than 0",
            });
        }

        const result = await productService.getProductsWithPagination(
            page,
            limit
        );

        res.status(200).json(result);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    searchProducts,
    getProductsWithPagination,
};
