const express = require('express');
const router = express.Router();
const { create, getAll } = require('../controllers/requestController');
const { authenticate } = require('../middleware/authMiddleware');

router.post('/', authenticate, create);
router.get('/', authenticate, getAll);

module.exports = router;
