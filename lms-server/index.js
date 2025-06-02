require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const bookRoutes = require("./routes/bookRoutes");
const memberRoutes = require("./routes/memberRoutes");
const db = require("./config/db"); 

const app = express();

// Middleware
app.use(cors({
    origin: "*", 
    methods: ['GET','PUT' ,'POST','DELETE' ],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());

// Routes
app.use("/api/books", bookRoutes);
app.use("/api/members", memberRoutes);

// Default Route
app.get("/", (req, res) => {
    res.send("📚 Welcome to the BookBridger API");
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error("❌ Error:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
