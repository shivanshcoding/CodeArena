
import express from 'express';
import User from '../models/User.js';
import { getUserProfile, updateUserProfile, getUserStats, getRecentSubmissions } from '../controllers/userController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Protected routes - require authentication
router.get('/profile', verifyToken, getUserProfile);
router.put('/profile', verifyToken, updateUserProfile);
router.get('/stats', verifyToken, getUserStats);
router.get('/submissions/recent', verifyToken, getRecentSubmissions);

// Legacy route - consider migrating to /profile endpoint
router.put('/update', async (req, res) => {
  const { email, username, age, institute, linkedin } = req.body;

  const existing = await User.findOne({ username });
  if (existing && existing.email !== email) {
    return res.status(400).json({ message: 'Username already taken' });
  }

  const updated = await User.findOneAndUpdate(
    { email },
    { $set: { username, age, institute, linkedin } },
    { new: true }
  );

  res.json(updated);
});

// ✅ Get user by username
router.get('/:username', async (req, res) => {
  try {
    const { username } = req.params
    const user = await User.findOne({ username })

    if (!user) return res.status(404).json({ message: 'User not found' })

    // remove password
    const { password, ...userData } = user._doc

    res.json(userData)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})


export default router;
