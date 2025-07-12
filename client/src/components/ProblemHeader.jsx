export default function ProblemHeader({ title, description, difficulty }) {
  const getColor = () => {
    if (difficulty === 'Easy') return 'text-green-600';
    if (difficulty === 'Medium') return 'text-yellow-600';
    if (difficulty === 'Hard') return 'text-red-600';
    return 'text-gray-500';
  };

  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="text-gray-700 mt-2 whitespace-pre-wrap">{description}</p>
      <p className="mt-2">
        <strong>Difficulty:</strong>{' '}
        <span className={`${getColor()} font-semibold`}>{difficulty}</span>
      </p>
    </div>
  );
}
