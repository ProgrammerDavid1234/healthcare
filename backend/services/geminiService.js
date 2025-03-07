require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function analyzeConditions(symptoms) {
    const prompt = `
    A patient has these symptoms: ${symptoms.join(", ")}.
    - **List the possible medical conditions:** (Provide a comma-separated list)
    - **List the possible treatments for these conditions:** (Provide a comma-separated list)
    - **List the medications commonly used for these conditions:** (Provide a comma-separated list)
    Please format your response strictly as:
    Conditions: [list]
    Treatments: [list]
    Medications: [list]
    `;

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const response = await model.generateContent(prompt);
        const responseText = response.response.text(); // Extract text response

        console.log("AI Raw Response:", responseText); // Debugging output

        // Extract structured responses
        const conditionsMatch = responseText.match(/Conditions:\s*(.*)/);
        const treatmentsMatch = responseText.match(/Treatments:\s*(.*)/);
        const medicationsMatch = responseText.match(/Medications:\s*(.*)/);

        // Parse the extracted data
        const conditions = conditionsMatch ? conditionsMatch[1].split(",").map(cond => cond.trim()) : [];
        const treatments = treatmentsMatch ? treatmentsMatch[1].split(",").map(treat => treat.trim()) : [];
        const medications = medicationsMatch ? medicationsMatch[1].split(",").map(med => med.trim()) : [];

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
