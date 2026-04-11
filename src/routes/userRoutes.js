// src/routes/userRoutes.js
const express = require("express");
const router = express.Router();
const { registerUser, getUserById } = require("../controllers/userController");
const { authenticate } = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.get("/:id", authenticate, getUserById);

module.exports = router;
