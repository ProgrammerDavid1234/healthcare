const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json()); // Middleware to parse JSON bodies

// Hugging Face API configuration
const HF_API_TOKEN = "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"; // Replace with your token
const HF_API_URL = "https://api-inference.huggingface.co/models/gpt2"; // Use any model you like

// Define the API endpoint
app.post("/generate", async (req, res) => {
  try {
    const { prompt, max_length = 100, temperature = 0.7, top_k = 50, top_p = 0.95 } = req.body;

    // Make a request to the Hugging Face Inference API
    const response = await axios.post(
      HF_API_URL,
      {
        inputs: prompt,
        parameters: {
          max_length,
          temperature,
          top_k,
          top_p,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${HF_API_TOKEN}`,
        },
      }
    );

    // Extract the generated text
    const generatedText = response.data[0].generated_text;

    // Return the generated text
    res.json({ generated_text: generatedText });
  } catch (error) {
    console.error("Error:", error.response ? error.response.data : error.message);
    res.status(500).json({ error: "Failed to generate text" });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});