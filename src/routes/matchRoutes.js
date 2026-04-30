const express = require('express');
const router = express.Router();
const { match, updateStatus } = require('../controllers/matchController');
const { authenticate } = require('../middleware/authMiddleware');

router.post('/', authenticate, match);
router.patch('/:id', authenticate, updateStatus);

module.exports = router;
