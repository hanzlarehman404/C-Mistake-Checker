
import React from 'react';
import { AnalysisResponse, IssueType } from '../types';

interface AnalysisResultProps {
  data: AnalysisResponse | null;
  loading: boolean;
  error: string | null;
}

const getTypeColor = (type: IssueType) => {
  switch (type) {
    case 'syntax': return 'bg-red-500/10 text-red-400 border-red-500/20';
    case 'logic': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
    case 'runtime': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
    case 'warning': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
    case 'practice': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
  }
};

const getTypeLabel = (type: IssueType) => {
  return type.charAt(0).toUpperCase() + type.slice(1);
};

const AnalysisResult: React.FC<AnalysisResultProps> = ({ data, loading, error }) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4 py-20">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 animate-pulse">Analyzing code structure and memory patterns...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-lg">
        <h3 className="text-red-400 font-semibold mb-2">Error Analyzing Code</h3>
        <p className="text-red-300/80 text-sm">{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-500 py-20">
        <svg className="w-16 h-16 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p>Your analysis report will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span className="w-2 h-8 bg-blue-500 rounded-full"></span>
          Analysis Summary
        </h2>
        <p className="text-slate-300 leading-relaxed bg-slate-800/50 p-4 rounded-lg border border-slate-700">
          {data.overallSummary}
        </p>
      </div>

      {data.issues.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="w-2 h-8 bg-red-500 rounded-full"></span>
            Detected Issues ({data.issues.length})
          </h2>
          <div className="space-y-4">
            {data.issues.map((issue, idx) => (
              <div key={idx} className="bg-slate-800/40 border border-slate-700 rounded-xl overflow-hidden shadow-sm">
                <div className="px-4 py-2 bg-slate-800 flex items-center justify-between border-b border-slate-700">
                  <span className={`text-xs font-bold px-2 py-1 rounded border uppercase tracking-wider ${getTypeColor(issue.type)}`}>
                    {getTypeLabel(issue.type)}
                  </span>
                  <span className="text-slate-500 text-xs code-font">Line: {issue.line}</span>
                </div>
                <div className="p-4 space-y-4">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">Issue Found</p>
                    <p className="text-slate-200 text-sm">{issue.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-red-400 uppercase tracking-widest font-bold mb-1">Original Snippet</p>
                      <pre className="bg-red-500/5 border border-red-500/20 p-3 rounded-lg text-xs code-font overflow-x-auto">
                        {issue.originalSnippet}
                      </pre>
                    </div>
                    <div>
                      <p className="text-xs text-emerald-400 uppercase tracking-widest font-bold mb-1">Suggested Fix</p>
                      <pre className="bg-emerald-500/5 border border-emerald-500/20 p-3 rounded-lg text-xs code-font overflow-x-auto">
                        {issue.fix}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.bestPractices.length > 0 && (
        <div className="pb-12">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="w-2 h-8 bg-amber-500 rounded-full"></span>
            Best Practices & Tips
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {data.bestPractices.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-3 bg-slate-800/30 p-3 rounded-lg border border-slate-700/50">
                <span className="text-amber-400 mt-1">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                <span className="text-sm text-slate-300">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AnalysisResult;
