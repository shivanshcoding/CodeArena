import Submission from '../models/Submission.js';

export const submitCode = async (req, res) => {
  try {
    const { problemId, code, language_id, stdout, stderr } = req.body;
    const newSubmission = await Submission.create({
      problemId,
      code,
      language_id,
      stdout,
      stderr,
    });
    res.status(201).json(newSubmission);
  } catch (err) {
    console.error('❌ Submission error:', err.message);
    res.status(500).json({ message: 'Failed to submit code.' });
  }
};

export const getSubmissionsByProblem = async (req, res) => {
  try {
    const { problemId } = req.params;
    const submissions = await Submission.find({ problemId }).sort({ submittedAt: -1 });
    res.json(submissions);
  } catch (err) {
    console.error('❌ Fetch submissions error:', err.message);
    res.status(500).json({ message: 'Error fetching submissions.' });
  }
};

