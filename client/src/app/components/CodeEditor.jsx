'use client';
import Editor from '@monaco-editor/react';

export default function CodeEditor({ code, setCode }) {
  return (
    <div className="mt-6 border rounded overflow-hidden">
      <Editor
        height="400px"
        defaultLanguage="cpp"
        defaultValue={code}
        onChange={(val) => setCode(val)}
        theme="vs-dark"
      />
    </div>
  );
}
