'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getDuelByInviteCode, joinDuel } from '@/lib/duels';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function JoinDuelPage() {
  return (
    <ProtectedRoute>
      <JoinDuelContent />
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
      <div className="p-6 flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Join Duel</h1>
          
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
              <p>{error}</p>
            </div>
          )}
          
          {success ? (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4">
              <p>You have successfully joined this duel! Redirecting to duel page...</p>
            </div>
          ) : duel ? (
            <div>
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Duel Information</h2>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="mb-2"><span className="font-medium">Title:</span> {duel.title}</p>
                  <p className="mb-2">
                    <span className="font-medium">Problem:</span>{' '}
                    <Link href={`/problems/${duel.questionId.slug}/${duel.questionId.number}`} className="text-blue-600 hover:underline">
                      {duel.questionId.title}
                    </Link>
                  </p>
                  <p className="mb-2">
                    <span className="font-medium">Difficulty:</span>{' '}
                    <span className={duel.questionId.difficulty === 'Easy' ? 'text-green-600' : duel.questionId.difficulty === 'Medium' ? 'text-yellow-600' : 'text-red-600'}>
                      {duel.questionId.difficulty}
                    </span>
                  </p>
                  <p className="mb-2"><span className="font-medium">Time Limit:</span> {duel.timeLimit} minutes</p>
                  <p><span className="font-medium">Created By:</span> {duel.createdBy.username}</p>
                </div>
              </div>
              
              <div className="flex justify-between">
                <Link 
                  href="/duels" 
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </Link>
                <button
                  onClick={handleJoin}
                  disabled={joining || error}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {joining ? 'Joining...' : 'Join Duel'}
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">Invalid or expired invite code.</p>
              <Link 
                href="/duels" 
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Back to Duels
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}