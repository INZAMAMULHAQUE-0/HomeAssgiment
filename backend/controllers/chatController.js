const ChatMessage = require('../models/ChatMessage');
const axios = require('axios');

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_MODEL = process.env.GROQ_MODEL || 'llama3-8b-8192';

exports.sendMessage = async (req, res) => {
  const { message } = req.body;
  const userId = req.user.id;

  if (!message) return res.status(400).json({ msg: 'Message is required' });

  try {
    // 1. Save user message
    const userMsg = new ChatMessage({ userId, message, sender: 'user' });
    await userMsg.save();

    // 2. Query Groq
    const groqRes = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: GROQ_MODEL,
        messages: [{ role: 'user', content: message }],
      },
      {
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const botReply = groqRes.data.choices[0]?.message?.content || 'No response';

    // 3. Save bot response
    const botMsg = new ChatMessage({ userId, message: botReply, sender: 'bot' });
    await botMsg.save();

    // 4. Return both messages
    res.status(201).json({ user: userMsg, bot: botMsg });
  } catch (err) {
    console.error('Groq error:', err.response?.data || err.message);
    res.status(500).json({ msg: 'Failed to get response from Groq' });
  }
};

exports.getChatHistory = async (req, res) => {
  const userId = req.user.id;

  try {
    const messages = await ChatMessage.find({ userId }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
