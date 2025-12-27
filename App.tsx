
import React, { useState, useCallback } from 'react';
import CodeEditor from './components/CodeEditor';
import AnalysisResult from './components/AnalysisResult';
import { analyzeCppCode } from './services/geminiService';
import { AnalysisResponse } from './types';

const INITIAL_CODE = `#include <iostream>
#include <vector>

int main() {
    int* data = new int[10];
    
    for (int i = 0; i <= 10; ++i) {
        data[i] = i * 2;
        std::cout << data[i] << " ";
    }
    
    if (data[0] = 5) {
        std::cout << "Data is five";
    }

    return 0;
}`;

const App: React.FC = () => {
  const [code, setCode] = useState(INITIAL_CODE);
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = useCallback(async () => {
    if (!code.trim()) {
      setError("Please enter some C++ code to analyze.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await analyzeCppCode(code);
      setAnalysis(result);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during analysis.");
    } finally {
      setLoading(false);
    }
  }, [code]);

  const handleClear = () => {
    setCode("");
    setAnalysis(null);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold leading-none">C++ Mistake Checker</h1>
              <p className="text-xs text-slate-500 font-medium">Powered by Gemini Pro Intelligence</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleClear}
              className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors"
            >
              Clear
            </button>
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className={`px-6 py-2 rounded-lg text-sm font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95 ${
                loading 
                  ? 'bg-blue-800 text-slate-400 cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-500'
              }`}
            >
              {loading ? 'Analyzing...' : 'Run Analysis'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 lg:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Editor Side */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-300 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Source Code
            </h2>
            <div className="flex gap-2 text-[10px] text-slate-500 uppercase tracking-widest font-bold">
              <span>Modern C++ (11/14/17/20)</span>
            </div>
          </div>
          
          <CodeEditor value={code} onChange={setCode} disabled={loading} />
          
          <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50 text-sm text-slate-400 leading-relaxed italic">
            <strong>Pro Tip:</strong> Use smart pointers (`std::unique_ptr`) and RAII instead of raw pointers to avoid memory leaks. The assistant will check for these!
          </div>
        </section>

        {/* Results Side */}
        <section className="bg-slate-900/40 rounded-2xl p-6 border border-slate-800 min-h-[500px]">
          <AnalysisResult data={analysis} loading={loading} error={error} />
        </section>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-slate-800/50 text-center">
        <p className="text-slate-500 text-xs">
          Built with React, Tailwind CSS and Google Gemini API.
        </p>
      </footer>
    </div>
  );
};

export default App;
