import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { 
    type: String, 
    unique: true, 
    sparse: true,
    // Ensure username is either a non-empty string or null
    validate: {
      validator: function(v) {
        return v === null || v.trim().length > 0;
      },
      message: props => 'Username cannot be an empty string'
    }
  },
  email: { type: String, required: true, unique: true },
  password: { type: String, default: '' },
  photo: { type: String, default: '' },
  age: { type: Number, default: 0 },
  institute: { type: String, default: '' },
  linkedin: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.model('User', userSchema);
