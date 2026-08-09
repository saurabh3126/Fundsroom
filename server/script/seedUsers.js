const bcrypt = require("bcrypt");
const pool = require("../src/db/db");

const users = [
    {
        name: "Admin",
        email: "admin@fundsroom.com",
        password: "Admin@123",
        role: "Admin",
        phone: "9000000001"
    },
    {
        name: "Sales User",
        email: "sales@fundsroom.com",
        password: "Sales@123",
        role: "Sales",
        phone: "9000000002"
    },
    {
        name: "Warehouse User",
        email: "warehouse@fundsroom.com",
        password: "Warehouse@123",
        role: "Warehouse",
        phone: "9000000003"
    },
    {
        name: "Accounts User",
        email: "accounts@fundsroom.com",
        password: "Accounts@123",
        role: "Accounts",
        phone: "9000000004"
    }
];

async function seedUsers() {
    try {
        for (const user of users) {

            const existingUser = await pool.query(
                "SELECT id FROM users WHERE email = $1",
                [user.email]
            );

            if (existingUser.rows.length > 0) {
                console.log(
                    `${user.email} already exists - skipped`
                );
                continue;
            }

            const hashedPassword = await bcrypt.hash(
                user.password,
                10
            );

            await pool.query(
                `INSERT INTO users
                (name, email, password, role, phone)
                VALUES ($1, $2, $3, $4, $5)`,
                [
                    user.name,
                    user.email,
                    hashedPassword,
                    user.role,
                    user.phone
                ]
            );

            console.log(
                `${user.role} user created: ${user.email}`
            );
        }

        console.log("User seeding completed.");

    } catch (error) {
        console.error("Error seeding users:", error);
    } finally {
        await pool.end();
    }
}

seedUsers();