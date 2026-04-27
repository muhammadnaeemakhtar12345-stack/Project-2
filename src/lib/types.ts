export type Severity = "critical" | "warning" | "info";

export interface PaperMeta {
  title: string;
  authors: string[];
  year: number | null;
  venue: string | null;
  fieldOfStudy: string | null;
}

export interface Scores {
  overall: number;
  clarity: number;
  novelty: number;
  rigor: number;
  impact: number;
}

export interface SectionAnalysis {
  id: string;
  name: string;
  originalGist: string;
  rewrite: string;
  keyPoints: string[];
}

export interface Citation {
  id: string;
  raw: string | null;
  apa: string;
  mla: string;
  bibtex: string;
  note: string;
}

export interface PlagiarismRisk {
  originality: number;
  grade: "A" | "B" | "C" | "D" | "F";
  rationale: string;
  suggestions: string[];
}

export interface AnalysisResult {
  paper: PaperMeta;
  scores: Scores;
  executiveSummary: string;
  sections: SectionAnalysis[];
  citations: Citation[];
  plagiarismRisk: PlagiarismRisk;
}

export interface AnalyzeRequestBody {
  text: string;
  filename: string;
  voice?: "academic" | "concise" | "neutral";
}
