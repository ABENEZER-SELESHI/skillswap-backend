// src/routes/userSkillRoutes.js
const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  addSkill,
  getSkills,
  removeSkill,
} = require("../controllers/userSkillController");
const { authenticate } = require("../middleware/authMiddleware");

router.post("/", authenticate, addSkill);
router.get("/", getSkills);
router.delete("/:skillId", authenticate, removeSkill);

module.exports = router;
