const path = require("path");

require("dotenv").config({
    path: path.join(__dirname, "../.env"),
});
const bcrypt = require("bcrypt");
const pool = require("../src/db/db");

async function hashPasswords() {
    try {
        const result = await pool.query(
            "SELECT id, email, password FROM users"
        );

        for (const user of result.rows) {
            // Skip if password is already hashed
            if (user.password.startsWith("$2b$")) {
                console.log(`⏭️ Skipping ${user.email} (already hashed)`);
                continue;
            }

            const hashedPassword = await bcrypt.hash(user.password, 10);

            await pool.query(
                "UPDATE users SET password = $1 WHERE id = $2",
                [hashedPassword, user.id]
            );

            console.log(`✅ Password hashed for ${user.email}`);
        }

        console.log("\n🎉 Password hashing completed successfully.");

        process.exit(0);
    } catch (error) {
        console.error("❌ Error while hashing passwords:", error);
        process.exit(1);
    }
}

hashPasswords();