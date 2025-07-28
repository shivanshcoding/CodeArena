'use client';
import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';

// Language options with their Monaco editor language IDs and starter code
const LANGUAGES = [
  {
    id: 'cpp',
    name: 'C++',
    monacoId: 'cpp',
    starterCode: '// C++ code\n#include <iostream>\n\nint main() {\n    // Your code here\n    std::cout << "Hello World!" << std::endl;\n    return 0;\n}'
  },
  {
    id: 'java',
    name: 'Java',
    monacoId: 'java',
    starterCode: '// Java code\npublic class Solution {\n    public static void main(String[] args) {\n        // Your code here\n        System.out.println("Hello World!");\n    }\n}'
  },
  {
    id: 'python',
    name: 'Python',
    monacoId: 'python',
    starterCode: '# Python code\n\ndef main():\n    # Your code here\n    print("Hello World!")\n\nif __name__ == "__main__":\n    main()'
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    monacoId: 'javascript',
    starterCode: '// JavaScript code\n\nfunction main() {\n    // Your code here\n    console.log("Hello World!");\n}\n\nmain();'
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    monacoId: 'typescript',
    starterCode: '// TypeScript code\n\nfunction main(): void {\n    // Your code here\n    console.log("Hello World!");\n}\n\nmain();'
  },
  {
    id: 'csharp',
    name: 'C#',
    monacoId: 'csharp',
    starterCode: '// C# code\nusing System;\n\nclass Program {\n    static void Main() {\n        // Your code here\n        Console.WriteLine("Hello World!");\n    }\n}'
  },
  {
    id: 'go',
    name: 'Go',
    monacoId: 'go',
    starterCode: '// Go code\npackage main\n\nimport "fmt"\n\nfunc main() {\n    // Your code here\n    fmt.Println("Hello World!")\n}'
  },
  {
    id: 'ruby',
    name: 'Ruby',
    monacoId: 'ruby',
    starterCode: '# Ruby code\n\n# Your code here\nputs "Hello World!"'
  }
];

export default function CodeEditor({ code, setCode, language: initialLanguage = 'cpp', setLanguage: setParentLanguage }) {
  const [language, setLocalLanguage] = useState(initialLanguage);
  
  // Update parent language state when local language changes
  useEffect(() => {
    if (setParentLanguage) {
      setParentLanguage(language);
    }
  }, [language, setParentLanguage]);

  // Handle language change
  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    setLocalLanguage(newLanguage);
    
    // If code is empty or just the default starter, replace with new language starter code
    const currentLang = LANGUAGES.find(lang => lang.id === language);
    const newLang = LANGUAGES.find(lang => lang.id === newLanguage);
    
    if (code === currentLang?.starterCode || !code) {
      setCode(newLang?.starterCode || '// Your code here');
    }
  };

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-2">
        <div className="text-sm font-medium text-gray-700">Code Editor</div>
        <select
          value={language}
          onChange={handleLanguageChange}
          className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.id} value={lang.id}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>
      
      <div className="border rounded overflow-hidden">
        <Editor
          height="400px"
          language={LANGUAGES.find(lang => lang.id === language)?.monacoId || 'cpp'}
          value={code}
          onChange={(val) => setCode(val)}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            fontSize: 14,
            tabSize: 2,
            automaticLayout: true
          }}
        />
      </div>
    </div>
  );
}
