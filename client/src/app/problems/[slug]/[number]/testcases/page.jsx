'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from '@/lib/api';

export default function TestCaseUploadPage() {
    const { slug, number } = useParams();
    const [questionId, setQuestionId] = useState('');
    const [testCases, setTestCases] = useState([{ input: '', expectedOutput: '' }]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (slug && number) {
            axios.get(`/questions/${slug}/${number}`)
                .then(res => setQuestionId(res.data._id))
                .catch(() => alert('Failed to fetch question'));
        }
    }, [slug, number]);

    const handleChange = (index, field, value) => {
        const newTestCases = [...testCases];
        newTestCases[index][field] = value;
        setTestCases(newTestCases);
    };

    const addTestCase = () => {
        setTestCases([...testCases, { input: '', expectedOutput: '' }]);
    };

    const handleSubmit = async () => {
        try {
            const res = await axios.post(`/questions/${questionId}/testcases`, {
                testCases,
            });
            setMessage(res.data.message);
        } catch (err) {
            alert('Error uploading test cases');
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4">Upload Test Cases</h2>
            {testCases.map((tc, idx) => (
                <div key={idx} className="mb-4">
                    <label className="block font-semibold">Input {idx + 1}</label>
                    <textarea
                        rows={3}
                        className="w-full p-2 mb-2 bg-gray-100 rounded"
                        value={tc.input}
                        onChange={(e) => handleChange(idx, 'input', e.target.value)}
                    />
                    <label className="block font-semibold">Expected Output {idx + 1}</label>
                    <textarea
                        rows={3}
                        className="w-full p-2 bg-gray-100 rounded"
                        value={tc.expectedOutput}
                        onChange={(e) => handleChange(idx, 'expectedOutput', e.target.value)}
                    />
                </div>
            ))}
            <button onClick={addTestCase} className="px-4 py-2 bg-green-600 text-white rounded mr-2">
                Add More
            </button>
            <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded">
                Upload Test Cases
            </button>

            {message && <p className="mt-4 text-green-500 font-medium">{message}</p>}
        </div>
    );
}
