// src/controllers/userSkillController.js
const {
  addSkillToUser,
  getUserSkills,
  removeSkillFromUser,
} = require("../models/userSkillModel");

const addSkill = async (req, res) => {
  const { id: user_id } = req.params;
  const { skill_id } = req.body;

  if (parseInt(user_id) !== req.user.id) {
    return res.status(403).json({ error: "Forbidden" });
  }
  if (!skill_id) return res.status(400).json({ error: "skill_id is required" });

  try {
    const entry = await addSkillToUser(user_id, skill_id);
    if (!entry) return res.status(409).json({ error: "Skill already added" });
    res.status(201).json({ entry });
  } catch (err) {
    console.error("addSkill error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getSkills = async (req, res) => {
  const { id: user_id } = req.params;

  try {
    const skills = await getUserSkills(user_id);
    res.status(200).json({ skills });
  } catch (err) {
    console.error("getSkills error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const removeSkill = async (req, res) => {
  const { id: user_id, skillId: skill_id } = req.params;

  if (parseInt(user_id) !== req.user.id) {
    return res.status(403).json({ error: "Forbidden" });
  }

  try {
    const entry = await removeSkillFromUser(user_id, skill_id);
    if (!entry) return res.status(404).json({ error: "User skill not found" });
    res.status(200).json({ message: "Skill removed" });
  } catch (err) {
    console.error("removeSkill error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { addSkill, getSkills, removeSkill };
