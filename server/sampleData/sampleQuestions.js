import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Question from '../models/Question.js';

dotenv.config();

const questions = [
  {
    title: 'Two Sum',
    description: 'Find two numbers that add up to target.',
    difficulty: 'Easy',
    tags: ['array', 'hashmap'],
  },
  {
    title: 'Longest Substring Without Repeating Characters',
    description: 'Return the length of the longest substring without repeating characters.',
    difficulty: 'Medium',
    tags: ['string', 'sliding window'],
  },
  {
    title: 'Median of Two Sorted Arrays',
    description: 'Find the median of two sorted arrays.',
    difficulty: 'Hard',
    tags: ['array', 'binary search'],
  },
];

const seedQuestions = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Question.deleteMany();
    await Question.insertMany(questions);
    console.log('✅ Sample questions seeded!');
    process.exit();
  } catch (err) {
    console.error('❌ Error seeding questions:', err);
    process.exit(1);
  }
};

seedQuestions();
