const express = require('express');
const router = express.Router();
const { syncUser } = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');

// POST /api/auth/sync
// Called by frontend after successful Supabase login
router.post('/sync', verifyToken, syncUser);

module.exports = router;
