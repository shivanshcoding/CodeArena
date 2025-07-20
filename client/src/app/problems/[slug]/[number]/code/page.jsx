'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import Editor from '@monaco-editor/react'; // ✅ updated editor

export default function CodeEditorPage() {
  const { slug, number } = useParams();
  const { user } = useAuth();
  const [question, setQuestion] = useState(null);
  const [code, setCode] = useState('// Write your code here...');
  const [language, setLanguage] = useState('cpp');
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get(`/questions/${slug}/${number}`)
      .then(res => setQuestion(res.data))
      .catch(() => alert('Problem not found'));
  }, [slug, number]);

  const handleRun = async () => {
    if (!user) return alert('Please login to submit');
    setLoading(true);
    setOutput(null);

    try {
      const res = await axios.post('/submissions/submit', {
        userId: user._id,
        questionId: question._id,
        code,
        language
      });

      setOutput(res.data.submission);
    } catch (err) {
      alert(err?.response?.data?.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">🧠 {question?.title}</h2>

      <div className="flex gap-4 mb-6">
        {['description', 'editorial', 'solutions', 'submissions', 'code'].map((t) => (
          <Link
            key={t}
            href={`/problems/${slug}/${number}/${t}`}
            className={`px-3 py-1 rounded ${t === 'code' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-black'}`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </Link>
        ))}
      </div>

      <div className="mb-4">
        <label className="mr-2 font-medium">Language:</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="border px-3 py-1 rounded"
        >
          <option value="cpp">C++</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="js">JavaScript</option>
        </select>
      </div>

      <Editor
        height="400px"
        defaultLanguage={language === 'cpp' ? 'cpp' : language}
        value={code}
        onChange={(val) => setCode(val)}
        theme="vs-dark"
      />

      <button
        onClick={handleRun}
        disabled={loading}
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {loading ? 'Running...' : 'Run Code'}
      </button>

      {output && (
        <div className="mt-6 p-4 bg-gray-900 text-white rounded">
          <h4 className="font-bold mb-2">Output:</h4>
          <pre>{output.output || output.error || 'No Output'}</pre>
          <p className="mt-2 text-sm text-gray-300">Verdict: {output.verdict}</p>
        </div>
      )}
    </div>
  );
}
