import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';
import dotenv from 'dotenv';
dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        const photo = profile.photos?.[0]?.value || '';

        if (!email) return done(new Error('No email received from Google'), null);

        let user = await User.findOne({ email });

        if (!user) {
          // 👇 Create new user with minimal fields
          user = await User.create({
            name: profile.displayName,
            email,
            photo,
            password: '',          // no password
            username: null,        // to be filled in /complete-profile
            age: 0,
            institute: '',
            linkedin: '',
          });
        }

        return done(null, user);
      } catch (err) {
        console.error('Google strategy error:', err);
        return done(err, null);
      }
    }
  )
);

// ✅ Store user ID in session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// ✅ Retrieve full user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
