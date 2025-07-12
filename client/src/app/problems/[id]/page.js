'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from '../../../lib/api';
import { runCode } from '../../../lib/judge';

import ProblemHeader from '@/app/components/ProblemHeader.jsx';
import CodeEditor from '@/app/components/CodeEditor.jsx';
import OutputBox from '@/app/components/OutputBox.jsx';
import SubmissionsList from '@/app/components/SubmissionsList.jsx';

export default function ProblemPage() {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState('// Write your solution here');
  const [output, setOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    if (id) {
      axios.get(`/questions/${id}`).then((res) => setProblem(res.data));
      axios.get(`/submissions/${id}`).then((res) => setSubmissions(res.data));
    }
  }, [id]);

  const handleRunCode = async () => {
    try {
      setIsRunning(true);
      const res = await runCode(code, 54);
      const stdout = res.stdout ? window.atob(res.stdout) : '';
      const stderr = res.stderr ? window.atob(res.stderr) : '';
      setOutput({ stdout, stderr });
    } catch (err) {
      alert('Error running code:\n' + (err?.response?.data?.message || err.message));
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmitCode = async () => {
    if (!output) return alert('⚠️ Run your code before submitting.');
    try {
      setIsSubmitting(true);
      await axios.post('/submissions', {
        problemId: id,
        code,
        language_id: 54,
        stdout: output.stdout,
        stderr: output.stderr,
      });
      const updated = await axios.get(`/submissions/${id}`);
      setSubmissions(updated.data);
    } catch (err) {
      alert('Failed to submit code.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!problem) return <div className="p-4">Loading problem...</div>;

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <ProblemHeader
        title={problem.title}
        description={problem.description}
        difficulty={problem.difficulty}
      />
      <CodeEditor code={code} setCode={setCode} />
      <OutputBox output={output} />
      <div className="mt-4 flex gap-4">
        <button
          onClick={handleRunCode}
          disabled={isRunning}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isRunning ? 'Running...' : 'Run Code'}
        </button>
        <button
          onClick={handleSubmitCode}
          disabled={isSubmitting}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Code'}
        </button>
      </div>
      <SubmissionsList submissions={submissions} />
    </div>
  );
}
