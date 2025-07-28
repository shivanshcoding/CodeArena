import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { authenticateJWT } from '../middleware/auth.js';


const router = express.Router();

// ✅ Check if username is taken
router.post('/check-username', async (req, res) => {
  const { username } = req.body;

  try {
    const user = await User.findOne({ username });

    // ✅ Return `available: true` if not found
    return res.json({ available: !user });
  } catch (err) {
    console.error('Username check failed:', err);
    return res.status(500).json({ available: false, message: 'Server error' });
  }
});


router.get('/me', authenticateJWT, (req, res) => {
    res.status(200).json({ user: req.user });
});

// ✅ Check if email is taken
router.post('/check-email', async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    res.json({ exists: !!user });
});

// ✅ Register
router.post('/register', async (req, res) => {
    try {
        const { name, age, institute, linkedin, email, password, username } = req.body;

        if (!username) return res.status(400).json({ message: 'Username is required' });
        const existingUsername = await User.findOne({ username });
        if (existingUsername) return res.status(400).json({ message: 'Username already taken' });

        const existingEmail = await User.findOne({ email });
        if (existingEmail) return res.status(400).json({ message: 'Email already registered' });

        if (!linkedin.startsWith('https://www.linkedin.com')) {
            return res.status(400).json({ message: 'Invalid LinkedIn URL' });
        }

        const hashed = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            age,
            institute,
            linkedin,
            email,
            password: hashed,
            username
        });

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                _id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                age: user.age,
                institute: user.institute,
                linkedin: user.linkedin,
                createdAt: user.createdAt,
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// ✅ Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Invalid password' });

    res.status(200).json({
        message: 'Login successful',
        user: {
            _id: user._id,
            name: user.name,
            username: user.username,
            email: user.email,
            photo: user.photo,
            age: user.age,
            institute: user.institute,
            linkedin: user.linkedin,
            createdAt: user.createdAt,
        }
    });
});


// 👇 This stays the same
router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect: 'http://localhost:3000/register?error=google_auth_failed',
        session: false, // ✅ Important: disables session usage
    }),
    (req, res) => {
        try {
            const user = req.user;
            
            if (!user || !user._id) {
                console.error('Google auth callback: Invalid user object', user);
                return res.redirect('http://localhost:3000/register?error=invalid_user_data');
            }

            // ✅ Generate JWT token with all necessary user data
            const token = jwt.sign({
                id: user._id,
                name: user.name,
                email: user.email,
                photo: user.photo || '',
                age: user.age || 0,
                institute: user.institute || '',
                linkedin: user.linkedin || '',
                username: user.username || null
            }, process.env.JWT_SECRET, { expiresIn: '7d' });

            // ✅ Redirect to frontend with token in query
            res.redirect(`http://localhost:3000/google-success?token=${token}`);
        } catch (error) {
            console.error('Google auth callback error:', error);
            res.redirect('http://localhost:3000/register?error=server_error');
        }
    }
);


export default router;
