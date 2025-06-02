require("dotenv").config();
const mysql = require("mysql");

// Create MySQL Connection
const db = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "Sakshi@2004",
    database: process.env.DB_NAME || "library",
    multipleStatements: true // Allows multiple SQL statements in one query
});

// Connect to MySQL
db.connect(err => {
    if (err) {
        console.error("❌ Database connection failed: " + err.message);
        process.exit(1); 
    } else {
        console.log("✅ Connected to MySQL Database");
    }
});


db.on("error", (err) => {
    console.error("⚠️ MySQL Error: ", err);
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
        console.log("🔄 Reconnecting to MySQL...");
        db.connect();
    } else {
        throw err;
    }
});

module.exports = db;
