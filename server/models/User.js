// models/User.js

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  age: Number,
  address: String,
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', userSchema);
