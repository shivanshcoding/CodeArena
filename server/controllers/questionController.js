import Question from '../models/Question.js';

// ✅ Get all questions for listing (add 'solved' too)
export const getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find({}, 'number slug title difficulty tags solved');
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// ✅ Get by MongoDB ID
export const getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ message: 'Question not found' });
    res.json(question);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get by slug + number
export const getQuestionBySlugAndNumber = async (req, res) => {
  const { slug, number } = req.params;
  try {
    const question = await Question.findOne({ slug, number: Number(number) });
    if (!question) return res.status(404).json({ message: 'Question not found' });
    res.json(question);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Submit editorial (Markdown string)
export const submitEditorial = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  try {
    const question = await Question.findById(id);
    if (!question) return res.status(404).json({ message: 'Question not found' });

    question.editorial = content;
    await question.save();

    res.json({ message: 'Editorial submitted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Submit a solution (stores createdAt too)
export const submitSolution = async (req, res) => {
  const { id } = req.params;
  const { content, author } = req.body;

  try {
    const question = await Question.findById(id);
    if (!question) return res.status(404).json({ message: 'Question not found' });

    question.solutions.push({
      content,
      author,
      createdAt: new Date()
    });

    await question.save();

    res.json({ message: 'Solution submitted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Admin-only: Upload/update test cases
export const updateTestCases = async (req, res) => {
  const { id } = req.params;
  const { testCases } = req.body;

  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ message: 'Only admins can update test cases' });
  }

  if (!Array.isArray(testCases)) {
    return res.status(400).json({ message: 'Test cases must be an array' });
  }

  try {
    const question = await Question.findById(id);
    if (!question) return res.status(404).json({ message: 'Question not found' });

    question.testCases = testCases;
    await question.save();

    res.json({ message: 'Test cases updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
