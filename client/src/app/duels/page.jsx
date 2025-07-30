'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getPublicDuels, getUserDuels, joinDuel, cancelDuel } from '@/lib/duels';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function DuelsPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
        <DuelsContent />
      </div>
    </ProtectedRoute>
  );
}

function DuelsContent() {
  const [publicDuels, setPublicDuels] = useState([]);
  const [userDuels, setUserDuels] = useState([]);
  const [activeTab, setActiveTab] = useState('public');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [joinLoading, setJoinLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetchDuels();
  }, []);

  const fetchDuels = async () => {
    try {
      setLoading(true);
      setError(null);
      const [publicData, userData] = await Promise.all([
        getPublicDuels(),
        getUserDuels()
      ]);
      setPublicDuels(publicData);
      setUserDuels(userData);
    } catch (err) {
      console.error('Error fetching duels:', err);
      setError('Failed to load duels. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinDuel = async (id) => {
    try {
      setJoinLoading(true);
      await joinDuel(id);
      router.push(`/duels/${id}`);
    } catch (err) {
      console.error('Error joining duel:', err);
      setError(err.response?.data?.message || 'Failed to join duel. Please try again.');
    } finally {
      setJoinLoading(false);
    }
  };

  const handleCancelDuel = async (id) => {
    try {
      setCancelLoading(true);
      await cancelDuel(id);
      // Refresh duels list
      fetchDuels();
    } catch (err) {
      console.error('Error cancelling duel:', err);
      setError(err.response?.data?.message || 'Failed to cancel duel. Please try again.');
    } finally {
      setCancelLoading(false);
    }
  };

  const renderDuelStatus = (status) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Pending</span>;
      case 'active':
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Active</span>;
      case 'completed':
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Completed</span>;
      case 'cancelled':
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">Cancelled</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">{status}</span>;
    }
  };

  const renderDifficulty = (difficulty) => {
    const colors = {
      Easy: 'text-green-600',
      Medium: 'text-yellow-600',
      Hard: 'text-red-600'
    };
    return <span className={colors[difficulty] || 'text-gray-600'}>{difficulty}</span>;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-80px)]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="card p-6 max-w-6xl mx-auto w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-primary drop-shadow-lg">DSA Duels</h1>
        <Link 
          href="/duels/create" 
          className="btn btn-primary"
        >
          Create Duel
        </Link>
      </div>

      {error && (
        <div className="bg-error border-l-4 border-error text-error p-4 mb-4">
          <p>{error}</p>
        </div>
      )}

      <div className="mb-6">
        <div className="flex border-b">
          <button
            className={`px-4 py-2 font-medium text-lg rounded-t-lg ${activeTab === 'public' ? 'bg-primary text-white' : 'text-muted hover:text-primary hover:bg-card-bg-light'}`}
            onClick={() => setActiveTab('public')}
          >
            Public Duels
          </button>
          <button
            className={`px-4 py-2 font-medium text-lg rounded-t-lg ${activeTab === 'my' ? 'bg-primary text-white' : 'text-muted hover:text-primary hover:bg-card-bg-light'}`}
            onClick={() => setActiveTab('my')}
          >
            My Duels
          </button>
        </div>
      </div>

      {activeTab === 'public' && (
        <div>
          {publicDuels.length === 0 ? (
            <div className="text-center py-10 bg-card-bg rounded-lg">
              <p className="text-muted">No public duels available. Create one to get started!</p>
            </div>
          ) : (
            <div className="overflow-x-auto card">
              <table className="min-w-full text-foreground">
                <thead className="bg-background-light">
                  <tr>
                    <th className="py-3 px-4 text-left text-xs font-medium text-muted uppercase tracking-wider">Title</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-muted uppercase tracking-wider">Problem</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-muted uppercase tracking-wider">Difficulty</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-muted uppercase tracking-wider">Created By</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-muted uppercase tracking-wider">Status</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-muted uppercase tracking-wider">Time Limit</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-muted uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-card-border">
                  {publicDuels.map((duel) => (
                    <tr key={duel._id} className="hover:bg-background-light transition-colors duration-200">
                      <td className="py-4 px-4 whitespace-nowrap text-foreground">{duel.title}</td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <Link href={`/problems/${duel.questionId.slug}/${duel.questionId.number}`} className="text-accent hover:underline">
                          {duel.questionId.title}
                        </Link>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        {renderDifficulty(duel.questionId.difficulty)}
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap text-foreground">{duel.createdBy.username}</td>
                      <td className="py-4 px-4 whitespace-nowrap">{renderDuelStatus(duel.status)}</td>
                      <td className="py-4 px-4 whitespace-nowrap text-foreground">{duel.timeLimit} min</td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        {duel.status === 'pending' && duel.createdBy._id !== user.id && (
                          <button
                            onClick={() => handleJoinDuel(duel._id)}
                            disabled={joinLoading}
                            className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {joinLoading ? 'Joining...' : 'Join'}
                          </button>
                        )}
                        {duel.status === 'active' && (
                          <Link 
                            href={`/duels/${duel._id}`}
                            className="btn btn-success"
                          >
                            View
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'my' && (
        <div>
          {userDuels.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 rounded-lg">
              <p className="text-gray-500">You haven't participated in any duels yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Problem</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Opponent</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {userDuels.map((duel) => (
                    <tr key={duel._id} className="hover:bg-gray-50">
                      <td className="py-4 px-4 whitespace-nowrap">{duel.title}</td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <Link href={`/problems/${duel.questionId.slug}/${duel.questionId.number}`} className="text-blue-600 hover:underline">
                          {duel.questionId.title}
                        </Link>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        {duel.opponent ? duel.opponent.username : 'Waiting for opponent'}
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">{renderDuelStatus(duel.status)}</td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        {new Date(duel.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        {duel.status === 'pending' && duel.createdBy._id === user.id && (
                          <button
                            onClick={() => handleCancelDuel(duel._id)}
                            disabled={cancelLoading}
                            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50"
                          >
                            {cancelLoading ? 'Cancelling...' : 'Cancel'}
                          </button>
                        )}
                        {(duel.status === 'active' || duel.status === 'completed') && (
                          <Link 
                            href={`/duels/${duel._id}`}
                            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                          >
                            View
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}