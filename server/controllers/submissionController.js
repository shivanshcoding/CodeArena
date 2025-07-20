import axios from 'axios';
import Submission from '../models/Submission.js';
import Question from '../models/Question.js';

const getJudge0LangId = (lang) => {
  const map = {
    cpp: 54,
    python: 71,
    java: 62,
    js: 63,
  };
  return map[lang] || 71;
};

export const submitCode = async (req, res) => {
  const { userId, questionId, code, language } = req.body;

  try {
    const question = await Question.findById(questionId);
    if (!question) return res.status(404).json({ message: 'Question not found' });

    const response = await axios.post(
      'https://judge0-ce.p.rapidapi.com/submissions',
      {
        source_code: code,
        language_id: getJudge0LangId(language),
        stdin: question.testCases?.[0]?.input || '',
        expected_output: question.testCases?.[0]?.expectedOutput || '',
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
        },
      }
    );

    const token = response.data.token;

    // Poll Judge0 until result is ready
    let result;
    for (let i = 0; i < 10; i++) {
      const resultRes = await axios.get(
        `https://judge0-ce.p.rapidapi.com/submissions/${token}`,
        {
          headers: {
            'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
          },
        }
      );

      result = resultRes.data;
      if (result.status?.description !== 'In Queue') break;
      await new Promise((r) => setTimeout(r, 1500));
    }

    // Save submission
    const submission = await Submission.create({
      userId,
      questionId,
      code,
      language,
      verdict: result.status?.description,
      output: result.stdout || '',
      error: result.stderr || result.compile_output || '',
      time: result.time,
      memory: result.memory,
    });

    // If verdict is Accepted, mark question as solved
    if (result.status?.description === 'Accepted') {
      await Question.findByIdAndUpdate(questionId, { solved: true });
    }

    res.json({ message: 'Submission successful', submission });
  } catch (err) {
    console.error('Judge0 error:', err.message);
    res.status(500).json({ message: 'Code execution failed' });
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
