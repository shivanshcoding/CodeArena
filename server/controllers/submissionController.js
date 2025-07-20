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

    const testCases = question.testCases || [];

    let finalVerdict = 'Accepted';
    let output = '';
    let error = '';
    let time = '';
    let memory = '';

    for (const tc of testCases) {
      const submissionRes = await axios.post('https://judge0-ce.p.rapidapi.com/submissions', {
        source_code: code,
        language_id: getJudge0LangId(language),
        stdin: tc.input,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
        }
      });

      const token = submissionRes.data.token;

      let result;
      let tries = 0;
      while (tries < 10) {
        const res = await axios.get(`https://judge0-ce.p.rapidapi.com/submissions/${token}`, {
          headers: {
            'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
          }
        });
        result = res.data;
        if (result.status.description !== 'In Queue') break;
        await new Promise(r => setTimeout(r, 1500));
        tries++;
      }

      const cleanedOutput = (result.stdout || '').trim();
      const expected = tc.expectedOutput.trim();

      if (cleanedOutput !== expected) {
        finalVerdict = 'Wrong Answer';
        output = cleanedOutput;
        error = result.stderr || result.compile_output || '';
        time = result.time;
        memory = result.memory;
        break;
      }

      output = result.stdout;
      error = result.stderr || result.compile_output || '';
      time = result.time;
      memory = result.memory;
    }

    const newSubmission = await Submission.create({
      userId,
      questionId,
      code,
      language,
      verdict: finalVerdict,
      output,
      error,
      time,
      memory,
    });

    res.json({ message: 'Submission successful', submission: newSubmission });

  } catch (err) {
    console.error('❌ Judge0 error:', err.message);
    res.status(500).json({ message: 'Code execution failed' });
  }
};


export const getSubmissionsByProblem = async (req, res) => {
  try {
    const { problemId } = req.params;
    const submissions = await Submission.find({ questionId: problemId }).sort({ createdAt: -1 });
    res.json(submissions);
  } catch (err) {
    console.error('❌ Fetch submissions error:', err.message);
    res.status(500).json({ message: 'Error fetching submissions.' });
  }
};
