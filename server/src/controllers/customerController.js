const customerService = require("../services/customerService");

const createCustomer = async (req, res) => {
    try {
        const result = await customerService.createCustomer(req.body);

        res.status(201).json(result);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    createCustomer,
};