const express = require("express");
const router = express.Router();
const analyzeSymptoms = require("../services/geminiService");

router.post("/diagnosis/analyze", async (req, res) => {
    const { symptoms, age, gender, medicalHistory } = req.body;

    if (!symptoms || !age || !gender || !medicalHistory) {
        return res.status(400).json({ message: "All fields are required." });
    }

    const diagnosis = await analyzeSymptoms(symptoms, age, gender, medicalHistory);
    res.json({ diagnosis });
});

module.exports = router;
