
export type IssueType = 'syntax' | 'logic' | 'runtime' | 'practice' | 'warning';

export interface CppIssue {
  type: IssueType;
  line: number | string;
  originalSnippet: string;
  description: string;
  fix: string;
}

export interface AnalysisResponse {
  issues: CppIssue[];
  overallSummary: string;
  bestPractices: string[];
}
