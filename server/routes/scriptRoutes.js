const express = require('express');
const { ClerkExpressRequireAuth } = require('@clerk/express');
const { createScript, getScriptBySession } = require('../controllers/scriptController');

const router = express.Router();

// All script endpoints require a logged-in Clerk user
router.use(ClerkExpressRequireAuth());

// POST /api/script
router.post('/', createScript);

// GET /api/script/:sessionId
router.get('/:sessionId', getScriptBySession);

module.exports = router;

