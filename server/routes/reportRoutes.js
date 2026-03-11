const express = require('express');

const {
  createReport,
  getReportById,
  getReportsForUser,
} = require('../controllers/reportController');

const router = express.Router();

// All report endpoints require a logged-in Clerk user
//router.use(ClerkExpressRequireAuth());

// POST /api/report
router.post('/', createReport);

// GET /api/report/user/:userId
router.get('/user/:userId', getReportsForUser);

// GET /api/report/:id
router.get('/:id', getReportById);

module.exports = router;

