import express from 'express';
import {
  getAllQuestions,
  getQuestionById,
  getQuestionBySlugAndNumber,
  submitEditorial,
  submitSolution,
  updateTestCases,
} from '../controllers/questionController.js';
import { authenticateJWT } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllQuestions);
router.get('/:id', getQuestionById);
router.get('/:slug/:number', getQuestionBySlugAndNumber);

router.post('/:id/editorial', submitEditorial);
router.post('/:id/solutions', submitSolution);

// ✅ Admin-only route — must be authenticated first
router.put('/:id/testcases', authenticateJWT, updateTestCases);

export default router;
