const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({

    // Render PostgreSQL
    // Local PostgreSQL fallback
    connectionString:
        process.env.DATABASE_URL || undefined,

    host:
        process.env.DATABASE_URL
            ? undefined
            : process.env.DB_HOST,

    port:
        process.env.DATABASE_URL
            ? undefined
            : process.env.DB_PORT,

    user:
        process.env.DATABASE_URL
            ? undefined
            : process.env.DB_USER,

    password:
        process.env.DATABASE_URL
            ? undefined
            : process.env.DB_PASSWORD,

    database:
        process.env.DATABASE_URL
            ? undefined
            : process.env.DB_NAME,

    // Required for hosted PostgreSQL connections
    ssl:
        process.env.DATABASE_URL
            ? {
                rejectUnauthorized: false
            }
            : false
});

module.exports = pool;