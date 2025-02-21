require("dotenv").config(); // Load .env variables

const OpenAI = require("openai");

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Ensure this is correctly set
});

async function analyzeSymptoms(symptoms, age, gender, medicalHistory) {
    const prompt = `A patient is experiencing ${symptoms.join(", ")}. Age: ${age}, Gender: ${gender}, Medical history: ${medicalHistory}. What is the possible diagnosis?`;

    try {
        const response = await openai.completions.create({
            model: "gpt-3.5-turbo",
            prompt: prompt,
            max_tokens: 200,
        });

        return response.choices[0].text.trim();
    } catch (error) {
        console.error("AI Error:", error);
        return "Unable to analyze symptoms at the moment.";
    }
}

module.exports = { analyzeSymptoms };
