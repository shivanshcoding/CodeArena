import express from 'express';
import { submitCode, getSubmissionsByProblem } from '../controllers/submissionController.js';

const router = express.Router();

router.post('/', submitCode);
router.get('/:problemId', getSubmissionsByProblem);
router.post('/submit', submitCode);


export default router;
