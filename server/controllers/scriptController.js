const Session = require('../models/Session');
const User = require('../models/User');
const { generateScript } = require('../services/claudeService');

/**
 * POST /api/script
 * Body: { userId, topic, tone, length, language, extraContext }
 */
const createScript = async (req, res, next) => {
  try {
    const { userId, topic, tone, length, language, extraContext } = req.body;

    if (!userId || !topic) {
      return res.status(400).json({ message: 'userId and topic are required.' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const scriptPrompt = {
      topic,
      tone: tone || 'professional',
      length: length || 'medium',
      language: language || 'en',
      extraContext: extraContext || '',
    };

    const generatedScript = await generateScript(scriptPrompt, user);

    const session = await Session.create({
      user: user._id,
      topic,
      tone: scriptPrompt.tone,
      length: scriptPrompt.length,
      language: scriptPrompt.language,
      script: generatedScript,
      metadata: { extraContext: scriptPrompt.extraContext },
    });

    res.status(201).json({
      message: 'Script generated successfully.',
      script: generatedScript,
      sessionId: session._id,
      session,
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

    const session = await Session.findById(sessionId).populate('user', '-password');
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