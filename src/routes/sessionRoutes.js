const express = require('express');
const router = express.Router();
const { schedule, updateStatus } = require('../controllers/sessionController');
const { authenticate } = require('../middleware/authMiddleware');

router.post('/', authenticate, schedule);
router.patch('/:id', authenticate, updateStatus);

module.exports = router;
