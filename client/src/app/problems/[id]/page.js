'use client';
import { useParams } from 'next/navigation';

export default function ProblemPage() {
  const { id } = useParams();
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Problem ID: {id}</h1>
      {/* You can load problem details from API here */}
    </div>
  );
}
