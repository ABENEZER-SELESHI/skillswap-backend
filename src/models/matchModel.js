const pool = require('../config/db');

// Find users who have the requested skill (providers), excluding the requester
const findProviders = async (skill_id, requester_id) => {
  const result = await pool.query(
    `SELECT u.id, u.name, u.email
     FROM user_skills us
     JOIN users u ON us.user_id = u.id
     WHERE us.skill_id = $1 AND us.user_id != $2`,
    [skill_id, requester_id]
  );
  return result.rows;
};

const createMatch = async ({ request_id, requester_id, provider_id, skill_id }) => {
  const result = await pool.query(
    `INSERT INTO matches (request_id, requester_id, provider_id, skill_id, status)
     VALUES ($1, $2, $3, $4, 'pending')
     RETURNING *`,
    [request_id, requester_id, provider_id, skill_id]
  );
  return result.rows[0];
};

const updateMatchStatus = async (id, status) => {
  const result = await pool.query(
    `UPDATE matches SET status = $1, updated_at = NOW()
     WHERE id = $2
     RETURNING *`,
    [status, id]
  );
  return result.rows[0];
};

const getMatchById = async (id) => {
  const result = await pool.query(`SELECT * FROM matches WHERE id = $1`, [id]);
  return result.rows[0];
};

module.exports = { findProviders, createMatch, updateMatchStatus, getMatchById };
