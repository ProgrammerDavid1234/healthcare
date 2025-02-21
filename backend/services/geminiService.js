require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function analyzeSymptoms(symptoms, age, gender, medicalHistory) {
    const prompt = `A patient is experiencing ${symptoms.join(", ")}. Age: ${age}, Gender: ${gender}, Medical history: ${medicalHistory}. What is the possible diagnosis?`;

    let retries = 3; // Number of retries
    while (retries > 0) {
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });
            const response = await model.generateContent(prompt);
            return response.response.text();
        } catch (error) {
            console.error("AI Error:", error);

            if (error.status === 503) {
                retries--;
                console.log(`Retrying... Attempts left: ${retries}`);
                await new Promise((resolve) => setTimeout(resolve, 3000)); // Wait 3 seconds before retrying
            } else {
                break;
            }
        }
    }

    return "Unable to analyze symptoms at the moment.";
}

module.exports = analyzeSymptoms;
