import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, unique: true, sparse: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, default: '' },
  photo: { type: String, default: '' },
  age: { type: Number, default: 0 },
  institute: { type: String, default: '' },
  linkedin: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.model('User', userSchema);
