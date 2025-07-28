import axios from 'axios';
import Submission from '../models/Submission.js';
import Question from '../models/Question.js';

const JUDGE0_URL = 'https://judge0-ce.p.rapidapi.com/submissions';
const JUDGE0_OPTIONS = {
  headers: {
    'content-type': 'application/json',
    'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
    'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
  },
};

export const submitCode = async (req, res) => {
  try {
    const { questionSlug, questionNumber, sourceCode, language } = req.body;

    const question = await Question.findOne({ slug: questionSlug, number: questionNumber });
    if (!question) return res.status(404).json({ error: 'Question not found' });

    const testCases = question.testCases || [];
    const results = [];

    for (const testCase of testCases) {
      const submissionPayload = {
        source_code: sourceCode,
        language_id: 54, // Optional: map this dynamically based on 'language'
        stdin: testCase.input,
        expected_output: testCase.expectedOutput,
      };

      const judgeRes = await axios.post(
        `${JUDGE0_URL}?base64_encoded=false&wait=true`,
        submissionPayload,
        JUDGE0_OPTIONS
      );

      results.push({
        input: testCase.input,
        expected: testCase.expectedOutput,
        stdout: judgeRes.data.stdout,
        stderr: judgeRes.data.stderr,
        status: judgeRes.data.status,
      });
    }

    const isAccepted = results.every((r) => r.status.description === 'Accepted');

    const submission = new Submission({
      questionSlug,
      questionNumber,
      sourceCode,
      language,
      verdict: isAccepted ? 'Accepted' : 'Wrong Answer',
      testResults: results,
    });

    await submission.save();

    res.json({
      verdict: submission.verdict,
      results: results,
    });
  } catch (err) {
    console.error('Judge0 error:', err?.response?.data || err.message);
    res.status(500).json({ error: 'Code execution failed' });
  }
};

export const getSubmissionsByProblem = async (req, res) => {
  const { problemId } = req.params;
  try {
    const submissions = await Submission.find({ questionId: problemId }).sort({ createdAt: -1 });
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching submissions.' });
  }
};
