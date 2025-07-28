import express from 'express';
import { 
  getOrCreateSession, 
  sendMessage, 
  getMessages, 
  clearSession, 
  updateSettings,
  updateCodeContext
} from '../controllers/aiAssistantController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// Get or create a session for a user and question
router.get('/session/:questionId', getOrCreateSession);

// Send a message to the AI assistant
router.post('/message/:sessionId', sendMessage);

// Get all messages for a session
router.get('/messages/:sessionId', getMessages);

// Clear all messages in a session
router.delete('/session/:sessionId', clearSession);

// Update AI assistant settings
router.put('/settings/:sessionId', updateSettings);

// Update code context
router.post('/code-context/:sessionId', updateCodeContext);

export default router;