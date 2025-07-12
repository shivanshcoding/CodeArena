import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true,
  },
  code: String,
  language_id: Number,
  stdout: String,
  stderr: String,
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Submission', submissionSchema);
