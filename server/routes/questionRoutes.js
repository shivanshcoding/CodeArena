import express from 'express';

import {
  getAllQuestions,
  getQuestionById,
  getQuestionBySlugAndNumber,
  submitEditorial,
  submitSolution,
  uploadTestCases
} from '../controllers/questionController.js';

const router = express.Router();

router.get('/', getAllQuestions);
router.get('/:id', getQuestionById);
router.get('/:slug/:number', getQuestionBySlugAndNumber);
router.post('/:id/editorial', submitEditorial);
router.post('/:id/solutions', submitSolution);
router.post('/:id/testcases', uploadTestCases);
// Get question by slug + number

export default router;