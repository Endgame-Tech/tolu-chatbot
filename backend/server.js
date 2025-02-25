require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db.js");
const reportRoutes = require("./routes/report.route.js");

const app = express();
const FRONTEND_URL = process.env.FRONTEND_URL;

// Middleware
app.use(express.json());
app.use(cors(
  {
    origin: FRONTEND_URL, // Allow your frontend
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization"
  }
));

// Connect to MongoDB
connectDB();

// Routes
app.get('/', (req, res) => {
  res.send('Backend is working 🚀');
});
app.use("/api/reports", reportRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
