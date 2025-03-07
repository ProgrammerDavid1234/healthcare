require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function analyzeConditions(symptoms) {
    const prompt = `List possible medical conditions for these symptoms: ${symptoms.join(", ")}. Provide only a list, separated by commas.`;

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Use correct model name
        const response = await model.generateContent(prompt);
        const conditions = response.response.text().split(",").map(cond => cond.trim());

        return conditions;
    } catch (error) {
        console.error("AI Error:", error);
        return ["Unknown Condition"];
    }
}

async function getRecommendedTests(symptoms, age, gender, medicalHistory) {
    const prompt = `List possible medical tests for symptoms: ${symptoms.join(", ")}. Age: ${age}, Gender: ${gender}, Medical history: ${medicalHistory}. Provide only a list, separated by commas.`;

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Use correct model name
        const response = await model.generateContent(prompt);
        const tests = response.response.text().split(",").map(test => test.trim());

        return tests;
    } catch (error) {
        console.error("AI Error:", error);
        return ["Unknown Test"];
    }
}

module.exports = { analyzeConditions, getRecommendedTests };
