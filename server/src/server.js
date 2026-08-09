const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./db/db");

const authRoutes = require("./routes/authRoutes");
const customerRoutes = require("./routes/customerRoutes");
const productRoutes = require("./routes/productRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const salesOrderRoutes = require("./routes/salesOrderRoutes");
const stockMovementRoutes = require("./routes/stockMovementRoutes");
const salesChallanRoutes = require("./routes/salesChallanRoutes");

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
app.use("/api/stock-movements", stockMovementRoutes);
app.use("/api/challans", salesChallanRoutes);

// Home route
app.get("/", (req, res) => {
    res.send("Fundsroom ERP Backend Running 🚀");
});

// Database test route
app.get("/test-db", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");

        res.json({
            success: true,
            serverTime: result.rows[0].now
        });

    } catch (error) {
        console.error("Database Error:", error);

        res.status(500).json({
            success: false,
            message: "Database Connection Failed"
        });
    }
});

// Check database tables
app.get("/test-tables", async (req, res) => {
    try {
        const dbResult = await pool.query(`
            SELECT
                current_database() AS database,
                current_schema() AS schema,
                current_user AS user
        `);

        const tableResult = await pool.query(`
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = 'public'
            ORDER BY table_name
        `);

        res.json({
            success: true,
            database: dbResult.rows[0],
            tables: tableResult.rows.map(row => row.table_name)
        });

    } catch (error) {
        console.error("Table Check Error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Protected profile route
app.get("/api/profile", authMiddleware, (req, res) => {
    res.json({
        success: true,
        message: "Profile fetched successfully",
        user: req.user
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});