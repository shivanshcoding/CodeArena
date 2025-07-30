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
        <div className="min-h-screen bg-background p-4 max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-primary">📘 DSA Problem List</h2>

            <div className="card shadow rounded overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-100 text-left">
                        <tr>
                            <th className="px-4 text-primary py-2">#</th>
                            <th className="px-4 text-primary py-2">Title</th>
                            <th className="px-4 text-primary py-2">Difficulty</th>
                            <th className="px-4 text-primary py-2">Tags</th>
                        </tr>
                    </thead>
                    <tbody>
                        {problems
                            .sort((a, b) => a.number - b.number) // optional: sort by number
                            .map(problem => (
                                <tr key={problem._id} className="border-t hover:bg-gray-50">
                                    <td className="px-4 py-2 text-primary font-semibold">{problem.number}</td>
                                    <td className="px-4 py-2">
                                        <Link
                                            href={`/problems/${problem.slug}/${problem.number}/description`}
                                            className="text-primary hover:underline"
                                        >
                                            {problem.title}
                                        </Link>
                                    </td>
                                    <td className={`px-4 py-2 font-semibold ${getColor(problem.difficulty)}`}>
                                        {problem.difficulty}
                                    </td>
                                    <td className="px-4 py-2 text-muted">
                                        {problem.tags?.join(', ') || '—'}
                                    </td>
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
