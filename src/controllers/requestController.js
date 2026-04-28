const { createRequest, getAllRequests, getRequestsByUser } = require('../models/requestModel');

const create = async (req, res) => {
  const { skill_id, message } = req.body;
  if (!skill_id) return res.status(400).json({ error: 'skill_id is required' });

  try {
    const request = await createRequest({ user_id: req.user.id, skill_id, message });
    res.status(201).json({ request });
  } catch (err) {
    console.error('createRequest error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getAll = async (req, res) => {
  try {
    const requests = await getAllRequests();
    res.status(200).json({ requests });
  } catch (err) {
    console.error('getAllRequests error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getByUser = async (req, res) => {
  try {
    const requests = await getRequestsByUser(req.params.id);
    res.status(200).json({ requests });
  } catch (err) {
    console.error('getRequestsByUser error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { create, getAll, getByUser };
