require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function analyzeConditions(symptoms) {
    const prompt = `A patient has these symptoms: ${symptoms.join(", ")}. 
    1. What are the possible medical conditions? Provide a comma-separated list.
    2. What are the possible treatments for these conditions? Provide a comma-separated list.`;

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const response = await model.generateContent(prompt);
        const responseText = response.response.text(); // Extract text response

        // Split response into conditions and treatments
        const [conditionsText, treatmentsText] = responseText.split("\n").map(line => line.trim());

        // Parse conditions and treatments
        const conditions = conditionsText ? conditionsText.split(",").map(cond => cond.trim()) : [];
        const treatments = treatmentsText ? treatmentsText.split(",").map(treat => treat.trim()) : [];

        return { conditions, treatments };
    } catch (error) {
        console.error("AI Error:", error);
        return { conditions: ["Unknown Condition"], treatments: ["No suggested treatments found"] };
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
