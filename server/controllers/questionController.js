import Question from '../models/Question.js';

export const getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find({}, 'number slug title difficulty tags');
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};


export const getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ message: 'Question not found' });
    res.json(question);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get question by slug and number
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

// Update or add editorial (markdown string)
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

export const submitSolution = async (req, res) => {
  const { id } = req.params;
  const { content, author } = req.body;

  try {
    const question = await Question.findById(id);
    if (!question) return res.status(404).json({ message: 'Question not found' });

    question.solutions.push({ content, author });
    await question.save();

    res.json({ message: 'Solution submitted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const uploadTestCases = async (req, res) => {
  const { id } = req.params;
  const { testCases } = req.body; // Expecting array of {input, expectedOutput}

  if (!Array.isArray(testCases)) {
    return res.status(400).json({ message: 'Test cases must be an array' });
  }

  try {
    const question = await Question.findById(id);
    if (!question) return res.status(404).json({ message: 'Question not found' });

    question.testCases = testCases;
    await question.save();

    res.json({ message: 'Test cases uploaded successfully', testCases });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


