require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db.js");
const reportRoutes = require("./routes/report.route.js");

const app = express();


// Middleware
app.use(express.json());
app.use(cors());

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
