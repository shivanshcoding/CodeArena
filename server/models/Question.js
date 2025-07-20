import mongoose from 'mongoose';

const solutionSchema = new mongoose.Schema({
  content: { type: String, required: true },
  author: { type: String, default: 'Anonymous' },
  createdAt: { type: Date, default: Date.now }
});

const testCaseSchema = new mongoose.Schema({
  input: { type: String, required: true },
  expectedOutput: { type: String, required: true }
});

const questionSchema = new mongoose.Schema({
  number: { type: Number, required: true, unique: true },
  slug: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
  tags: [{ type: String }],
  editorial: { type: String },
  solutions: [solutionSchema],
  testCases: [testCaseSchema],
  solved: { type: Boolean, default: false }
});

export default mongoose.model('Question', questionSchema);
