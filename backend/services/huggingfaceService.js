require("dotenv").config();
const axios = require("axios");

// Hugging Face API configuration
const HF_API_TOKEN = process.env.HF_API_TOKEN; // Your Hugging Face API token
const HF_API_URL = "https://api-inference.huggingface.co/models/gpt2"; // Use any model you like

async function analyzeConditions(symptoms) {
    const prompt = `A patient has the following symptoms: ${symptoms.join(", ")}. List 3-5 possible medical conditions. Provide only a list of conditions.`;

    try {
        const response = await axios.post(
            HF_API_URL,
            {
                inputs: prompt,
                parameters: {
                    max_length: 50, // Limit the response length
                    temperature: 0.3, // Lower temperature for more focused output
                    top_k: 10, // Limit to top 10 tokens
                    top_p: 0.7, // Use nucleus sampling for diversity
                },
            },
            {
                headers: {
                    Authorization: `Bearer ${HF_API_TOKEN}`,
                },
            }
        );

        // Extract conditions from response
        const generatedText = response.data[0].generated_text;
        const conditions = generatedText.split("\n").map(cond => cond.trim());

        return conditions;
    } catch (error) {
        console.error("AI Error:", error.response ? error.response.data : error.message);
        return ["Unknown Condition"];
    }
}

async function getRecommendedTests(symptoms, age, gender, medicalHistory) {
    const prompt = `A patient is experiencing ${symptoms.join(", ")}. Age: ${age}, Gender: ${gender}, Medical history: ${medicalHistory}. List 3-5 recommended medical tests. Provide only a list of tests.`;

    try {
        const response = await axios.post(
            HF_API_URL,
            {
                inputs: prompt,
                parameters: {
                    max_length: 50, // Limit the response length
                    temperature: 0.3, // Lower temperature for more focused output
                    top_k: 10, // Limit to top 10 tokens
                    top_p: 0.7, // Use nucleus sampling for diversity
                },
            },
            {
                headers: {
                    Authorization: `Bearer ${HF_API_TOKEN}`,
                },
            }
        );

        // Extract tests from response
        const generatedText = response.data[0].generated_text;
        const tests = generatedText.split("\n").map(test => test.trim());

        return tests;
    } catch (error) {
        console.error("AI Error:", error.response ? error.response.data : error.message);
        return ["Unknown Test"];
    }
}

module.exports = { analyzeConditions, getRecommendedTests };