import api from './api';

// Get or create a session for a user and question
export const getOrCreateSession = async (questionId) => {
  try {
    const response = await api.get(`/ai-assistant/session/${questionId}`);
    return response.data;
  } catch (error) {
    console.error('Error getting or creating AI assistant session:', error);
    throw error;
  }
};

// Send a message to the AI assistant
export const sendMessage = async (sessionId, content, codeSnippet = null, language = null) => {
  try {
    const payload = { content };
    
    // Add code snippet if provided
    if (codeSnippet && language) {
      payload.codeSnippet = codeSnippet;
      payload.language = language;
    }
    
    const response = await api.post(`/ai-assistant/message/${sessionId}`, payload);
    return response.data;
  } catch (error) {
    console.error('Error sending message to AI assistant:', error);
    throw error;
  }
};

// Get all messages for a session
export const getMessages = async (sessionId) => {
  try {
    const response = await api.get(`/ai-assistant/messages/${sessionId}`);
    return response.data;
  } catch (error) {
    console.error('Error getting AI assistant messages:', error);
    throw error;
  }
};

// Clear all messages in a session
export const clearSession = async (sessionId) => {
  try {
    const response = await api.delete(`/ai-assistant/session/${sessionId}`);
    return response.data;
  } catch (error) {
    console.error('Error clearing AI assistant session:', error);
    throw error;
  }
};

// Update AI assistant settings
export const updateSettings = async (sessionId, settings) => {
  try {
    const response = await api.put(`/ai-assistant/settings/${sessionId}`, { settings });
    return response.data;
  } catch (error) {
    console.error('Error updating AI assistant settings:', error);
    throw error;
  }
};

// Update code context
export const updateCodeContext = async (sessionId, code, language, error = null) => {
  try {
    const response = await api.post(`/ai-assistant/code-context/${sessionId}`, { 
      code, 
      language, 
      error 
    });
    return response.data;
  } catch (error) {
    console.error('Error updating code context:', error);
    throw error;
  }
};