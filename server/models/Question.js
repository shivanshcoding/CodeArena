import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  title: String,
  description: String,
  difficulty: String,
  tags: [String]
});

const Question = mongoose.model('Question', questionSchema);
export default Question;
