
import express from 'express';
import User from '../models/User.js';

const router = express.Router();


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

router.get('/:username', async (req, res) => {
    const { username } = req.params;
    try {
        const user = await User.findOne({ username }, { password: 0 }); // exclude password
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
