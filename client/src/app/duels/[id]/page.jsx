'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getDuelById, submitDuelSolution } from '@/lib/duels';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import CodeEditor from '@/components/CodeEditor';

export default function DuelDetailPage() {
  return (
    <ProtectedRoute>
      <DuelDetailContent />
    </ProtectedRoute>
  );
}

function DuelDetailContent() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [duel, setDuel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('cpp');
  const [output, setOutput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [inviteUrl, setInviteUrl] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);

  useEffect(() => {
    fetchDuel();
  }, []);

  useEffect(() => {
    if (duel && duel.status === 'active') {
      // Calculate time left based on duel start time and time limit
      const startTime = new Date(duel.startTime).getTime();
      const endTime = startTime + (duel.timeLimit * 60 * 1000);
      const now = new Date().getTime();
      const initialTimeLeft = Math.max(0, endTime - now);
      
      setTimeLeft(initialTimeLeft);
      
      // Set up timer to count down
      const timer = setInterval(() => {
        setTimeLeft(prevTime => {
          const newTime = prevTime - 1000;
          if (newTime <= 0) {
            clearInterval(timer);
            // Refresh duel data when time is up
            fetchDuel();
            return 0;
          }
          return newTime;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [duel]);

  useEffect(() => {
    if (duel && !duel.isPublic) {
      // Generate invite URL
      const baseUrl = window.location.origin;
      setInviteUrl(`${baseUrl}/duels/join/${duel.inviteCode}`);
    }
  }, [duel]);

  const fetchDuel = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getDuelById(params.id);
      setDuel(data);
      
      // Set initial code if user has already submitted
      const userParticipant = data.participants.find(p => p.userId === user.id);
      if (userParticipant && userParticipant.code) {
        setCode(userParticipant.code);
        setLanguage(userParticipant.language || 'cpp');
      }
    } catch (err) {
      console.error('Error fetching duel:', err);
      setError('Failed to load duel. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!code.trim()) {
      setError('Please write some code before submitting');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      setOutput('');
      
      const response = await submitDuelSolution(duel._id, { code, language });
      
      if (response.result) {
        setOutput(response.result);
      }
      
      // Refresh duel data
      fetchDuel();
    } catch (err) {
      console.error('Error submitting solution:', err);
      setError(err.response?.data?.message || 'Failed to submit solution. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const formatTime = (ms) => {
    if (!ms) return '00:00';
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const renderDuelStatus = (status) => {
    switch (status) {
      case 'pending':
        return <span className="px-3 py-1 bg-yellow-600 text-white rounded-full text-sm">Waiting for opponent</span>;
      case 'active':
        return <span className="px-3 py-1 bg-green-600 text-white rounded-full text-sm">Active</span>;
      case 'completed':
        return <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm">Completed</span>;
      case 'cancelled':
        return <span className="px-3 py-1 bg-gray-600 text-white rounded-full text-sm">Cancelled</span>;
      default:
        return <span className="px-3 py-1 bg-gray-600 text-white rounded-full text-sm">{status}</span>;
    }
  };

  const renderParticipantStatus = (participant) => {
    if (!participant.hasSubmitted) {
      return <span className="text-yellow-400">Working on solution</span>;
    }
    
    if (participant.result && participant.result.status === 'Accepted') {
      return <span className="text-green-400">Solved ✓</span>;
    }
    
    return <span className="text-red-400">Attempted</span>;
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-[60vh] bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto bg-background text-foreground">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          <p>{error}</p>
        </div>
        <Link href="/duels" className="text-accent hover:underline flex items-center">
          Back to Duels
        </Link>
      </div>
    );
  }

  if (!duel) {
    return (
      <div className="p-6 max-w-4xl mx-auto bg-background text-foreground">
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
          <p>Duel not found</p>
        </div>
        <Link href="/duels" className="text-accent hover:underline">
          Back to Duels
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto bg-background text-foreground">
      <div className="mb-6">
        <Link href="/duels" className="flex items-center text-muted-foreground mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Duels
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
        <div className="card p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-primary mb-4">{duel.title}</h1>
              <div className="mt-2">{renderDuelStatus(duel.status)}</div>
            </div>
            
            {duel.status === 'active' && (
              <div className="bg-blue-50 px-4 py-2 rounded-lg">
                <div className="text-sm text-gray-600">Time Remaining</div>
                <div className="text-xl font-mono font-bold text-blue-700">{formatTime(timeLeft)}</div>
              </div>
            )}
            
            {duel.status === 'pending' && !duel.isPublic && duel.createdBy === user.id && (
              <button 
                onClick={() => setShowInviteModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Invite Opponent
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <h2 className="text-lg font-semibold mb-3">Problem</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <Link 
                  href={`/problems/${duel.questionId.slug}/${duel.questionId.number}`}
                  className="text-blue-600 hover:underline font-medium"
                  target="_blank"
                >
                  {duel.questionId.title}
                </Link>
                <div className="mt-2 text-sm">
                  <span className="mr-3">
                    <span className="text-gray-600">Difficulty:</span> 
                    <span className={`ml-1 ${duel.questionId.difficulty === 'Easy' ? 'text-green-600' : duel.questionId.difficulty === 'Medium' ? 'text-yellow-600' : 'text-red-600'}`}>
                      {duel.questionId.difficulty}
                    </span>
                  </span>
                  <span>
                    <span className="text-gray-600">Time Limit:</span> 
                    <span className="ml-1">{duel.timeLimit} minutes</span>
                  </span>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-lg font-semibold mb-3">Participants</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="space-y-3">
                  {duel.participants.map((participant) => (
                    <div key={participant.userId} className="flex justify-between items-center">
                      <div className="font-medium">
                        {participant.username}
                        {participant.userId === duel.createdBy && (
                          <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">Creator</span>
                        )}
                      </div>
                      <div>
                        {renderParticipantStatus(participant)}
                      </div>
                    </div>
                  ))}
                  
                  {duel.status === 'pending' && duel.participants.length === 1 && (
                    <div className="text-gray-500 italic">Waiting for an opponent to join...</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {duel.status === 'completed' && (
        <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6 p-6">
          <h2 className="text-xl font-bold mb-4">Results</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Participant</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Runtime</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Memory</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Language</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {duel.participants
                  .filter(p => p.hasSubmitted)
                  .map((participant) => (
                    <tr key={participant.userId} className="hover:bg-gray-50">
                      <td className="py-4 px-4 whitespace-nowrap font-medium">{participant.username}</td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs ${participant.result?.status === 'Accepted' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {participant.result?.status || 'Error'}
                        </span>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">{participant.result?.runtime || '-'}</td>
                      <td className="py-4 px-4 whitespace-nowrap">{participant.result?.memory || '-'}</td>
                      <td className="py-4 px-4 whitespace-nowrap">{participant.language || 'cpp'}</td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        {participant.submittedAt ? new Date(participant.submittedAt).toLocaleString() : '-'}
                      </td>
                    </tr>
                  ))}
                
                {duel.participants.filter(p => p.hasSubmitted).length === 0 && (
                  <tr>
                    <td colSpan="6" className="py-4 px-4 text-center text-gray-500">
                      No submissions were made during this duel.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {duel.status === 'active' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="border-b border-gray-200 px-4 py-3 flex justify-between items-center">
              <h2 className="font-semibold">Code Editor</h2>
              <div>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Solution'}
                </button>
              </div>
            </div>
            <div className="h-[500px]">
              <CodeEditor 
                code={code} 
                setCode={setCode} 
                language={language}
                setLanguage={setLanguage}
              />
            </div>
          </div>
          
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="border-b border-gray-200 px-4 py-3">
              <h2 className="font-semibold">Output</h2>
            </div>
            <div className="p-4 h-[500px] overflow-auto font-mono text-sm bg-gray-50">
              {output ? (
                <pre>{output}</pre>
              ) : (
                <div className="text-gray-500 italic">Submit your solution to see the output here</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Invite an Opponent</h3>
            <p className="mb-4">Share this link with someone to invite them to this duel:</p>
            
            <div className="flex mb-4">
              <input
                type="text"
                value={inviteUrl}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none"
              />
              <button
                onClick={copyInviteLink}
                className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition-colors"
              >
                {copySuccess ? 'Copied!' : 'Copy'}
              </button>
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={() => setShowInviteModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}