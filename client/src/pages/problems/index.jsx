import { useEffect, useState } from 'react';
import axios from '../../lib/api';
import Navbar from '../../components/Navbar';
import ProblemCard from '../../components/ProblemCard';

export default function ProblemsPage() {
  const [problems, setProblems] = useState([]);

  useEffect(() => {
    axios.get('/questions')
      .then(res => setProblems(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <>
      <Navbar />
      <div className="p-4">
        <h2 className="text-2xl font-semibold mb-4">📘 DSA Problems</h2>
        <div className="grid gap-4">
          {problems.map(problem => (
            <ProblemCard key={problem._id} problem={problem} />
          ))}
        </div>
      </div>
    </>
  );
}
