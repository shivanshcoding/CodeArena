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
      proxy: true
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log('Google profile received:', { 
          id: profile.id,
          displayName: profile.displayName,
          emails: profile.emails?.length,
          photos: profile.photos?.length
        });
        
        const email = profile.emails?.[0]?.value;
        const photo = profile.photos?.[0]?.value || '';

        if (!email) {
          console.error('No email received from Google');
          return done(new Error('No email received from Google'), null);
        }

        let user = await User.findOne({ email });

        if (!user) {
          console.log('Creating new user with Google data:', { email, name: profile.displayName });
          // 👇 Create new user with minimal fields
          user = await User.create({
            name: profile.displayName || 'Google User',
            email,
            photo,
            password: '',          // no password for Google users
            username: null,        // to be filled in /complete-profile
            age: 0,
            institute: '',
            linkedin: '',
          });
          console.log('New user created with ID:', user._id);
        } else {
          console.log('Existing user found with ID:', user._id);
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
