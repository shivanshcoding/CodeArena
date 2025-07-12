// seed.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Question from '../models/Question.js'; // ✅ adjust if path differs
import connectDB from '../config/db.js';

dotenv.config();
await connectDB();

const seedQuestions = [
  {
    number: 1,
    slug: 'two-sum',
    title: 'Two Sum',
    difficulty: 'Easy',
    tags: ['Array', 'Hash Table'],
    description: `### Problem\n\nGiven an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.\n\n### Example\n\`\`\`txt\nInput: nums = [2,7,11,15], target = 9\nOutput: [0,1]\n\`\`\``,
    editorial: '',
    solutions: []
  },
  {
    number: 2,
    slug: 'add-two-numbers',
    title: 'Add Two Numbers',
    difficulty: 'Medium',
    tags: ['Linked List', 'Math'],
    description: `### Problem\n\nYou are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.\n\nYou may assume the two numbers do not contain any leading zero, except the number 0 itself.`,
    editorial: '',
    solutions: []
  },
  {
    number: 3,
    slug: 'longest-substring-without-repeating-characters',
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    tags: ['Hash Table', 'String', 'Sliding Window'],
    description: `### Problem\n\nGiven a string \`s\`, find the length of the longest substring without repeating characters.`,
    editorial: '',
    solutions: []
  },
  {
    number: 4,
    slug: 'median-of-two-sorted-arrays',
    title: 'Median of Two Sorted Arrays',
    difficulty: 'Hard',
    tags: ['Array', 'Binary Search', 'Divide and Conquer'],
    description: `### Problem\n\nGiven two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.`,
    editorial: '',
    solutions: []
  },
  {
    number: 5,
    slug: 'longest-palindromic-substring',
    title: 'Longest Palindromic Substring',
    difficulty: 'Medium',
    tags: ['String', 'Dynamic Programming'],
    description: `### Problem\n\nGiven a string \`s\`, return the longest palindromic substring in \`s\`.`,
    editorial: '',
    solutions: []
  },
  {
    number: 6,
    slug: 'zigzag-conversion',
    title: 'Zigzag Conversion',
    difficulty: 'Medium',
    tags: ['String'],
    description: `### Problem\n\nThe string \`"PAYPALISHIRING"\` is written in a zigzag pattern on a given number of rows.`,
    editorial: '',
    solutions: []
  },
  {
    number: 7,
    slug: 'reverse-integer',
    title: 'Reverse Integer',
    difficulty: 'Easy',
    tags: ['Math'],
    description: `### Problem\n\nGiven a signed 32-bit integer x, return x with its digits reversed. If reversing x causes the value to go outside the signed 32-bit integer range, return 0.`,
    editorial: '',
    solutions: []
  },
  {
    number: 8,
    slug: 'string-to-integer-atoi',
    title: 'String to Integer (atoi)',
    difficulty: 'Medium',
    tags: ['String'],
    description: `### Problem\n\nImplement the \`myAtoi(string s)\` function, which converts a string to a 32-bit signed integer.`,
    editorial: '',
    solutions: []
  },
  {
    number: 9,
    slug: 'palindrome-number',
    title: 'Palindrome Number',
    difficulty: 'Easy',
    tags: ['Math'],
    description: `### Problem\n\nGiven an integer x, return true if x is a palindrome, and false otherwise.`,
    editorial: '',
    solutions: []
  },
  {
    number: 10,
    slug: 'regular-expression-matching',
    title: 'Regular Expression Matching',
    difficulty: 'Hard',
    tags: ['String', 'Dynamic Programming'],
    description: `### Problem\n\nGiven an input string s and a pattern p, implement regular expression matching with support for \`.\` and \`*\`.`,
    editorial: '',
    solutions: []
  }
];

const seed = async () => {
  try {
    await Question.deleteMany({});
    await Question.insertMany(seedQuestions);
    console.log('✅ Seeded 10 questions successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
};

seed();
