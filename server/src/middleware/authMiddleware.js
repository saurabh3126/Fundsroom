const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    try {
        console.log("AUTH MIDDLEWARE STARTED");

        const authHeader = req.headers.authorization;

        if (!authHeader) {
            console.log("NO AUTHORIZATION HEADER");

            return res.status(401).json({
                success: false,
                message: "Access denied. No token provided.",
            });
        }

        if (!authHeader.startsWith("Bearer ")) {
            console.log("INVALID AUTHORIZATION FORMAT");

            return res.status(401).json({
                success: false,
                message: "Invalid authorization format.",
            });
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            console.log("TOKEN MISSING");

            return res.status(401).json({
                success: false,
                message: "Token is missing.",
            });
        }

        console.log("TOKEN RECEIVED");

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        console.log("TOKEN VERIFIED");

        req.user = decoded;

        next();

    } catch (error) {
        console.error("AUTH ERROR:", error.message);

        return res.status(401).json({
            success: false,
            message: "Invalid or expired token.",
        });
    }
};

module.exports = authMiddleware;