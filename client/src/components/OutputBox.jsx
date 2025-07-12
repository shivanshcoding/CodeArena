export default function OutputBox({ output }) {
  if (!output) return null;

  return (
    <div className="mt-4 p-3 bg-black text-white border rounded">
      <h3 className="font-semibold mb-1">Output:</h3>
      <pre>{output.stdout || output.stderr || 'No output'}</pre>
    </div>
  );
}
