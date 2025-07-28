import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

// Middleware for routes requiring authentication
export const verifyToken = async (req, res, next) => {
  try {
    // Get token from header (support both x-auth-token and Bearer token)
    const authHeader = req.headers.authorization;
    const token = req.header('x-auth-token') || 
                 (authHeader && authHeader.startsWith('Bearer ') ? 
                  authHeader.split(' ')[1] : null);

    // Check if no token
    if (!token) {
      return res.status(401).json({ message: 'Authentication required. No token provided.' });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtError) {
      console.error('JWT verification error:', jwtError.message);
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired. Please login again.' });
      }
      return res.status(401).json({ message: 'Invalid token. Please login again.' });
    }

    // Get user from database if User model is available
    if (User) {
      const user = await User.findById(decoded.user?._id || decoded.user?.id || decoded._id || decoded.id).select('-password');
      if (!user) {
        return res.status(404).json({ message: 'User not found. Account may have been deleted.' });
      }
      req.user = user;
    } else {
      // Fallback to decoded user if no User model
      req.user = decoded.user || decoded;
    }
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({ message: 'Server authentication error' });
  }
};

// Optional auth middleware - doesn't require auth but attaches user if token exists
export const optionalAuth = async (req, res, next) => {
  try {
    // Get token from header (support both x-auth-token and Bearer token)
    const authHeader = req.headers.authorization;
    const token = req.header('x-auth-token') || 
                 (authHeader && authHeader.startsWith('Bearer ') ? 
                  authHeader.split(' ')[1] : null);

    // If no token, continue without setting user
    if (!token) {
      req.user = null;
      return next();
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get user from database if User model is available
      if (User) {
        const user = await User.findById(decoded.user?._id || decoded.user?.id || decoded._id || decoded.id).select('-password');
        req.user = user || null;
      } else {
        // Fallback to decoded user if no User model
        req.user = decoded.user || decoded || null;
      }
    } catch (jwtError) {
      console.log('Optional auth JWT error:', jwtError.message);
      req.user = null;
    }
    
    next();
  } catch (error) {
    console.log('Optional auth error:', error.message);
    req.user = null;
    next();
  }
};

// Legacy middleware for backward compatibility
export const authenticateJWT = (req, res, next) => {
  const token = req.header('x-auth-token') || 
                (req.headers.authorization && req.headers.authorization.startsWith('Bearer ') 
                  ? req.headers.authorization.split(' ')[1] 
                  : null);
                  
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user || decoded;
    next();
  } catch (err) {
    console.error('Legacy auth error:', err.message);
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    res.status(401).json({ message: 'Token is not valid' });
  }
};