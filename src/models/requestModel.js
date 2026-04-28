const pool = require('../config/db');

const createRequest = async ({ user_id, skill_id, message }) => {
  const result = await pool.query(
    `INSERT INTO skill_requests (user_id, skill_id, message)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [user_id, skill_id, message]
  );
  return result.rows[0];
};

const getAllRequests = async () => {
  const result = await pool.query(
    `SELECT sr.*, u.name AS user_name, s.name AS skill_name
     FROM skill_requests sr
     JOIN users u ON sr.user_id = u.id
     JOIN skills s ON sr.skill_id = s.id
     ORDER BY sr.created_at DESC`
  );
  return result.rows;
};

const getRequestsByUser = async (user_id) => {
  const result = await pool.query(
    `SELECT sr.*, s.name AS skill_name
     FROM skill_requests sr
     JOIN skills s ON sr.skill_id = s.id
     WHERE sr.user_id = $1
     ORDER BY sr.created_at DESC`,
    [user_id]
  );
  return result.rows;
};

module.exports = { createRequest, getAllRequests, getRequestsByUser };
