'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import axios from '@/lib/api';
import Markdown from 'react-markdown';
import { useAuth } from '@/context/AuthContext';

const MonacoEditor = dynamic(() => import('react-monaco-editor'), { ssr: false });

export default function ProblemPage() {
  const { slug, number } = useParams();
  const { user } = useAuth();

  const [question, setQuestion] = useState(null);
  const [activeTab, setActiveTab] = useState('description');
  const [code, setCode] = useState('// Write your code here...');
  const [language, setLanguage] = useState('cpp');
  const [output, setOutput] = useState(null);
  const [verdictTabVisible, setVerdictTabVisible] = useState(false);
  const [testCaseResults, setTestCaseResults] = useState([]);
  const [solutionInput, setSolutionInput] = useState('');
  const [editorialInput, setEditorialInput] = useState('');

  useEffect(() => {
    axios.get(`/questions/${slug}/${number}`)
      .then(res => setQuestion(res.data))
      .catch(() => alert('Problem not found'));
  }, [slug, number]);

  const handleRun = async () => {
    if (!user || !question) return alert('Login required');
    setOutput(null);
    setVerdictTabVisible(false);
    setTestCaseResults([]);

    try {
      const res = await axios.post('/submissions/submit', {
        userId: user._id,
        questionId: question._id,
        code,
        language,
      });
      setOutput(res.data.submission);
      setActiveTab('test-results');
    } catch (err) {
      alert('Error during execution');
    }
  };

  const handleSubmitSolution = async () => {
    if (!solutionInput.trim()) return;
    await axios.post(`/questions/${question._id}/solutions`, {
      content: solutionInput,
      author: user?.username || 'Anonymous',
    });
    setSolutionInput('');
    setQuestion(prev => ({
      ...prev,
      solutions: [...(prev.solutions || []), {
        content: solutionInput,
        author: user?.username,
        createdAt: new Date(),
      }]
    }));
  };

  const handleSubmitEditorial = async () => {
    if (!editorialInput.trim()) return;
    await axios.post(`/questions/${question._id}/editorial`, {
      content: editorialInput,
    });
    setEditorialInput('');
    setQuestion(prev => ({ ...prev, editorial: editorialInput }));
  };

  const tabs = [
    { key: 'description', label: 'Description' },
    { key: 'editorial', label: 'Editorial' },
    { key: 'solutions', label: 'Solutions' },
    { key: 'code', label: 'Code Editor' },
    { key: 'test-results', label: 'Test Results' },
    { key: 'verdict', label: output?.verdict || 'Verdict' },
  ];

  const renderTabContent = () => {
    if (!question) return null;

    switch (activeTab) {
      case 'description':
        return <Markdown>{question.description}</Markdown>;

      case 'editorial':
        return (
          <div>
            {question.editorial
              ? <Markdown>{question.editorial}</Markdown>
              : <p className="text-gray-400 italic">No editorial yet.</p>}
            {!question.editorial && user && (
              <div className="mt-4">
                <textarea
                  rows={8}
                  className="w-full p-2 rounded bg-gray-800 text-white"
                  placeholder="Write the editorial in Markdown..."
                  value={editorialInput}
                  onChange={(e) => setEditorialInput(e.target.value)}
                />
                <button
                  onClick={handleSubmitEditorial}
                  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Submit Editorial
                </button>
              </div>
            )}
          </div>
        );

      case 'solutions':
        return (
          <div>
            {question.solutions?.length > 0 ? (
              question.solutions.map((sol, idx) => (
                <div key={idx} className="mb-6 border-b pb-4">
                  <p className="text-sm text-gray-500">By: {sol.author} • {new Date(sol.createdAt).toLocaleString()}</p>
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
                  onClick={handleSubmitSolution}
                  className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Submit Solution
                </button>
              </div>
            )}
          </div>
        );

      case 'code':
        return (
          <div>
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
            <MonacoEditor
              height="400"
              language={language === 'cpp' ? 'cpp' : language}
              value={code}
              onChange={setCode}
              theme="vs-dark"
              options={{ fontSize: 14 }}
            />
            <button
              onClick={handleRun}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Run Code
            </button>
          </div>
        );

      case 'test-results':
        return output ? (
          <div className="mt-4">
            <h4 className="font-bold mb-2">Output:</h4>
            <pre className="bg-gray-900 p-2 rounded text-white">{output.output || output.error || 'No output'}</pre>
            <p className="mt-2 text-sm text-gray-300">Verdict: {output.verdict}</p>
          </div>
        ) : (
          <p className="text-gray-500 italic">No output yet.</p>
        );

      case 'verdict':
        return (
          <div className="mt-4 text-white bg-gray-800 p-4 rounded">
            <h4 className="text-lg font-bold mb-2">Verdict</h4>
            <p>Status: <span className="font-semibold">{output?.verdict}</span></p>
            <p className="mt-2">Output:</p>
            <pre className="bg-black p-2 rounded">{output?.output || output?.error}</pre>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">{question?.title}</h2>

      <div className="flex gap-2 mb-6 flex-wrap">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            className={`px-4 py-1 rounded ${
              activeTab === key ? 'bg-blue-600 text-white' : 'bg-gray-200 text-black'
            }`}
            onClick={() => setActiveTab(key)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="prose max-w-none prose-invert">
        {renderTabContent()}
      </div>
    </div>
  );
}
