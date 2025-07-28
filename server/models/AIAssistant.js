import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  content: { type: String, required: true },
  role: { type: String, enum: ['user', 'assistant', 'system'], required: true },
  timestamp: { type: Date, default: Date.now },
  metadata: {
    codeSnippet: { type: String },
    language: { type: String },
    referencedQuestion: { type: Boolean, default: false },
    referencedCode: { type: Boolean, default: false }
  }
});

const aiAssistantSessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
  messages: [messageSchema],
  context: {
    lastCodeSubmission: { type: String },
    lastCodeLanguage: { type: String },
    lastError: { type: String },
    hints: [{ type: String }],
    helpRequestCount: { type: Number, default: 0 }
  },
  settings: {
    autoSuggest: { type: Boolean, default: true },
    codeAnalysis: { type: Boolean, default: true },
    hintLevel: { type: String, enum: ['minimal', 'moderate', 'detailed'], default: 'moderate' }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt field on save
aiAssistantSessionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Method to add a hint to the context
aiAssistantSessionSchema.methods.addHint = function(hint) {
  if (!this.context.hints.includes(hint)) {
    this.context.hints.push(hint);
  }
  return this;
};

// Method to increment help request count
aiAssistantSessionSchema.methods.incrementHelpCount = function() {
  this.context.helpRequestCount += 1;
  return this;
};

// Method to update code context
aiAssistantSessionSchema.methods.updateCodeContext = function(code, language, error = null) {
  this.context.lastCodeSubmission = code;
  this.context.lastCodeLanguage = language;
  if (error) {
    this.context.lastError = error;
  }
  return this;
};

const AIAssistantSession = mongoose.model('AIAssistantSession', aiAssistantSessionSchema);
export default AIAssistantSession;