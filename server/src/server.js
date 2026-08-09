const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./db/db");

const authRoutes = require("./routes/authRoutes");
const customerRoutes = require("./routes/customerRoutes");
const productRoutes = require("./routes/productRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");

const authMiddleware = require("./middleware/authMiddleware");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/products", productRoutes);
app.use("/api/inventory", inventoryRoutes);

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
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Database Connection Failed",
        });
    }
});

// Protected Route
app.get("/api/profile", authMiddleware, (req, res) => {
    res.json({
        success: true,
        message: "Profile fetched successfully",
        user: req.user,
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});