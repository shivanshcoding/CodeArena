'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import api from '@/lib/api.js';
import AIAssistantToggle from '@/components/AIAssistant/AIAssistantToggle';

import ProblemHeader from '@/components/ProblemHeader';
import CodeEditor from '@/components/CodeEditor';
import OutputBox from '@/components/OutputBox.jsx';
import SubmissionsList from '@/components/SubmissionsList.jsx';

const TABS = ['Description', 'Editorial', 'Solutions', 'Code', 'Output', 'Submissions'];

export default function ProblemPage() {
  const { slug, number } = useParams();
  const [activeTab, setActiveTab] = useState('Description');

  const [question, setQuestion] = useState(null);
  const [code, setCode] = useState('// write your code here');
  const [language, setLanguage] = useState('cpp');
  const [output, setOutput] = useState(null);
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(`/api/questions/${slug}/${number}`);
      setQuestion(res.data);
    };
    const fetchSubs = async () => {
      const res = await axios.get(`/api/submissions/${slug}/${number}`);
      setSubmissions(res.data);
    };
    fetchData();
    fetchSubs();
  }, [slug, number]);

  const handleRun = async () => {
    try {
      setOutput({ stdout: 'Running your code...', stderr: '' });
      const res = await api.post('/submissions/submit', {
        questionSlug: slug,
        questionNumber: number,
        sourceCode: code,
        language: language,
      });
      setOutput(res.data);
      setActiveTab('Output');
    } catch (error) {
      console.error('Error running code:', error);
      setOutput({ 
        stdout: '', 
        stderr: error.response?.data?.message || 'An error occurred while running your code.' 
      });
      setActiveTab('Output');
    }
  };

  if (!question) return <div className="p-6">Loading...</div>;
  
  // Extract MongoDB ID for AI Assistant
  const questionId = question._id;

  return (
    <div className="p-6 relative">
      {/* Tabs */}
      <div className="flex gap-4 mb-4 border-b pb-2 text-sm font-semibold">
        {TABS.map((tab) => (
          <button
            key={tab}
            className={`px-3 py-1 rounded ${
              activeTab === tab ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div>
        {activeTab === 'Description' && (
          <ProblemHeader
            title={question.title}
            description={question.description}
            difficulty={question.difficulty}
          />
        )}

        {activeTab === 'Editorial' && (
          <div className="whitespace-pre-wrap text-gray-800">{question.editorial || 'No editorial available.'}</div>
        )}

        {activeTab === 'Solutions' && (
          <div className="whitespace-pre-wrap text-gray-800">{question.solutions || 'No solutions uploaded.'}</div>
        )}

        {activeTab === 'Code' && (
          <>
            <CodeEditor 
              code={code} 
              setCode={setCode} 
              language={language}
              setLanguage={setLanguage}
            />
            <div className="flex gap-4 mt-4">
              <button
                onClick={handleRun}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                Run Code
              </button>
              <button
                onClick={() => {
                  handleRun();
                  // TODO: Add submission logic here
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Submit Solution
              </button>
            </div>
          </>
        )}

        {activeTab === 'Output' && <OutputBox output={output} />}

        {activeTab === 'Submissions' && <SubmissionsList submissions={submissions} />}
      </div>
      
      {/* AI Assistant */}
      {questionId && <AIAssistantToggle questionId={questionId} code={code} language={language} output={output} />}
    </div>
  );
}
