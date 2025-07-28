'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createDuel } from '@/lib/duels';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function CreateDuelPage() {
  return (
    <ProtectedRoute>
      <CreateDuelContent />
    </ProtectedRoute>
  );
}

function CreateDuelContent() {
  const [title, setTitle] = useState('');
  const [questionId, setQuestionId] = useState('');
  const [timeLimit, setTimeLimit] = useState(30);
  const [isPublic, setIsPublic] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [questionsLoading, setQuestionsLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    // Fetch questions for the dropdown
    const fetchQuestions = async () => {
      try {
        setQuestionsLoading(true);
        const response = await fetch('/api/questions');
        if (!response.ok) {
          throw new Error('Failed to fetch questions');
        }
        const data = await response.json();
        setQuestions(data);
      } catch (err) {
        console.error('Error fetching questions:', err);
        setError('Failed to load questions. Please try again.');
      } finally {
        setQuestionsLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Please enter a title for the duel');
      return;
    }

    if (!questionId) {
      setError('Please select a question for the duel');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const duelData = {
        title,
        questionId,
        timeLimit: parseInt(timeLimit),
        isPublic
      };

      const response = await createDuel(duelData);
      router.push(`/duels/${response._id}`);
    } catch (err) {
      console.error('Error creating duel:', err);
      setError(err.response?.data?.message || 'Failed to create duel. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <Link href="/duels" className="text-blue-600 hover:underline flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Duels
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Create a New Duel</h1>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Duel Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter a title for your duel"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="questionId" className="block text-sm font-medium text-gray-700 mb-1">
              Select Question
            </label>
            {questionsLoading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                <span className="text-sm text-gray-500">Loading questions...</span>
              </div>
            ) : (
              <select
                id="questionId"
                value={questionId}
                onChange={(e) => setQuestionId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select a question</option>
                {questions.map((question) => (
                  <option key={question._id} value={question._id}>
                    {question.title} ({question.difficulty})
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="timeLimit" className="block text-sm font-medium text-gray-700 mb-1">
              Time Limit (minutes)
            </label>
            <input
              type="number"
              id="timeLimit"
              value={timeLimit}
              onChange={(e) => setTimeLimit(e.target.value)}
              min="5"
              max="120"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              Participants will have this much time to solve the problem once the duel starts.
            </p>
          </div>

          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">
                Make this duel public (anyone can join)
              </span>
            </label>
            <p className="text-sm text-gray-500 mt-1 ml-6">
              If unchecked, only people with the invite link can join.
            </p>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => router.push('/duels')}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 mr-2 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || questionsLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Duel'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}