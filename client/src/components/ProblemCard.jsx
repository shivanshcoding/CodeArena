import Link from 'next/link';

export default function ProblemCard({ problem }) {
  return (
    <div className="border p-4 rounded-md hover:shadow">
      <Link href={`/problems/${problem._id}`}>
        <h3 className="font-semibold text-lg">{problem.title}</h3>
      </Link>
      <p className="text-sm text-gray-600">{problem.difficulty}</p>
    </div>
  );
}
