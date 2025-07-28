import express from 'express';
import { 
  createDuel, 
  getPublicDuels, 
  getDuelById, 
  joinDuel, 
  submitDuelSolution, 
  getUserDuels, 
  cancelDuel,
  joinDuelByInviteCode
} from '../controllers/duelController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// Create a new duel
router.post('/', createDuel);

// Get all public duels
router.get('/public', getPublicDuels);

// Get duel by ID
router.get('/:id', getDuelById);

// Join a duel
router.post('/:id/join', joinDuel);

// Submit solution for a duel
router.post('/:id/submit', submitDuelSolution);

// Get user's duels
router.get('/user/me', getUserDuels);

// Cancel a duel
router.put('/:id/cancel', cancelDuel);

// Join duel by invite code
router.post('/invite/:inviteCode', joinDuelByInviteCode);

export default router;