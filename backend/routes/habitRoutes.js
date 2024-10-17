const express = require('express');
const { createHabit, trackHabit } = require('../controllers/habitController');
const authenticateToken = require('../middleware/authenticateToken');

const router = express.Router();

router.post('/', authenticateToken, createHabit);
router.post('/:id/track', authenticateToken,  trackHabit);

module.exports = router;