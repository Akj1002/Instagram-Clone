const { GoogleGenerativeAI } = require('@google/generative-ai');

// Ensure API key is configured
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const chatWithAI = async (req, res) => {
  try {
    const { text, history } = req.body;

    if (!text) {
      return res.status(400).json({ message: 'Message text is required' });
    }

    // Get the generative model
    // Using gemini-1.5-flash as it is fast and suitable for chatbots
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Format history for Gemini API
    const formattedHistory = history ? history.map(msg => ({
      role: msg.senderId === req.user.userId ? "user" : "model",
      parts: [{ text: msg.text }],
    })) : [];

    // Initialize chat session with history and system instruction
    const chat = model.startChat({
      history: formattedHistory,
      generationConfig: {
        maxOutputTokens: 500,
        temperature: 0.7,
      },
    });

    const result = await chat.sendMessage(text);
    const responseText = result.response.text();

    res.json({
      id: Date.now().toString(), // fake ID for the message
      text: responseText,
      senderId: 'meta-ai',
      receiverId: req.user.userId,
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('AI chat error:', error);
    res.status(500).json({ message: 'Error communicating with AI' });
  }
};

module.exports = {
  chatWithAI
};
