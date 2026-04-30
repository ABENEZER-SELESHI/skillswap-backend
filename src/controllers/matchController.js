const { findProviders, createMatch, updateMatchStatus, getMatchById } = require('../models/matchModel');
const pool = require('../config/db');

// POST /api/matches
// Matches a requester with all providers who have the requested skill
const match = async (req, res) => {
  const { request_id } = req.body;
  if (!request_id) return res.status(400).json({ error: 'request_id is required' });

  try {
    // Fetch the skill request
    const reqResult = await pool.query(`SELECT * FROM skill_requests WHERE id = $1`, [request_id]);
    const skillRequest = reqResult.rows[0];
    if (!skillRequest) return res.status(404).json({ error: 'Skill request not found' });

    const providers = await findProviders(skillRequest.skill_id, skillRequest.user_id);
    if (!providers.length) return res.status(404).json({ error: 'No providers found for this skill' });

    const matches = await Promise.all(
      providers.map((p) =>
        createMatch({
          request_id,
          requester_id: skillRequest.user_id,
          provider_id: p.id,
          skill_id: skillRequest.skill_id,
        })
      )
    );

    res.status(201).json({ matches });
  } catch (err) {
    console.error('match error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// PATCH /api/matches/:id
// Provider accepts or rejects a match
const updateStatus = async (req, res) => {
  const { status } = req.body;
  if (!['accepted', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'status must be accepted or rejected' });
  }

  try {
    const existing = await getMatchById(req.params.id);
    if (!existing) return res.status(404).json({ error: 'Match not found' });

    // Only the provider can accept/reject
    if (existing.provider_id !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const updated = await updateMatchStatus(req.params.id, status);
    res.status(200).json({ match: updated });
  } catch (err) {
    console.error('updateStatus error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { match, updateStatus };
