const express = require('express');
const { createHabit, trackHabit, listHabits } = require('../controllers/habitController');
const authenticateToken = require('../middleware/authenticateToken');

const router = express.Router();

router.post('/', authenticateToken, createHabit);
router.post('/:id/track', authenticateToken, trackHabit);
router.get('/listHabits', authenticateToken, listHabits);

module.exports = router;