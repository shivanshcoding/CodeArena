'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { joinDuelByInviteCode, joinDuel } from '@/lib/duels';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function JoinDuelPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{ backgroundImage: 'linear-gradient(to right top, #051937, #004d7a, #008793, #00bf72, #a8eb12)' }}>
        <JoinDuelContent />
      </div>
    </ProtectedRoute>
  );
}

function JoinDuelContent() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [duel, setDuel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchDuel();
  }, []);

  const fetchDuel = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getDuelByInviteCode(params.code);
      setDuel(data);
      
      // Check if user is already a participant
      const isParticipant = data.participants.some(p => p.userId === user.id);
      if (isParticipant) {
        setSuccess(true);
      }
      
      // Check if duel is already full
      if (data.participants.length >= 2 && !isParticipant) {
        setError('This duel already has the maximum number of participants.');
      }
      
      // Check if duel is not pending
      if (data.status !== 'pending' && !isParticipant) {
        setError('This duel has already started or has been completed.');
      }
    } catch (err) {
      console.error('Error fetching duel:', err);
      setError(err.response?.data?.message || 'Invalid or expired invite code.');
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    try {
      setJoining(true);
      setError(null);
      await joinDuel(duel._id);
      setSuccess(true);
      setTimeout(() => {
        router.push(`/duels/${duel._id}`);
      }, 1500);
    } catch (err) {
      console.error('Error joining duel:', err);
      setError(err.response?.data?.message || 'Failed to join duel. Please try again.');
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-80px)]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto w-full bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl border border-gray-700">
      <div className="p-6">
        <h1 className="text-3xl font-extrabold text-white drop-shadow-lg mb-4 text-center">Join Duel</h1>
          
          {error && (
            <div className="bg-red-800 bg-opacity-50 border-l-4 border-red-500 text-red-200 p-4 mb-4 rounded-md">
              <p>{error}</p>
            </div>
          )}
          
          {success ? (
            <div className="bg-green-800 bg-opacity-50 border-l-4 border-green-500 text-green-200 p-4 mb-4 rounded-md">
              <p>You have successfully joined this duel! Redirecting to duel page...</p>
            </div>
          ) : duel ? (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-white mb-2">Duel Information</h2>
                <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg border border-gray-700">
                  <p className="mb-2 text-gray-200"><span className="font-medium text-gray-100">Title:</span> {duel.title}</p>
                  <p className="mb-2 text-gray-200">
                    <span className="font-medium text-gray-100">Problem:</span>{' '}
                    <Link href={`/problems/${duel.questionId.slug}/${duel.questionId.number}`} className="text-blue-400 hover:underline">
                      {duel.questionId.title}
                    </Link>
                  </p>
                  <p className="mb-2 text-gray-200">
                    <span className="font-medium text-gray-100">Difficulty:</span>{' '}
                    <span className={duel.questionId.difficulty === 'Easy' ? 'text-green-400' : duel.questionId.difficulty === 'Medium' ? 'text-yellow-400' : 'text-red-400'}>
                      {duel.questionId.difficulty}
                    </span>
                  </p>
                  <p className="mb-2 text-gray-200"><span className="font-medium text-gray-100">Time Limit:</span> {duel.timeLimit} minutes</p>
                  <p className="text-gray-200"><span className="font-medium text-gray-100">Created By:</span> {duel.createdBy.username}</p>
                </div>
              </div>
              
              <div className="flex justify-between">
                <Link 
                  href="/duels" 
                  className="px-4 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </Link>
                <button
                  onClick={handleJoin}
                  disabled={joining || error}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {joining ? 'Joining...' : 'Join Duel'}
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-200">
              <p className="mb-4">Invalid or expired invite code.</p>
              <Link 
                href="/duels" 
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Back to Duels
              </Link>
            </div>
          )}
        </div>
  </div>
  ); 
}