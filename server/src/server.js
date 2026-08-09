const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./db/db");

const authRoutes = require("./routes/authRoutes");
const customerRoutes = require("./routes/customerRoutes");
const productRoutes = require("./routes/productRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const salesOrderRoutes = require("./routes/salesOrderRoutes");

const authMiddleware = require("./middleware/authMiddleware");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/products", productRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/orders", salesOrderRoutes);

// Home Route
app.get("/", (req, res) => {
    res.send("Fundsroom ERP Backend Running 🚀");
});

// Database Test Route
app.get("/test-db", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");

        res.json({
            success: true,
            serverTime: result.rows[0].now,
        });
    } catch (error) {
        console.error("Database Error:", error);

        res.status(500).json({
            success: false,
            message: "Database Connection Failed",
        });
    }
});

// Protected Profile Route
app.get("/api/profile", authMiddleware, (req, res) => {
    res.json({
        success: true,
        message: "Profile fetched successfully",
        user: req.user,
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});