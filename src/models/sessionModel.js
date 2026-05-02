const pool = require('../config/db');

const createSession = async ({ match_id, scheduled_at, notes }) => {
  const result = await pool.query(
    `INSERT INTO sessions (match_id, scheduled_at, notes, status)
     VALUES ($1, $2, $3, 'scheduled')
     RETURNING *`,
    [match_id, scheduled_at, notes]
  );
  return result.rows[0];
};

const updateSessionStatus = async (id, status) => {
  const result = await pool.query(
    `UPDATE sessions SET status = $1, updated_at = NOW()
     WHERE id = $2
     RETURNING *`,
    [status, id]
  );
  return result.rows[0];
};

const getSessionById = async (id) => {
  const result = await pool.query(`SELECT * FROM sessions WHERE id = $1`, [id]);
  return result.rows[0];
};

const getSessionsByMatch = async (match_id) => {
  const result = await pool.query(
    `SELECT * FROM sessions WHERE match_id = $1 ORDER BY scheduled_at ASC`,
    [match_id]
  );
  return result.rows;
};

module.exports = { createSession, updateSessionStatus, getSessionById, getSessionsByMatch };
