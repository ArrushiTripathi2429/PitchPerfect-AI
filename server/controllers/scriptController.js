const Session = require('../models/Session');
const User = require('../models/User');
const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/**
 * POST /api/script
 * Body: { topic, audience, duration }
 */
const createScript = async (req, res, next) => {
  try {
    const { topic, audience, duration } = req.body;

    if (!topic) {
      return res.status(400).json({ message: 'Topic is required.' });
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{
        role: "user",
        content: `Write a ${duration || "3 min"} presentation speech for a ${audience || "general"} audience on: "${topic}".

Structure:
- Strong opening hook
- 3 clear main points
- Memorable closing

Write as natural flowing speech, no headers or labels. Conversational tone, powerful delivery.`
      }],
      max_tokens: 1000,
    });

    const generatedScript = completion.choices[0].message.content;

    // Save session to MongoDB
    const session = await Session.create({
      topic,
      audience: audience || 'general',
      duration: duration || '3 mins',
      script: generatedScript,
    });

    res.status(201).json({
      message: 'Script generated successfully.',
      script: generatedScript,
      sessionId: session._id,
    });

  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/script/:sessionId
 */
const getScriptBySession = async (req, res, next) => {
  try {
    const { sessionId } = req.params;

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found.' });
    }

    res.json({
      script: session.script,
      session,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createScript,
  getScriptBySession,
};