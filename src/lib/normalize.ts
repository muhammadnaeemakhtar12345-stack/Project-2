import type {
  AnalysisResult,
  Citation,
  PaperMeta,
  PlagiarismRisk,
  Scores,
  SectionAnalysis,
} from "./types";

const clamp = (n: unknown, min = 0, max = 100, fallback = 0) => {
  const v = typeof n === "number" && Number.isFinite(n) ? n : fallback;
  return Math.max(min, Math.min(max, Math.round(v)));
};

const str = (v: unknown, fallback = "") =>
  typeof v === "string" ? v.trim() : fallback;

const strOrNull = (v: unknown): string | null => {
  if (typeof v === "string") {
    const t = v.trim();
    return t.length === 0 ? null : t;
  }
  return null;
};

const numOrNull = (v: unknown): number | null => {
  if (typeof v === "number" && Number.isFinite(v)) return Math.round(v);
  if (typeof v === "string") {
    const n = parseInt(v, 10);
    if (Number.isFinite(n)) return n;
  }
  return null;
};

const arr = <T,>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);

const grade = (n: number): "A" | "B" | "C" | "D" | "F" => {
  if (n >= 90) return "A";
  if (n >= 80) return "B";
  if (n >= 70) return "C";
  if (n >= 60) return "D";
  return "F";
};

function normalizePaper(input: unknown): PaperMeta {
  const o = (input ?? {}) as Record<string, unknown>;
  return {
    title: str(o.title, "Untitled paper"),
    authors: arr<unknown>(o.authors)
      .map((a) => str(a))
      .filter((a) => a.length > 0)
      .slice(0, 12),
    year: numOrNull(o.year),
    venue: strOrNull(o.venue),
    fieldOfStudy: strOrNull(o.fieldOfStudy),
  };
}

function normalizeScores(input: unknown): Scores {
  const o = (input ?? {}) as Record<string, unknown>;
  return {
    overall: clamp(o.overall, 0, 100, 70),
    clarity: clamp(o.clarity, 0, 100, 70),
    novelty: clamp(o.novelty, 0, 100, 70),
    rigor: clamp(o.rigor, 0, 100, 70),
    impact: clamp(o.impact, 0, 100, 70),
  };
}

function normalizeSections(input: unknown): SectionAnalysis[] {
  return arr<unknown>(input)
    .map((raw, i) => {
      const o = (raw ?? {}) as Record<string, unknown>;
      const name = str(o.name, `Section ${i + 1}`);
      const id = str(o.id) || name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      return {
        id,
        name,
        originalGist: str(o.originalGist, ""),
        rewrite: str(o.rewrite, ""),
        keyPoints: arr<unknown>(o.keyPoints)
          .map((k) => str(k))
          .filter((k) => k.length > 0)
          .slice(0, 8),
      } satisfies SectionAnalysis;
    })
    .filter((s) => s.name.length > 0);
}

function normalizeCitations(input: unknown): Citation[] {
  return arr<unknown>(input)
    .map((raw, i) => {
      const o = (raw ?? {}) as Record<string, unknown>;
      return {
        id: str(o.id, `ref-${i + 1}`),
        raw: strOrNull(o.raw),
        apa: str(o.apa, ""),
        mla: str(o.mla, ""),
        bibtex: str(o.bibtex, ""),
        note: str(o.note, ""),
      } satisfies Citation;
    })
    .filter((c) => c.apa.length > 0 || c.bibtex.length > 0 || c.mla.length > 0);
}

function normalizeRisk(input: unknown): PlagiarismRisk {
  const o = (input ?? {}) as Record<string, unknown>;
  const originality = clamp(o.originality, 0, 100, 80);
  const g = ["A", "B", "C", "D", "F"].includes(o.grade as string)
    ? (o.grade as PlagiarismRisk["grade"])
    : grade(originality);
  return {
    originality,
    grade: g,
    rationale: str(o.rationale, ""),
    suggestions: arr<unknown>(o.suggestions)
      .map((s) => str(s))
      .filter((s) => s.length > 0)
      .slice(0, 8),
  };
}

export function normalizeAnalysis(input: unknown): AnalysisResult {
  const o = (input ?? {}) as Record<string, unknown>;
  return {
    paper: normalizePaper(o.paper),
    scores: normalizeScores(o.scores),
    executiveSummary: str(o.executiveSummary, ""),
    sections: normalizeSections(o.sections),
    citations: normalizeCitations(o.citations),
    plagiarismRisk: normalizeRisk(o.plagiarismRisk),
  };
}

export function safeJsonParse(raw: string): unknown {
  const trimmed = raw.trim();
  // Strip markdown fences if model added them despite instructions.
  const fenced = trimmed.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");
  try {
    return JSON.parse(fenced);
  } catch {
    // Try grabbing the first { ... } block.
    const start = fenced.indexOf("{");
    const end = fenced.lastIndexOf("}");
    if (start !== -1 && end > start) {
      try {
        return JSON.parse(fenced.slice(start, end + 1));
      } catch {
        return null;
      }
    }
    return null;
  }
}
