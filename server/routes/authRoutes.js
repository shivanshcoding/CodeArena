import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/User.js';

const router = express.Router();

// ✅ Username check
router.post('/check-username', async (req, res) => {
  const { username } = req.body;
  const user = await User.findOne({ username });
  res.json({ exists: !!user });
});

router.post('/check-email', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  res.json({ exists: !!user });
});
// ✅ Register
router.post('/register', async (req, res) => {
  const { name, age, address, username, email, password } = req.body;

  const existingEmail = await User.findOne({ email });
  if (existingEmail) return res.status(400).json({ message: 'Email already registered' });

  const existingUsername = await User.findOne({ username });
  if (existingUsername) return res.status(400).json({ message: 'Username already taken' });

  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    age,
    address,
    username,
    email,
    password: hashed,
  });

  // ✅ Return full user object (excluding password)
  res.status(201).json({
    message: 'User registered',
    user: {
      _id: user._id,
      name: user.name,
      age: user.age,
      address: user.address,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
    },
  });
});


// ✅ Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ message: 'Invalid password' });

  // ✅ Return full user object (excluding password)
  res.status(200).json({
    message: 'Login successful',
    user: {
      _id: user._id,
      name: user.name,
      age: user.age,
      address: user.address,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
    },
  });
});

export default router;
