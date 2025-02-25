const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  title: String,
  section: String,
  text: String,
  keywords: [String],
  createdAt: { type: Date, default: Date.now }
});

// 🔍 Create a full-text index
reportSchema.index({ title: "text", section: "text", text: "text" });

module.exports = mongoose.model("Report", reportSchema);
