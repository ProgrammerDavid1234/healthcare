const axios = require('axios');

const chatWithAI = async (req, res) => {
    try {
        const { message } = req.body;  // Ensure request body has a "message"

        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: "gpt-3.5-turbo",  // Use the correct model
                messages: [{ role: "user", content: message }],
                temperature: 0.7
            },
            {
                headers: { 
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        res.json(response.data);
    } catch (error) {
        console.error("OpenAI API Error:", error.response?.data || error.message);
        res.status(500).json({ error: "Error communicating with AI" });
    }
};

module.exports = { chatWithAI };
