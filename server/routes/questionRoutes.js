import express from 'express';
import { getAllQuestions, getQuestionById } from '../controllers/questionController.js'; // ✅ Add getQuestionById

const router = express.Router();
router.get('/', getAllQuestions);
router.get('/:id', getQuestionById);

export default router;
