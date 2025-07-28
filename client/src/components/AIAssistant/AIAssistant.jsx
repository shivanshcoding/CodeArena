'use client';

import { useState, useEffect, useRef } from 'react';
import { getOrCreateSession, sendMessage, getMessages, clearSession, updateSettings, updateCodeContext } from '@/lib/aiAssistant';
import { useAuth } from '@/context/AuthContext';

const AIAssistant = ({ questionId, isOpen, onClose, onSessionInitialized, code, language, output }) => {
  const { user } = useAuth();
  const [session, setSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [context, setContext] = useState(null);
  const [settings, setSettings] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [codeSnippet, setCodeSnippet] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  // Initialize session
  useEffect(() => {
    if (isOpen && questionId && user) {
      initializeSession();
    }
  }, [isOpen, questionId, user]);

  // Scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const initializeSession = async () => {
    try {
      setLoading(true);
      setError(null);
      const sessionData = await getOrCreateSession(questionId);
      setSession(sessionData);
      setMessages(sessionData.messages || []);
      setContext(sessionData.context || {});
      setSettings(sessionData.settings || {
        autoSuggest: true,
        codeAnalysis: true,
        hintLevel: 'moderate'
      });
      
      // Call the onSessionInitialized callback with the session data
      if (onSessionInitialized) {
        onSessionInitialized(sessionData);
      }
      
      // If code and language are provided, update the code snippet and language
      if (code && language) {
        setCodeSnippet(code);
        setLanguage(language);
      }
    } catch (err) {
      setError('Failed to initialize AI assistant. Please try again.');
      console.error('Error initializing AI assistant:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !session?._id) return;

    try {
      setLoading(true);
      setError(null);
      
      // Optimistically add user message
      const userMessage = {
        content: newMessage,
        role: 'user',
        timestamp: new Date().toISOString(),
        metadata: showCodeInput && codeSnippet ? {
          codeSnippet,
          language,
          referencedCode: true
        } : undefined
      };
      setMessages(prev => [...prev, userMessage]);
      setNewMessage('');
      
      // Reset code snippet if shown
      if (showCodeInput) {
        setCodeSnippet('');
        setShowCodeInput(false);
      }
      
      // Send message to API
      const response = await sendMessage(
        session._id, 
        newMessage, 
        showCodeInput ? codeSnippet : null, 
        showCodeInput ? language : null
      );
      
      // Update messages, context and settings
      setMessages(response.session.messages);
      setContext(response.session.context || {});
    } catch (err) {
      setError('Failed to send message. Please try again.');
      console.error('Error sending message:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = async () => {
    if (!session?._id) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await clearSession(session._id);
      setMessages(response.session.messages || []);
      setContext(response.session.context || {});
    } catch (err) {
      setError('Failed to clear chat. Please try again.');
      console.error('Error clearing chat:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleUpdateSettings = async (newSettings) => {
    if (!session?._id) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await updateSettings(session._id, newSettings);
      setSettings(response.settings);
    } catch (err) {
      setError('Failed to update settings. Please try again.');
      console.error('Error updating settings:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const toggleCodeInput = () => {
    setShowCodeInput(prev => !prev);
  };
  
  const handleAnalyzeCode = async () => {
    if (!session?._id || !code) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Update code context with current code and language
      await updateCodeContext(session._id, code, language, output?.stderr || '');
      
      // Get updated messages after context update
      const response = await getMessages(session._id);
      setMessages(response.session.messages);
      setContext(response.session.context || {});
      
      // Hide code input if it was showing
      if (showCodeInput) {
        setShowCodeInput(false);
      }
    } catch (err) {
      setError('Failed to analyze code. Please try again.');
      console.error('Error analyzing code:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-20 right-8 w-96 h-[600px] bg-white dark:bg-gray-800 rounded-lg shadow-lg flex flex-col z-50 border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">AI Assistant</h3>
          {settings && (
            <div className="ml-2 relative group">
              <button 
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                onClick={() => {
                  const settingsPanel = document.getElementById('settings-panel');
                  if (settingsPanel) {
                    settingsPanel.classList.toggle('hidden');
                  }
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
              </button>
              <div id="settings-panel" className="hidden absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-200 dark:border-gray-700 z-10">
                <h4 className="text-sm font-semibold mb-2 text-gray-800 dark:text-white">Assistant Settings</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-gray-700 dark:text-gray-300">Auto-suggest</label>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none">
                      <input 
                        type="checkbox" 
                        id="auto-suggest" 
                        checked={settings.autoSuggest} 
                        onChange={() => handleUpdateSettings({ ...settings, autoSuggest: !settings.autoSuggest })} 
                        className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                      />
                      <label 
                        htmlFor="auto-suggest" 
                        className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${settings.autoSuggest ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                      ></label>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-gray-700 dark:text-gray-300">Code Analysis</label>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none">
                      <input 
                        type="checkbox" 
                        id="code-analysis" 
                        checked={settings.codeAnalysis} 
                        onChange={() => handleUpdateSettings({ ...settings, codeAnalysis: !settings.codeAnalysis })} 
                        className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                      />
                      <label 
                        htmlFor="code-analysis" 
                        className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${settings.codeAnalysis ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                      ></label>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm text-gray-700 dark:text-gray-300">Hint Level</label>
                    <select 
                      value={settings.hintLevel} 
                      onChange={(e) => handleUpdateSettings({ ...settings, hintLevel: e.target.value })}
                      className="w-full p-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="minimal">Minimal</option>
                      <option value="moderate">Moderate</option>
                      <option value="detailed">Detailed</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto">
        {loading && messages.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-10">
            <p>No messages yet. Ask me anything about this problem!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${msg.role === 'user' ? 'bg-blue-500 text-white' : msg.role === 'system' ? 'bg-green-100 dark:bg-green-900 text-gray-800 dark:text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'}`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  {msg.metadata?.codeSnippet && (
                    <div className="mt-2 p-2 bg-gray-800 text-white rounded overflow-x-auto">
                      <pre className="text-xs">
                        <code>{msg.metadata.codeSnippet}</code>
                      </pre>
                      <div className="text-xs mt-1 text-gray-400">{msg.metadata.language}</div>
                    </div>
                  )}
                  <p className="text-xs mt-1 opacity-70">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4">
            {error}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <form onSubmit={handleSendMessage} className="flex flex-col space-y-2">
          {showCodeInput && (
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm text-gray-700 dark:text-gray-300">Code Snippet</label>
                <div className="flex items-center space-x-2">
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="text-xs p-1 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                    <option value="cpp">C++</option>
                    <option value="csharp">C#</option>
                  </select>
                </div>
              </div>
              <textarea
                value={codeSnippet}
                onChange={(e) => setCodeSnippet(e.target.value)}
                placeholder="Paste your code here..."
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white font-mono text-sm"
                rows={5}
              />
            </div>
          )}
          <div className="flex">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Ask me anything about this problem..."
              className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              disabled={loading}
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              disabled={loading || !newMessage.trim()}
            >
              Send
            </button>
          </div>
          <div className="flex justify-between">
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={toggleCodeInput}
                className="text-sm text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                {showCodeInput ? 'Hide Code Input' : 'Add Code Snippet'}
              </button>
              {code && (
                <button
                  type="button"
                  onClick={handleAnalyzeCode}
                  className="text-sm text-green-500 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                  disabled={loading || !session}
                >
                  Analyze Current Code
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={handleClearChat}
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              disabled={loading || messages.length === 0}
            >
              Clear conversation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AIAssistant;