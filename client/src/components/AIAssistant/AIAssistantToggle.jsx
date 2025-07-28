'use client';

import { useState, useEffect } from 'react';
import AIAssistant from './AIAssistant';
import { updateCodeContext } from '@/lib/aiAssistant';

const AIAssistantToggle = ({ questionId, code, language, output }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [session, setSession] = useState(null);
  const [lastCodeUpdate, setLastCodeUpdate] = useState({ code: '', language: '' });

  // Update code context when code, language, or output changes
  useEffect(() => {
    // Only update if we have a session and the code or language has changed
    if (session && (code !== lastCodeUpdate.code || language !== lastCodeUpdate.language) && code.trim()) {
      const updateContext = async () => {
        try {
          // Extract error message if present
          const errorMessage = output?.stderr || '';
          
          await updateCodeContext(session._id, code, language, errorMessage);
          setLastCodeUpdate({ code, language });
        } catch (error) {
          console.error('Error updating code context:', error);
        }
      };
      
      updateContext();
    }
  }, [code, language, output, session, lastCodeUpdate]);

  const toggleAssistant = () => {
    setIsOpen(prev => !prev);
  };

  return (
    <>
      <button
        onClick={toggleAssistant}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 z-40"
        aria-label="Toggle AI Assistant"
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        )}
      </button>
      <AIAssistant 
        questionId={questionId} 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)}
        onSessionInitialized={setSession}
        code={code}
        language={language}
        output={output}
      />
    </>
  );
};

export default AIAssistantToggle;