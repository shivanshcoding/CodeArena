'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Editor from '@monaco-editor/react';
import axios from '../../../lib/api';
import { runCode } from '../../../lib/judge';

export default function ProblemPage() {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState('// Write your solution here');
  const [output, setOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (id) {
      axios
        .get(`/questions/${id}`)
        .then((res) => setProblem(res.data))
        .catch((err) => {
          console.error('❌ Error loading problem:', err);
          alert('Failed to load problem.');
        });
    }
  }, [id]);

  const handleRunCode = async () => {
    try {
      setIsRunning(true);
      const res = await runCode(code, 54, ''); // 54 = C++

      const stdout = res.stdout ? window.atob(res.stdout) : '';
      const stderr = res.stderr ? window.atob(res.stderr) : '';

      setOutput({ stdout, stderr });
    } catch (err) {
      console.error('❌ Judge0 run error:', err.response?.data || err.message);
      alert(
        'Error running code:\n' +
          (err?.response?.data?.message || err.message || 'Unknown error')
      );
    } finally {
      setIsRunning(false);
    }
  };

  if (!problem) return <div className="p-4">Loading problem...</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{problem.title}</h1>
      <p className="text-gray-700 mt-2">{problem.description}</p>
      <p className="mt-2">
        <strong>Difficulty:</strong> {problem.difficulty}
      </p>

      {/* Monaco Editor */}
      <div className="mt-6 border rounded-md overflow-hidden">
        <Editor
          height="400px"
          defaultLanguage="cpp"
          defaultValue={code}
          onChange={(val) => setCode(val)}
          theme="vs-dark"
        />
      </div>

      {/* Output Section */}
      {output && (
        <div className="mt-4 p-3 bg-black text-white border rounded">
          <h3 className="font-semibold mb-1">Output:</h3>
          <pre>{output.stdout || output.stderr || 'No output'}</pre>
        </div>
      )}

      {/* Run Button */}
      <button
        onClick={handleRunCode}
        disabled={isRunning}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {isRunning ? 'Running...' : 'Run Code'}
      </button>
    </div>
  );
}
