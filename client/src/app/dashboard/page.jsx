'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { getUserDuels } from '@/lib/duels';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [recentDuels, setRecentDuels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch user stats
        const statsResponse = await fetch('/api/profile/stats');
        if (!statsResponse.ok) throw new Error('Failed to fetch user stats');
        const statsData = await statsResponse.json();
        
        // Fetch recent submissions
        const submissionsResponse = await fetch('/api/profile/submissions/recent');
        if (!submissionsResponse.ok) throw new Error('Failed to fetch recent submissions');
        const submissionsData = await submissionsResponse.json();
        
        // Fetch recent duels
        const duelsData = await getUserDuels();
        
        setStats(statsData);
        setRecentSubmissions(submissionsData);
        setRecentDuels(duelsData.slice(0, 5)); // Show only the 5 most recent duels
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const renderDifficulty = (difficulty) => {
    const colors = {
      Easy: 'text-green-600',
      Medium: 'text-yellow-600',
      Hard: 'text-red-600'
    };
    return <span className={colors[difficulty] || 'text-gray-600'}>{difficulty}</span>;
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

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-6 sm:p-10">
      <div className="card max-w-7xl mx-auto p-6 sm:p-10 animate-fade-in">

      <h1 className="text-4xl font-extrabold text-center mb-10 text-primary drop-shadow-lg">Your Dashboard</h1>

      {error && (
        <div className="bg-error bg-opacity-30 border-l-4 border-error text-error p-4 mb-6 rounded-lg shadow-md">
          <p>{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        <div className="card p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
          <h2 className="text-xl font-semibold mb-3 text-foreground">Problems Solved</h2>
          <div className="text-4xl font-bold text-accent">{stats?.problemsSolved || 0}</div>
        </div>
        
        <div className="bg-gray-700 bg-opacity-50 backdrop-filter backdrop-blur-sm rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl border border-gray-600 border-opacity-70">
          <h2 className="text-xl font-semibold mb-3 text-foreground">Submissions</h2>
          <div className="text-4xl font-bold text-success">{stats?.totalSubmissions || 0}</div>
        </div>
        
        <div className="bg-gray-700 bg-opacity-50 backdrop-filter backdrop-blur-sm rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl border border-gray-600 border-opacity-70">
          <h2 className="text-xl font-semibold mb-3 text-foreground">Duels Won</h2>
          <div className="text-4xl font-bold text-primary">{stats?.duelsWon || 0}</div>
        </div>
        
        <div className="bg-gray-700 bg-opacity-50 backdrop-filter backdrop-blur-sm rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl border border-gray-600 border-opacity-70">
          <h2 className="text-xl font-semibold mb-3 text-foreground">Streak</h2>
          <div className="text-4xl font-bold text-warning">{stats?.streak || 0} days</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="card overflow-hidden">
          <div className="px-6 py-4 border-b border-card-border bg-background-light">
            <h2 className="text-2xl font-semibold text-primary">Recent Submissions</h2>
          </div>
          
          {recentSubmissions.length > 0 ? (
            <div className="divide-y divide-card-border">
              {recentSubmissions.map((submission) => (
                <div key={submission._id} className="p-4 hover:bg-background-light transition-colors duration-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <Link 
                        href={`/problems/${submission.questionId.slug}/${submission.questionId.number}`}
                        className="font-medium text-accent hover:underline text-lg"
                      >
                        {submission.questionId.title}
                      </Link>
                    <div className="text-sm text-muted mt-1">
                        {new Date(submission.createdAt).toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${submission.status === 'Accepted' ? 'bg-success text-white' : 'bg-error text-white'}`}>
                        {submission.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}  
            </div>
          ) : (
            <div className="p-6 text-center text-muted">
              <p className="mb-4">No recent submissions found. Time to solve some problems!</p>
              <Link href="/problems" className="btn btn-secondary mt-2">
                Solve Problems
              </Link>
            </div>
          )}
          
          <div className="px-6 py-3 bg-background-light border-t border-card-border">
            <Link href="/submissions" className="text-accent hover:underline text-sm">
              View all submissions
            </Link>
          </div>
        </div>
        
        <div className="card overflow-hidden">
          <div className="px-6 py-4 border-b border-card-border bg-background-light">
            <h2 className="text-2xl font-semibold text-primary">Recent Duels</h2>
          </div>
          
          {recentDuels.length > 0 ? (
            <div className="divide-y divide-card-border">
              {recentDuels.map((duel) => (
                <div key={duel._id} className="p-4 hover:bg-background-light transition-colors duration-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <Link 
                        href={`/duels/${duel._id}`}
                        className="font-medium text-accent hover:underline text-lg"
                      >
                        {duel.title}
                      </Link>
                      <div className="flex items-center mt-1 space-x-3">
                        <span className="text-sm text-muted">
                          {duel.questionId.title}
                        </span>
                        <span className="text-sm font-semibold">
                          {renderDifficulty(duel.questionId.difficulty)}
                        </span>
                      </div>
                    </div>
                    <div>
                      {renderDuelStatus(duel.status)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-gray-400">
              <p className="mb-4">No recent duels found. Why not start one?</p>
              <Link href="/duels/create" className="text-blue-400 hover:underline mt-2 inline-block px-4 py-2 border border-blue-400 rounded-lg transition-colors duration-200 hover:bg-blue-400 hover:text-white">
                Create a duel
              </Link>
            </div>
          )}
          
          <div className="px-6 py-3 bg-gray-700 bg-opacity-60 border-t border-gray-600">
            <Link href="/duels" className="text-blue-400 hover:underline text-sm">
              View all duels
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-gray-700 bg-opacity-50 backdrop-filter backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-gray-600 border-opacity-70">
        <div className="px-6 py-4 border-b border-gray-600 bg-gray-700 bg-opacity-60">
          <h2 className="text-2xl font-semibold text-gray-100">Progress by Difficulty</h2>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          
            <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 shadow-lg border border-gray-700 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <h3 className="font-semibold text-green-400 mb-3 text-xl">Easy</h3>
<div className="flex items-end mb-2">
                <div className="text-4xl font-bold text-green-400 mr-2">{stats?.easySolved || 0}</div>
                <div className="text-lg text-gray-400">/ {stats?.easyTotal || 0}</div>
              </div>
              <div className="mt-4 w-full bg-gray-600 rounded-full h-3">
                <div 
                  className="bg-green-500 h-3 rounded-full shadow-md" 
                  style={{ width: `${stats?.easyTotal ? (stats.easySolved / stats.easyTotal) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
            
            <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 shadow-lg border border-gray-700 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <h3 className="font-semibold text-yellow-400 mb-3 text-xl">Medium</h3>
<div className="flex items-end mb-2">
                <div className="text-4xl font-bold text-yellow-400 mr-2">{stats?.mediumSolved || 0}</div>
                <div className="text-lg text-gray-400">/ {stats?.mediumTotal || 0}</div>
              </div>
              <div className="mt-4 w-full bg-gray-600 rounded-full h-3">
                <div 
                  className="bg-yellow-500 h-3 rounded-full shadow-md" 
                  style={{ width: `${stats?.mediumTotal ? (stats.mediumSolved / stats.mediumTotal) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
            
            <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 shadow-lg border border-gray-700 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <h3 className="font-semibold text-red-400 mb-3 text-xl">Hard</h3>
<div className="flex items-end mb-2">
                <div className="text-4xl font-bold text-red-400 mr-2">{stats?.hardSolved || 0}</div>
                <div className="text-lg text-gray-400">/ {stats?.hardTotal || 0}</div>
              </div>
              <div className="mt-4 w-full bg-gray-600 rounded-full h-3">
                <div 
                  className="bg-red-500 h-3 rounded-full shadow-md" 
                  style={{ width: `${stats?.hardTotal ? (stats.hardSolved / stats.hardTotal) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}