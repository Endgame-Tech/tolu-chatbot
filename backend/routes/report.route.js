const express = require("express");
const router = express.Router();
const Report = require("../models/report.model.js");

// Store a report chunk
router.post("/add-report", async (req, res) => {
  try {
    const { title, section, text, keywords } = req.body;
    const newReport = new Report({ title, section, text, keywords });
    await newReport.save();
    res.status(201).json({ message: "✅ Report chunk saved" });
  } catch (error) {
    res.status(500).json({ error: "❌ Failed to save report" });
  }
});

// Search reports

// router.get("/search", async (req, res) => {
//   try {
//     const query = req.query.q;
//     const results = await Report.find({
//       $or: [
//         { title: { $regex: query, $options: "i" } },
//         { section: { $regex: query, $options: "i" } },
//         { text: { $regex: query, $options: "i" } },
//         { keywords: { $in: [query] } }
//       ]
//     });
//     res.json(results);
//   } catch (error) {
//     res.status(500).json({ error: "❌ Search failed" });
//   }
// });

router.get("/search", async (req, res) => {
  try {
    const query = req.query.q;
    const results = await Report.find(
      { $text: { $search: query } }
    )
      .sort({ score: { $meta: "textScore" } }) // Sort by relevance
      .limit(3); // Limit to top 3 relevant sections


    res.json(results);
  } catch (error) {
    res.status(500).json({ error: "❌ Search failed" });
  }
});

// const Fuse = require("fuse.js");

// router.get("/search", async (req, res) => {
//   try {
//     const query = req.query.q;
//     const allReports = await Report.find(); // Fetch all reports

//     // Set up Fuse.js for fuzzy searching
//     const fuse = new Fuse(allReports, {
//       keys: ["title", "section", "text"],
//       includeScore: true,
//       threshold: 0.3 // Lower means stricter matches; increase for more flexibility
//     });

//     const results = fuse.search(query).map(result => result.item); // Get matched documents
//     res.json(results);
//   } catch (error) {
//     res.status(500).json({ error: "❌ Fuzzy Search failed" });
//   }
// });




module.exports = router;
