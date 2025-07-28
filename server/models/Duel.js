import mongoose from 'mongoose';

const duelSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'completed', 'cancelled'],
    default: 'pending'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  opponent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true
  },
  timeLimit: {
    type: Number, // in minutes
    default: 30
  },
  startTime: {
    type: Date
  },
  endTime: {
    type: Date
  },
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    submissionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Submission'
    },
    completedAt: {
      type: Date
    },
    result: {
      status: {
        type: String,
        enum: ['pending', 'success', 'failed', 'timeout'],
        default: 'pending'
      },
      executionTime: {
        type: Number // in milliseconds
      },
      memoryUsed: {
        type: Number // in KB
      }
    }
  }],
  isPublic: {
    type: Boolean,
    default: true
  },
  inviteCode: {
    type: String,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field on save
duelSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Generate a random invite code before saving if not provided
duelSchema.pre('save', function(next) {
  if (!this.inviteCode) {
    this.inviteCode = Math.random().toString(36).substring(2, 10).toUpperCase();
  }
  next();
});

const Duel = mongoose.model('Duel', duelSchema);
export default Duel;