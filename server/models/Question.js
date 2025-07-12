import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  number: { type: Number, unique: true },
  slug: { type: String, unique: true }, // e.g., two-sum
  title: String,
  difficulty: String,
  tags: [String],
  description: String, // Markdown
  editorial: String,   // Markdown, can be user-contributed
  solutions: [
    {
      content: String, // Markdown
      author: String,
      createdAt: { type: Date, default: Date.now }
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

const Question = mongoose.model('Question', questionSchema);
export default Question;
