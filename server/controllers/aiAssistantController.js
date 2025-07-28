import AIAssistantSession from '../models/AIAssistant.js';
import Question from '../models/Question.js';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

// Mock AI responses for different question types
const mockAIResponses = {
  arrays: [
    "Consider using a hash map to optimize lookup operations.",
    "Try a two-pointer approach to solve this array problem efficiently.",
    "Have you considered sorting the array first? It might simplify the solution.",
    "For this problem, a sliding window technique could be effective."
  ],
  linkedList: [
    "Remember to handle edge cases like empty lists or single node lists.",
    "A two-pointer technique can be useful for linked list problems.",
    "Consider using a dummy head node to simplify operations on the head.",
    "For this problem, you might need to reverse parts of the linked list."
  ],
  dynamicProgramming: [
    "Try breaking down this problem into overlapping subproblems.",
    "Consider using memoization to avoid redundant calculations.",
    "A bottom-up approach might be more efficient for this DP problem.",
    "Identify the recurrence relation to solve this efficiently."
  ],
  trees: [
    "Consider using a depth-first search approach for this tree problem.",
    "A breadth-first traversal might be more suitable here.",
    "Remember to check for null nodes in your recursive solution.",
    "For this binary tree problem, an in-order traversal could be helpful."
  ],
  general: [
    "Make sure to analyze the time and space complexity of your solution.",
    "Consider edge cases in your implementation.",
    "Can you optimize your current approach further?",
    "Try to break down the problem into smaller, manageable parts."
  ],
  errors: [
    "Check for off-by-one errors in your loops.",
    "Make sure your base cases are correctly defined for recursive solutions.",
    "Verify that you're handling null or undefined values properly.",
    "Consider edge cases like empty arrays or single-element collections."
  ]
};

// Enhanced helper function to get a response based on question tags and user context
const getAIResponse = (question, userMessage = null, session = null) => {
  // If we have a session with context, use it to provide more tailored responses
  if (session && session.context) {
    // If there's a specific error, provide error-focused guidance
    if (session.context.lastError) {
      return mockAIResponses.errors[Math.floor(Math.random() * mockAIResponses.errors.length)];
    }
    
    // If user has asked for help multiple times, provide more detailed guidance
    if (session.context.helpRequestCount > 3) {
      // Provide more detailed help for frequent help-seekers
      return "I notice you've been working on this problem for a while. Let's take a step back and think about the overall approach. What's the core algorithm or data structure that might be most suitable here?";
    }
  }
  
  // Default tag-based response logic
  if (!question || !question.tags || question.tags.length === 0) {
    return mockAIResponses.general[Math.floor(Math.random() * mockAIResponses.general.length)];
  }
  
  const tags = question.tags.map(tag => tag.toLowerCase());
  
  if (tags.some(tag => tag.includes('array'))) {
    return mockAIResponses.arrays[Math.floor(Math.random() * mockAIResponses.arrays.length)];
  } else if (tags.some(tag => tag.includes('linked list'))) {
    return mockAIResponses.linkedList[Math.floor(Math.random() * mockAIResponses.linkedList.length)];
  } else if (tags.some(tag => tag.includes('dynamic programming') || tag.includes('dp'))) {
    return mockAIResponses.dynamicProgramming[Math.floor(Math.random() * mockAIResponses.dynamicProgramming.length)];
  } else if (tags.some(tag => tag.includes('tree') || tag.includes('binary tree'))) {
    return mockAIResponses.trees[Math.floor(Math.random() * mockAIResponses.trees.length)];
  } else {
    return mockAIResponses.general[Math.floor(Math.random() * mockAIResponses.general.length)];
  }
};

// Get or create a session for a user and question
export const getOrCreateSession = async (req, res) => {
  try {
    const { questionId } = req.params;
    const userId = req.user.id;

    // Validate questionId
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Find existing session or create new one
    let session = await AIAssistantSession.findOne({ userId, questionId });
    
    if (!session) {
      session = new AIAssistantSession({
        userId,
        questionId,
        messages: [],
        context: {
          hints: [],
          helpRequestCount: 0
        },
        settings: {
          autoSuggest: true,
          codeAnalysis: true,
          hintLevel: 'moderate'
        }
      });
      
      // Add initial welcome message
      session.messages.push({
        content: `Hello! I'm your AI assistant for this problem. How can I help you with "${question.title}"?`,
        role: 'assistant',
        timestamp: new Date()
      });
      
      await session.save();
    }

    return res.status(200).json(session);
  } catch (error) {
    console.error('Error in getOrCreateSession:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Send a message to the AI assistant
export const sendMessage = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { content, codeSnippet, language } = req.body;
    const userId = req.user.id;

    if (!content || content.trim() === '') {
      return res.status(400).json({ message: 'Message content is required' });
    }

    // Find the session
    const session = await AIAssistantSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Verify the session belongs to the user
    if (session.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized access to this session' });
    }

    // Increment help request count
    session.incrementHelpCount();
    
    // Add user message with optional code snippet
    const userMessage = {
      content,
      role: 'user',
      timestamp: new Date()
    };
    
    // Add code snippet metadata if provided
    if (codeSnippet && language) {
      userMessage.metadata = {
        codeSnippet,
        language,
        referencedCode: true
      };
    }
    
    session.messages.push(userMessage);

    // Get the question for context
    const question = await Question.findById(session.questionId);
    
    // Generate AI response based on enhanced context
    const aiResponse = getAIResponse(question, content, session);
    
    // Add AI response
    session.messages.push({
      content: aiResponse,
      role: 'assistant',
      timestamp: new Date()
    });

    await session.save();

    return res.status(200).json({
      message: 'Message sent successfully',
      aiResponse,
      session
    });
  } catch (error) {
    console.error('Error in sendMessage:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all messages for a session
export const getMessages = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.id;

    // Find the session
    const session = await AIAssistantSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Verify the session belongs to the user
    if (session.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized access to this session' });
    }

    return res.status(200).json({
      messages: session.messages,
      context: session.context,
      settings: session.settings
    });
  } catch (error) {
    console.error('Error in getMessages:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Clear all messages in a session
export const clearSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.id;

    // Find the session
    const session = await AIAssistantSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Verify the session belongs to the user
    if (session.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized access to this session' });
    }

    // Get the question for context
    const question = await Question.findById(session.questionId);
    
    // Clear messages but add a new welcome message
    session.messages = [{
      content: `Chat cleared. How else can I help you with "${question.title}"?`,
      role: 'assistant',
      timestamp: new Date()
    }];
    
    // Reset help request count
    session.context.helpRequestCount = 0;
    
    await session.save();

    return res.status(200).json({
      message: 'Session cleared successfully',
      session
    });
  } catch (error) {
    console.error('Error in clearSession:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update AI assistant settings
export const updateSettings = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { settings } = req.body;
    const userId = req.user.id;

    if (!settings) {
      return res.status(400).json({ message: 'Settings are required' });
    }

    // Find the session
    const session = await AIAssistantSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Verify the session belongs to the user
    if (session.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized access to this session' });
    }

    // Update settings
    if (typeof settings.autoSuggest === 'boolean') {
      session.settings.autoSuggest = settings.autoSuggest;
    }
    
    if (typeof settings.codeAnalysis === 'boolean') {
      session.settings.codeAnalysis = settings.codeAnalysis;
    }
    
    if (settings.hintLevel && ['minimal', 'moderate', 'detailed'].includes(settings.hintLevel)) {
      session.settings.hintLevel = settings.hintLevel;
    }

    await session.save();

    // Add system message about settings change
    session.messages.push({
      content: `Settings updated: ${Object.keys(settings).join(', ')}`,
      role: 'system',
      timestamp: new Date()
    });
    
    await session.save();

    return res.status(200).json({
      message: 'Settings updated successfully',
      settings: session.settings
    });
  } catch (error) {
    console.error('Error in updateSettings:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update code context
export const updateCodeContext = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { code, language, error } = req.body;
    const userId = req.user.id;

    if (!code || !language) {
      return res.status(400).json({ message: 'Code and language are required' });
    }

    // Find the session
    const session = await AIAssistantSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Verify the session belongs to the user
    if (session.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized access to this session' });
    }

    // Update code context
    session.updateCodeContext(code, language, error);
    await session.save();

    // If auto-suggest is enabled and there's an error, generate a suggestion
    let suggestion = null;
    if (session.settings.autoSuggest && error) {
      // Get the question for context
      const question = await Question.findById(session.questionId);
      
      // Generate a suggestion based on the error
      const errorMessage = `I'm getting this error: ${error}`;
      suggestion = getAIResponse(question, errorMessage, session);
      
      // Add system message with the suggestion
      if (suggestion) {
        session.messages.push({
          content: `Auto-suggestion based on error: ${suggestion}`,
          role: 'system',
          timestamp: new Date(),
          metadata: {
            referencedCode: true
          }
        });
        await session.save();
      }
    }

    return res.status(200).json({
      message: 'Code context updated successfully',
      suggestion
    });
  } catch (error) {
    console.error('Error in updateCodeContext:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};