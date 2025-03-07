require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function analyzeConditions(symptoms) {
    const prompt = `
    A patient has these symptoms: ${symptoms.join(", ")}.
    
    1. List possible medical conditions. Provide only a comma-separated list.
    2. List possible treatments for these conditions. Provide only a comma-separated list.
    3. List possible medications that can be used. Provide only a comma-separated list.`;

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const response = await model.generateContent(prompt);
        const responseText = response.response.text().trim(); // Extract text response

        // Ensure we split response correctly
        const [conditionsText, treatmentsText, medicationsText] = responseText.split("\n").map(line => line.trim());

        // Parse response to structured lists
        const conditions = conditionsText ? conditionsText.split(",").map(cond => cond.trim()).filter(Boolean) : [];
        const treatments = treatmentsText ? treatmentsText.split(",").map(treat => treat.trim()).filter(Boolean) : [];
        const medications = medicationsText ? medicationsText.split(",").map(med => med.trim()).filter(Boolean) : [];

        return { conditions, treatments, medications };
    } catch (error) {
        console.error("AI Error:", error);
        return {
            conditions: ["Unknown Condition"],
            treatments: ["No suggested treatments found"],
            medications: ["No suggested medications found"]
        };
    }
}

async function getRecommendedTests(symptoms, age, gender, medicalHistory) {
    const prompt = `List possible medical tests for symptoms: ${symptoms.join(", ")}. 
    Age: ${age}, Gender: ${gender}, Medical history: ${medicalHistory}. 
    Provide only a comma-separated list.`;

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const response = await model.generateContent(prompt);
        const tests = response.response.text().split(",").map(test => test.trim());

        return tests;
    } catch (error) {
        console.error("AI Error:", error);
        return ["Unknown Test"];
    }
}

module.exports = { analyzeConditions, getRecommendedTests };
