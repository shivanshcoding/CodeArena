'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from '@/lib/api';
import Markdown from 'react-markdown';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function ProblemTabPage() {
  const { slug, number, tab } = useParams();
  const [question, setQuestion] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editorialInput, setEditorialInput] = useState('');
  const [solutionInput, setSolutionInput] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    if (slug && number) {
      axios.get(`/questions/${slug}/${number}`)
        .then(res => {
          setQuestion(res.data);
          setLoading(false);
        })
        .catch(() => {
          setError('Problem not found');
          setLoading(false);
        });
    }
  }, [slug, number]);

  useEffect(() => {
    if (tab === 'submissions' && question?._id) {
      axios.get(`/submissions/${question._id}`)
        .then(res => setSubmissions(res.data))
        .catch(err => {
          console.error('Failed to fetch submissions:', err.message);
        });
    }
  }, [tab, question?._id]);

  const submitEditorial = async () => {
    if (!editorialInput.trim()) return;
    await axios.post(`/questions/${question._id}/editorial`, {
      content: editorialInput,
    });
    setQuestion({ ...question, editorial: editorialInput });
    setEditorialInput('');
  };

  const submitSolution = async () => {
    if (!solutionInput.trim()) return;
    await axios.post(`/questions/${question._id}/solutions`, {
      content: solutionInput,
      author: user?.username || 'Anonymous',
    });
    setQuestion({
      ...question,
      solutions: [...(question.solutions || []), { content: solutionInput, author: user?.username }],
    });
    setSolutionInput('');
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!question) return null;

  const renderTabContent = () => {
    if (tab === 'solutions') {
      return (
        <div>
          {question.solutions?.length > 0 ? (
            question.solutions.map((sol, idx) => (
              <div key={idx} className="mb-6 border-b pb-4">
                <p className="text-sm text-gray-500">By: {sol.author}</p>
                <Markdown>{sol.content}</Markdown>
              </div>
            ))
          ) : (
            <p className="text-gray-400 italic">No solutions yet.</p>
          )}

          {user && (
            <div className="mt-6">
              <h4 className="font-bold mb-2">Submit a solution</h4>
              <textarea
                rows={6}
                className="w-full p-2 rounded bg-gray-800 text-white"
                placeholder="Write your solution in Markdown..."
                value={solutionInput}
                onChange={(e) => setSolutionInput(e.target.value)}
              />
              <button
                onClick={submitSolution}
                className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Submit Solution
              </button>
            </div>
          )}
        </div>
      );
    }

    if (tab === 'editorial') {
      return (
        <div>
          {question.editorial ? (
            <Markdown>{question.editorial}</Markdown>
          ) : (
            <p className="text-gray-400 italic mb-4">No editorial yet.</p>
          )}

          {!question.editorial && user && (
            <div className="mt-4">
              <h4 className="font-bold mb-2">Submit Editorial</h4>
              <textarea
                rows={8}
                className="w-full p-2 rounded bg-gray-800 text-white"
                placeholder="Write the editorial in Markdown..."
                value={editorialInput}
                onChange={(e) => setEditorialInput(e.target.value)}
              />
              <button
                onClick={submitEditorial}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Submit Editorial
              </button>
            </div>
          )}
        </div>
      );
    }

    if (tab === 'submissions') {
      return (
        <div>
          {submissions.length > 0 ? (
            submissions.map((sub, idx) => (
              <div key={idx} className="mb-4 border p-4 rounded bg-gray-800 text-white">
                <p className="text-sm text-gray-300">
                  Submitted on {new Date(sub.createdAt).toLocaleString()}
                </p>
                <p className="text-sm">Language: <strong>{sub.language}</strong></p>
                <p className="text-sm">
                  Verdict: <span className="font-bold text-green-400">{sub.verdict}</span>
                </p>
                <pre className="bg-black text-white p-2 mt-2 rounded">{sub.code}</pre>
                {sub.output && (
                  <div className="mt-2 text-sm">
                    <strong>Output:</strong>
                    <pre className="bg-gray-900 p-2 rounded">{sub.output}</pre>
                  </div>
                )}
                {sub.error && (
                  <div className="mt-2 text-sm text-red-400">
                    <strong>Error:</strong>
                    <pre className="bg-gray-900 p-2 rounded">{sub.error}</pre>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-400 italic">No submissions found.</p>
          )}
        </div>
      );
    }

    return <Markdown>{question.description}</Markdown>;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">{question.title}</h1>

      <div className="flex gap-4 mb-4">
        {['description', 'editorial', 'solutions', 'submissions'].map(t => (
          <Link
            key={t}
            href={`/problems/${slug}/${number}/${t}`}
            className={`px-3 py-1 rounded ${t === tab ? 'bg-blue-600 text-white' : 'bg-gray-200 text-black'}`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </Link>
        ))}
      </div>

      <div className="prose max-w-none prose-invert">
        {renderTabContent()}
      </div>
    </div>
  );
}
