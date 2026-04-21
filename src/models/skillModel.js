// src/models/skillModel.js
const pool = require("../config/db");

const createSkill = async ({ name, description, user_id }) => {
  const result = await pool.query(
    `INSERT INTO skills (name, description, user_id)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [name, description, user_id],
  );
  return result.rows[0];
};

const getAllSkills = async () => {
  const result = await pool.query(
    `SELECT s.*, u.name AS owner FROM skills s
     JOIN users u ON s.user_id = u.id
     ORDER BY s.created_at DESC`,
  );
  return result.rows;
};

const getSkillById = async (id) => {
  const result = await pool.query(`SELECT * FROM skills WHERE id = $1`, [id]);
  return result.rows[0];
};

const updateSkill = async (id, user_id, { name, description }) => {
  const result = await pool.query(
    `UPDATE skills SET name = COALESCE($1, name), description = COALESCE($2, description)
     WHERE id = $3 AND user_id = $4
     RETURNING *`,
    [name, description, id, user_id],
  );
  return result.rows[0];
};

const deleteSkill = async (id, user_id) => {
  const result = await pool.query(
    `DELETE FROM skills WHERE id = $1 AND user_id = $2 RETURNING *`,
    [id, user_id],
  );
  return result.rows[0];
};

module.exports = {
  createSkill,
  getAllSkills,
  getSkillById,
  updateSkill,
  deleteSkill,
};
