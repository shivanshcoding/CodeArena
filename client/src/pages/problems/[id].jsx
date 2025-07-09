import { useRouter } from 'next/router';

export default function ProblemPage() {
  const { id } = useRouter().query;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Problem: {id}</h1>
      {/* Later: load problem details from backend */}
    </div>
  );
}
