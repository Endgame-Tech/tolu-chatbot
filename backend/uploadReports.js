require("dotenv").config();
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const mammoth = require("mammoth");
const Report = require("./models/report.model.js"); // Import the Report schema
const connectDB = require("./config/db.js");

// Connect to MongoDB
connectDB();

// 📌 Path to your .docx file
const filePath = path.join(__dirname, "data", "FixINEC_FixNigeria_Report_Part_3.docx");

// Function to detect headings and chunk content properly
const splitIntoChunks = (text) => {
  const lines = text.split("\n"); // Split text into lines
  const chunks = [];
  let currentSection = { title: "Introduction", text: "" };

  lines.forEach((line) => {
    if (line.trim() === "") return; // Skip empty lines

    // 🔍 Detect Headings (ALL CAPS or Sections like "PART I", "Chapter 2")
    if (line.match(/^(PART|CHAPTER|SECTION|[0-9]+\.)/i) || line === line.toUpperCase()) {
      // Save previous section
      if (currentSection.text.trim() !== "") {
        chunks.push({ ...currentSection, keywords: extractKeywords(currentSection.text) });
      }

      // Start new section
      currentSection = { title: line.trim(), text: "" };
    } else {
      // Append line to current section
      currentSection.text += line + " ";
    }
  });

  // Save the last section
  if (currentSection.text.trim() !== "") {
    chunks.push({ ...currentSection, keywords: extractKeywords(currentSection.text) });
  }

  return chunks;
};

// Function to extract keywords (improved)
const extractKeywords = (text) => {
  return text
    .split(/\s+/)
    .filter((word) => word.length > 4 && !["which", "therefore", "because", "shall"].includes(word.toLowerCase())) // Remove common stopwords
    .slice(0, 10);
};

// Read the .docx report and upload to MongoDB
const uploadReportToMongoDB = async () => {
  try {
    console.log("📂 Reading FixINEC .docx report...");

    // Extract text from .docx
    const { value: reportText } = await mammoth.extractRawText({ path: filePath });

    console.log("✂️ Splitting report into structured sections...");
    const reportChunks = splitIntoChunks(reportText);

    console.log(`📝 Uploading ${reportChunks.length} sections to MongoDB...`);
    await Report.insertMany(reportChunks);

    console.log("✅ FixINEC Report uploaded successfully!");
    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error uploading FixINEC report:", error);
    mongoose.connection.close();
  }
};

// Run the function
uploadReportToMongoDB();
