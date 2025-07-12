export default function SubmissionsList({ submissions }) {
  if (!submissions?.length) return null;

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-2">📜 Previous Submissions</h2>
      <ul className="space-y-2">
        {submissions.map((s) => (
          <li
            key={s._id}
            className="border rounded p-2 bg-gray-50 text-sm text-gray-800"
          >
            <div className="flex justify-between">
              <span>{new Date(s.submittedAt).toLocaleString()}</span>
              <span className="font-mono text-green-600">
                {s.stdout ? '✔ Success' : '❌ Error'}
              </span>
            </div>
            <div className="mt-1 text-xs text-gray-600 overflow-x-auto whitespace-pre-wrap">
              {s.stdout || s.stderr || 'No output'}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
