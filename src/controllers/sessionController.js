const { createSession, updateSessionStatus, getSessionById, getSessionsByMatch } = require('../models/sessionModel');
const { getMatchById } = require('../models/matchModel');

const VALID_STATUSES = ['scheduled', 'completed', 'cancelled'];

// POST /api/sessions
const schedule = async (req, res) => {
  const { match_id, scheduled_at, notes } = req.body;
  if (!match_id || !scheduled_at) {
    return res.status(400).json({ error: 'match_id and scheduled_at are required' });
  }

  try {
    const match = await getMatchById(match_id);
    if (!match) return res.status(404).json({ error: 'Match not found' });

    // Only requester or provider can schedule
    if (req.user.id !== match.requester_id && req.user.id !== match.provider_id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    if (match.status !== 'accepted') {
      return res.status(400).json({ error: 'Can only schedule sessions for accepted matches' });
    }

    const session = await createSession({ match_id, scheduled_at, notes });
    res.status(201).json({ session });
  } catch (err) {
    console.error('schedule error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// PATCH /api/sessions/:id
const updateStatus = async (req, res) => {
  const { status } = req.body;
  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).json({ error: `status must be one of: ${VALID_STATUSES.join(', ')}` });
  }

  try {
    const session = await getSessionById(req.params.id);
    if (!session) return res.status(404).json({ error: 'Session not found' });

    const match = await getMatchById(session.match_id);
    if (req.user.id !== match.requester_id && req.user.id !== match.provider_id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const updated = await updateSessionStatus(req.params.id, status);
    res.status(200).json({ session: updated });
  } catch (err) {
    console.error('updateStatus error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// GET /api/matches/:id/sessions
const getByMatch = async (req, res) => {
  try {
    const match = await getMatchById(req.params.id);
    if (!match) return res.status(404).json({ error: 'Match not found' });

    if (req.user.id !== match.requester_id && req.user.id !== match.provider_id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const sessions = await getSessionsByMatch(req.params.id);
    res.status(200).json({ sessions });
  } catch (err) {
    console.error('getByMatch error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { schedule, updateStatus, getByMatch };
