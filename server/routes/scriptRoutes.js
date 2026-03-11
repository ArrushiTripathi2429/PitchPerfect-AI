const express = require('express');
const { createScript, getScriptBySession } = require('../controllers/scriptController');

const router = express.Router();

// POST /api/script
router.post('/', createScript);

// GET /api/script/:sessionId
router.get('/:sessionId', getScriptBySession);

module.exports = router;