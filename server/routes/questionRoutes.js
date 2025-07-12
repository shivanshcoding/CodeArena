import express from 'express';

import {
  getAllQuestions,
  getQuestionById,
  getQuestionBySlugAndNumber,
  submitEditorial,
  submitSolution,
} from '../controllers/questionController.js';

const router = express.Router();

router.get('/', getAllQuestions);
router.get('/:id', getQuestionById);
router.get('/:slug/:number', getQuestionBySlugAndNumber);
router.post('/:id/editorial', submitEditorial);
router.post('/:id/solutions', submitSolution);
// Get question by slug + number

export default router;