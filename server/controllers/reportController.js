const Report = require('../models/Report');
const Session = require('../models/Session');
const User = require('../models/User');
const { generateReport } = require('../services/claudeService');

/**
 * POST /api/report
 * Body: { userId, sessionIds, reportType, extraContext }
 */
const createReport = async (req, res, next) => {
  try {
    const { userId, sessionIds, reportType, extraContext } = req.body;

    if (!userId || !Array.isArray(sessionIds) || sessionIds.length === 0) {
      return res
        .status(400)
        .json({ message: 'userId and at least one sessionId are required.' });
    }

    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const sessions = await Session.find({ _id: { $in: sessionIds }, user: userId });

    if (sessions.length === 0) {
      return res.status(404).json({ message: 'No sessions found for given IDs.' });
    }

    const reportPayload = {
      user,
      sessions,
      reportType: reportType || 'summary',
      extraContext: extraContext || '',
    };

    const generatedReport = await generateReport(reportPayload);

    const report = await Report.create({
      user: user._id,
      sessions: sessions.map((s) => s._id),
      type: reportPayload.reportType,
      content: generatedReport,
      metadata: {
        extraContext: reportPayload.extraContext,
      },
    });

    res.status(201).json({
      message: 'Report generated successfully.',
      reportId: report._id,
      report,
    });
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

    const report = await Report.findById(id)
      .populate('user', '-password')
      .populate('sessions');

    if (!report) {
      return res.status(404).json({ message: 'Report not found.' });
    }

    res.json(report);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/report/user/:userId
 */
const getReportsForUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const reports = await Report.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate('sessions');

    res.json(reports);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReport,
  getReportById,
  getReportsForUser,
};