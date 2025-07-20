import express from 'express';
import passport from 'passport'
import './config/googleAuth.js' // Load Passport Google Strategy
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import questionRoutes from './routes/questionRoutes.js';
import submissionRoutes from './routes/submissionRoutes.js';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();
connectDB();

const app = express();
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(passport.initialize())

// Routes
app.use('/api/submissions', submissionRoutes)
app.use('/api/questions', questionRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/profile', userRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
)
