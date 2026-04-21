const pool = require('../config/db');

const addSkillToUser = async (user_id, skill_id) => {
  const result = await pool.query(
    `INSERT INTO user_skills (user_id, skill_id)
     VALUES ($1, $2)
     ON CONFLICT DO NOTHING
     RETURNING *`,
    [user_id, skill_id]
  );
  return result.rows[0];
};

const getUserSkills = async (user_id) => {
  const result = await pool.query(
    `SELECT s.id, s.name, s.description, us.created_at
     FROM user_skills us
     JOIN skills s ON us.skill_id = s.id
     WHERE us.user_id = $1
     ORDER BY us.created_at DESC`,
    [user_id]
  );
  return result.rows;
};

const removeSkillFromUser = async (user_id, skill_id) => {
  const result = await pool.query(
    `DELETE FROM user_skills WHERE user_id = $1 AND skill_id = $2 RETURNING *`,
    [user_id, skill_id]
  );
  return result.rows[0];
};

module.exports = { addSkillToUser, getUserSkills, removeSkillFromUser };
