require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function analyzeConditions(symptoms) {
    const prompt = `A patient has the following symptoms: ${symptoms.join(", ")}. What are the possible medical conditions? Provide only a list of conditions.`;

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const response = await model.generateContent(prompt);

        // Extract conditions from response
        const conditions = response.response.text().split("\n").map(cond => cond.trim());
        
        return conditions;
    } catch (error) {
        console.error("AI Error:", error);
        return ["Unknown Condition"];
    }
}

async function getRecommendedTests(symptoms, age, gender, medicalHistory) {
    const prompt = `A patient is experiencing ${symptoms.join(", ")}. Age: ${age}, Gender: ${gender}, Medical history: ${medicalHistory}. What medical tests should they undergo? Provide only a list of tests.`;

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const response = await model.generateContent(prompt);

        // Extract tests from response
        const tests = response.response.text().split("\n").map(test => test.trim());

        return tests;
    } catch (error) {
        console.error("AI Error:", error);
        return ["Unknown Test"];
    }
}

module.exports = { analyzeConditions, getRecommendedTests };
