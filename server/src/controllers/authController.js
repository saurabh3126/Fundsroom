const authService = require("../services/authService");

const login = async (req, res) => {
    try {
        const result = await authService.login(req.body);

        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    login,
};