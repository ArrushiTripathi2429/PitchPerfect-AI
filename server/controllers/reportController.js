const Report = require('../models/Report');
const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

function formatTime(s) {
  if (!s) return "0:00";
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

/**
 * POST /api/report
 */
const createReport = async (req, res, next) => {
  try {
    const {
      topic, seconds, wordCount, wpm, fillerCount,
      transcript, currentEmotion, postureScore,
      voiceCracks, eyeContact, sessionId,
      userId, userEmail   
    } = req.body;

    if (!topic) {
      return res.status(400).json({ message: 'Topic is required.' });
    }

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated.' });
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{
        role: "user",
        content: `You are a professional presentation coach. Give a coaching report for this session.

Topic: ${topic}
Duration: ${formatTime(seconds)}
Words spoken: ${wordCount || 0}
Average WPM: ${wpm || 0} (ideal: 120–150)
Filler words used: ${fillerCount || 0} (um, uh, like, basically...)
Dominant emotion detected: ${currentEmotion || "neutral"}
Posture score: ${postureScore || 100}% (100% = perfect posture)
Voice cracks: ${voiceCracks || 0}
Eye contact maintained: ${eyeContact ? "Yes" : "No"}
Transcript excerpt: ${transcript?.slice(0, 400) || "Not available"}

Write exactly 4 sections:
1. OVERALL SCORE — score out of 10, one sentence why
2. STRENGTHS — 2-3 specific things done well based on the data
3. AREAS TO IMPROVE — 2-3 specific actionable tips based on the data
4. NEXT SESSION FOCUS — one powerful thing to work on next time

Be specific, warm, and encouraging. Reference the actual numbers. No fluff.`
      }],
      max_tokens: 1000,
    });

    const generatedReport = completion.choices[0].message.content;


    const report = await Report.create({
      userId,
      userEmail: userEmail || null,
      sessionId: sessionId || null,
      topic,
      analysisData: {
        seconds, wordCount, wpm, fillerCount,
        currentEmotion, postureScore, voiceCracks, eyeContact,
      },
      content: generatedReport,
    });

    console.log(`Report saved for user ${userId}:`, report._id);

    res.status(201).json({
      message: 'Report generated successfully.',
      reportId: report._id,
      report: generatedReport,
    });

  } catch (error) {
    console.error("REPORT ERROR:", error.message);
    next(error);
  }
};

/**
 * GET /api/report/user/:userId
 * Returns all reports for a specific Clerk user
 */
const getReportsForUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const reports = await Report.find({ userId }).sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/report/:id
 */
const getReportById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const report = await Report.findById(id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found.' });
    }
    res.json(report);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReport,
  getReportById,
  getReportsForUser,
};
