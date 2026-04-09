const bcrypt = require('bcrypt');
const { createUser, findUserById, findUserByEmail } = require('../models/userModel');

const SALT_ROUNDS = 10;

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'name, email, and password are required' });
  }

  try {
    const existing = await findUserByEmail(email);
    if (existing) {
      return res.status(409).json({ error: 'Email already in use' });
    }

    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await createUser({ name, email, password_hash });

    res.status(201).json({ user });
  } catch (err) {
    console.error('registerUser error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await findUserById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ user });
  } catch (err) {
    console.error('getUserById error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { registerUser, getUserById };
