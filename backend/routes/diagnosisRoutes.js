const express = require("express");
const { analyzeConditions, getRecommendedTests } = require("../services/geminiService");

const router = express.Router();

// POST route for symptom analysis
router.post("/analyze", async (req, res) => {
    try {
        const { symptoms, age, gender, medicalHistory } = req.body;
        
        console.log("Received API Request:", req.body); // Debugging log

        if (!symptoms || !age || !gender || !medicalHistory) {
            return res.status(400).json({ error: "All fields (symptoms, age, gender, medicalHistory) are required." });
        }

        // Ensure symptoms are an array
        const symptomsArray = Array.isArray(symptoms) ? symptoms : [symptoms];

        // Get AI-generated conditions, treatments, and medications
        const { conditions, treatments, medications } = await analyzeConditions(symptomsArray);

        // Get AI-generated recommended tests
        const tests = await getRecommendedTests(symptomsArray, age, gender, medicalHistory);

        console.log("AI Response:", { conditions, treatments, medications, tests }); // Debugging log

        res.json({ conditions, treatments, medications, tests });
    } catch (error) {
        console.error("Error analyzing symptoms:", error);
        res.status(500).json({ error: "Failed to analyze symptoms." });
    }
});


module.exports = router;
