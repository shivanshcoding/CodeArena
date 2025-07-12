'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from '../../lib/api';

export default function ProblemsPage() {
  const [problems, setProblems] = useState([]);

  useEffect(() => {
    axios.get('/questions')
      .then(res => setProblems(res.data))
      .catch(err => console.error('❌ Error fetching problems:', err));
  }, []);

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">📘 DSA Problem List</h2>

      <div className="bg-white shadow rounded overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-4 text-black py-2">Title</th>
              <th className="px-4 text-black py-2">Difficulty</th>
              <th className="px-4 text-black py-2">Category</th>
            </tr>
          </thead>
          <tbody>
            {problems.map(problem => (
              <tr key={problem._id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">
                  <Link href={`/problems/${problem._id}`} className="text-blue-600 hover:underline">
                    {problem.title}
                  </Link>
                </td>
                <td className={`px-4 py-2 font-semibold ${getColor(problem.difficulty)}`}>
                  {problem.difficulty}
                </td>
                <td className="px-4 py-2 text-gray-600">{problem.category || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function getColor(difficulty) {
  switch (difficulty) {
    case 'Easy':
      return 'text-green-600';
    case 'Medium':
      return 'text-yellow-600';
    case 'Hard':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
}
