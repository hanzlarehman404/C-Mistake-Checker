
import React, { useRef, useEffect } from 'react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ value, onChange, disabled }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const lineCount = value.split('\n').length;
  const lines = Array.from({ length: Math.max(lineCount, 1) }, (_, i) => i + 1);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = textareaRef.current?.selectionStart || 0;
      const end = textareaRef.current?.selectionEnd || 0;
      const newValue = value.substring(0, start) + '    ' + value.substring(end);
      onChange(newValue);
      
      // Reset cursor position after React re-renders
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 4;
        }
      }, 0);
    }
  };

  return (
    <div className="relative flex w-full h-[500px] border border-slate-700 rounded-lg overflow-hidden bg-slate-900 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
      <div className="w-12 bg-slate-800 text-slate-500 flex flex-col items-center pt-4 select-none code-font text-sm">
        {lines.map((num) => (
          <div key={num} className="h-6 flex items-center">{num}</div>
        ))}
      </div>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className="flex-1 p-4 bg-transparent outline-none resize-none code-font text-sm leading-6 text-slate-300 placeholder-slate-600"
        placeholder="#include <iostream>\n\nint main() {\n    std::cout << \"Hello World\";\n    return 0;\n}"
        spellCheck={false}
      />
    </div>
  );
};

export default CodeEditor;
