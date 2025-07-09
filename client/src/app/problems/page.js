'use client';
import { useEffect, useState } from 'react';
import axios from '../../lib/api';

export default function ProblemsPage() {
  const [problems, setProblems] = useState([]);

  useEffect(() => {
    axios.get('/questions')
      .then(res => setProblems(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">📘 DSA Problems</h2>
      <ul className="space-y-2">
        {problems.map(problem => (
          <li key={problem._id} className="border-b py-2">
            <a href={`/problems/${problem._id}`}>{problem.title} - {problem.difficulty}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
