import mongoose from 'mongoose';

const testCaseSchema = new mongoose.Schema({
  input: String,
  expectedOutput: String
});

const questionSchema = new mongoose.Schema({
  number: { type: Number, unique: true },
  slug: { type: String, unique: true },
  title: String,
  difficulty: String,
  tags: [String],
  description: String,
  editorial: String,
  solutions: [
    {
      content: String,
      author: String,
      createdAt: { type: Date, default: Date.now }
    }
  ],
  testCases: [testCaseSchema],
  adminOnly: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const Question = mongoose.model('Question', questionSchema);
export default Question;
