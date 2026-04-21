// src/controllers/skillController.js
const {
  createSkill,
  getAllSkills,
  getSkillById,
  updateSkill,
  deleteSkill,
} = require("../models/skillModel");

const create = async (req, res) => {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ error: "name is required" });

  try {
    const skill = await createSkill({
      name,
      description,
      user_id: req.user.id,
    });
    res.status(201).json({ skill });
  } catch (err) {
    console.error("createSkill error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAll = async (req, res) => {
  try {
    const skills = await getAllSkills();
    res.status(200).json({ skills });
  } catch (err) {
    console.error("getAllSkills error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getOne = async (req, res) => {
  try {
    const skill = await getSkillById(req.params.id);
    if (!skill) return res.status(404).json({ error: "Skill not found" });
    res.status(200).json({ skill });
  } catch (err) {
    console.error("getSkillById error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const update = async (req, res) => {
  try {
    const skill = await updateSkill(req.params.id, req.user.id, req.body);
    if (!skill)
      return res.status(404).json({ error: "Skill not found or unauthorized" });
    res.status(200).json({ skill });
  } catch (err) {
    console.error("updateSkill error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const remove = async (req, res) => {
  try {
    const skill = await deleteSkill(req.params.id, req.user.id);
    if (!skill)
      return res.status(404).json({ error: "Skill not found or unauthorized" });
    res.status(200).json({ message: "Skill deleted" });
  } catch (err) {
    console.error("deleteSkill error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { create, getAll, getOne, update, remove };
