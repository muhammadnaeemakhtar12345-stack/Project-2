"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  BookOpen,
  Check,
  ChevronDown,
  Copy,
  Download,
  FileText,
  ListOrdered,
  PenLine,
  Quote,
  RotateCcw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useMemo, useState } from "react";
import type { AnalysisResult } from "@/lib/types";
import type { ExtractedPdf } from "@/lib/extractPdf";
import { ScoreRing } from "./ScoreRing";
import { downloadPdfReport } from "@/lib/pdfReport";

interface Props {
  data: ExtractedPdf;
  result: AnalysisResult;
  onReset: () => void;
}

const gradeAccent: Record<AnalysisResult["plagiarismRisk"]["grade"], string> = {
  A: "badge-emerald",
  B: "badge-emerald",
  C: "badge-amber",
  D: "badge-amber",
  F: "badge-rose",
};

export function Results({ data, result, onReset }: Props) {
  const reduced = useReducedMotion();
  const initial = reduced ? false : { opacity: 0, y: 14 };
  const animate = { opacity: 1, y: 0 };

  const overall = result.scores.overall;
  const originality = result.plagiarismRisk.originality;

  const meta = useMemo(() => {
    const a = result.paper.authors;
    return {
      authors: a.length ? a.join(", ") : "—",
      year: result.paper.year ?? "—",
      venue: result.paper.venue ?? "—",
      field: result.paper.fieldOfStudy ?? "—",
    };
  }, [result.paper]);

  return (
    <motion.div
      initial={initial}
      animate={animate}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="mt-6 space-y-5"
    >
      {/* Header card */}
      <div className="card card-lift p-6 relative overflow-hidden result-header">
        <div className="flex flex-wrap items-start gap-6">
          <div className="flex items-start gap-4 min-w-0 flex-1">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[color-mix(in_oklab,var(--violet)_14%,var(--surface))] text-[var(--violet)]">
              <BookOpen className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="text-[0.65rem] tracking-[0.2em] uppercase text-[var(--text-muted)]">
                Analysis ready
              </div>
              <h3 className="mt-1 text-xl font-semibold tracking-tight leading-snug truncate">
                {result.paper.title || data.filename}
              </h3>
              <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-xs text-[var(--text-muted)]">
                <span>{meta.authors}</span>
                <span>·</span>
                <span>{meta.year}</span>
                {result.paper.venue && (
                  <>
                    <span>·</span>
                    <span className="truncate max-w-[28ch]">{meta.venue}</span>
                  </>
                )}
                {result.paper.fieldOfStudy && (
                  <span className="badge badge-violet">{meta.field}</span>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 ml-auto">
            <ScoreRing value={overall} size={92} stroke={9} label="OVERALL" />
            <div className="flex flex-col gap-2">
              <button
                onClick={() =>
                  downloadPdfReport(result, {
                    name: "Quilix",
                    tagline: "AI Paper Synthesis & Plagiarism-Free Rewriting",
                  })
                }
                className="btn-primary text-sm"
              >
                <Download className="h-4 w-4" />
                Download PDF report
              </button>
              <button onClick={onReset} className="btn-ghost text-sm">
                <RotateCcw className="h-4 w-4" />
                Analyze another paper
              </button>
            </div>
          </div>
        </div>
        {result.executiveSummary && (
          <div className="mt-5 rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] p-4 sm:p-5">
            <div className="flex items-center gap-2 text-[0.65rem] tracking-[0.2em] uppercase text-[var(--violet)] font-semibold">
              <Sparkles className="h-3.5 w-3.5" />
              Executive Summary
            </div>
            <p className="mt-2 text-[0.95rem] leading-relaxed text-[var(--text)]">
              {result.executiveSummary}
            </p>
          </div>
        )}
      </div>

      {/* Score grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {(
          [
            ["Clarity", result.scores.clarity, "violet"],
            ["Novelty", result.scores.novelty, "fuchsia"],
            ["Rigor", result.scores.rigor, "sky"],
            ["Impact", result.scores.impact, "amber"],
            ["Originality", originality, "emerald"],
          ] as Array<[string, number, string]>
        ).map(([label, value, hue], i) => (
          <motion.div
            key={label}
            initial={reduced ? false : { opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.45, delay: i * 0.05 }}
            className={`score-card score-card--${hue} p-4`}
          >
            <div className="flex items-center justify-between">
              <div className="text-[0.65rem] tracking-[0.18em] uppercase text-[var(--text-muted)] font-medium">
                {label}
              </div>
              <span className={`badge badge-${hue}`}>{value}/100</span>
            </div>
            <div className="mt-3 h-2 rounded-full bg-[var(--border)] overflow-hidden">
              <motion.div
                initial={reduced ? false : { width: 0 }}
                whileInView={{ width: `${value}%` }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{
                  duration: 0.9,
                  delay: 0.15 + i * 0.05,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={`score-bar score-bar--${hue} h-full rounded-full`}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Plagiarism risk panel */}
      <div className="card card-lift p-6 result-verdict">
        <div className="flex flex-wrap items-start gap-5">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[color-mix(in_oklab,var(--emerald)_14%,var(--surface))] text-[var(--emerald)]">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold tracking-tight">Originality verdict</h4>
              <span className={`badge ${gradeAccent[result.plagiarismRisk.grade]}`}>
                Grade {result.plagiarismRisk.grade}
              </span>
            </div>
            <p className="mt-1.5 text-sm text-[var(--text-soft)] leading-relaxed">
              {result.plagiarismRisk.rationale ||
                "No specific concerns detected in the rewritten content."}
            </p>
            {result.plagiarismRisk.suggestions.length > 0 && (
              <ul className="mt-3 grid gap-1.5 sm:grid-cols-2 text-sm text-[var(--text-soft)]">
                {result.plagiarismRisk.suggestions.map((s, i) => (
                  <li key={i} className="flex gap-2">
                    <Check className="h-4 w-4 mt-0.5 text-[var(--emerald)] shrink-0" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="ml-auto">
            <ScoreRing value={originality} size={108} stroke={9} label="ORIGINAL" />
          </div>
        </div>
      </div>

      {/* Deliverables strip — sir's three required outputs at a glance */}
      <div className="grid gap-3 sm:grid-cols-3">
        <DeliverableChip
          numeral="I"
          label="Section-wise summary"
          hint="Abstract → Conclusion"
          hue="violet"
          count={`${result.sections.length} sections`}
          icon={<ListOrdered className="h-4 w-4" />}
        />
        <DeliverableChip
          numeral="II"
          label="Plagiarism-free rewrite"
          hint="In your own words"
          hue="fuchsia"
          count={`${result.sections.length} rewrites`}
          icon={<PenLine className="h-4 w-4" />}
        />
        <DeliverableChip
          numeral="III"
          label="Smart citations"
          hint="APA · MLA · BibTeX"
          hue="sky"
          count={`${result.citations.length} entries`}
          icon={<Quote className="h-4 w-4" />}
        />
      </div>

      {/* ── Chapter I — Section-wise summary ───────────────────────── */}
      <ChapterHeader
        numeral="I"
        eyebrow="Deliverable one"
        title="Section-wise summary"
        sub="Abstract → Conclusion · original gist + key points for each section, exactly as it appears in the paper."
        hue="violet"
      />
      <div className="space-y-3">
        {result.sections.map((s, i) => (
          <SummaryItem key={`sum-${s.id || i}`} section={s} index={i} />
        ))}
      </div>

      {/* ── Chapter II — Plagiarism-free rewriting ─────────────────── */}
      <ChapterHeader
        numeral="II"
        eyebrow="Deliverable two"
        title="Plagiarism-free rewriting"
        sub="Each section paraphrased in your own words, ready to paste into your assignment without copying."
        hue="fuchsia"
      />
      <div className="space-y-3">
        {result.sections.map((s, i) => (
          <RewriteItem key={`rw-${s.id || i}`} section={s} index={i} />
        ))}
      </div>

      {/* ── Chapter III — Smart citations ──────────────────────────── */}
      {result.citations.length > 0 && (
        <>
          <ChapterHeader
            numeral="III"
            eyebrow="Deliverable three"
            title="Smart citations"
            sub="Every reference detected in the paper, formatted in APA, MLA, and BibTeX — copy-and-paste ready."
            hue="sky"
          />
          <div className="grid gap-3">
            {result.citations.map((c, i) => (
              <CitationItem key={c.id || i} citation={c} index={i} />
            ))}
          </div>
        </>
      )}
    </motion.div>
  );
}

function ChapterHeader({
  numeral,
  eyebrow,
  title,
  sub,
  hue,
}: {
  numeral: string;
  eyebrow: string;
  title: string;
  sub: string;
  hue: "violet" | "fuchsia" | "sky";
}) {
  return (
    <div className={`chapter-head chapter-head--${hue} mt-10`}>
      <div className="ornament">
        <span className="ornament__diamond" />
      </div>
      <div className="mt-6 flex flex-wrap items-end gap-x-6 gap-y-2">
        <div className={`chapter-numeral chapter-numeral--${hue}`}>{numeral}</div>
        <div className="min-w-0 flex-1">
          <div
            className={`text-[0.62rem] tracking-[0.22em] uppercase font-semibold chapter-eyebrow--${hue}`}
          >
            {eyebrow}
          </div>
          <h3 className="headline-serif mt-1.5 text-[1.7rem] leading-[1.1] tracking-tight text-[var(--ink)]">
            {title}
          </h3>
          <p className="mt-2 text-sm text-[var(--text-soft)] leading-relaxed max-w-2xl">
            {sub}
          </p>
        </div>
      </div>
    </div>
  );
}

function DeliverableChip({
  numeral,
  label,
  hint,
  hue,
  count,
  icon,
}: {
  numeral: string;
  label: string;
  hint: string;
  hue: "violet" | "fuchsia" | "sky";
  count: string;
  icon: React.ReactNode;
}) {
  return (
    <div className={`deliverable-chip deliverable-chip--${hue}`}>
      <div className="flex items-center gap-3">
        <span className={`chip-numeral chip-numeral--${hue}`}>{numeral}</span>
        <div className="min-w-0">
          <div className="font-semibold tracking-tight text-[var(--ink)]">
            {label}
          </div>
          <div className="text-[0.7rem] text-[var(--text-muted)] mt-0.5">
            {hint}
          </div>
        </div>
        <span className={`ml-auto badge badge-${hue}`}>{count}</span>
      </div>
      <div className="mt-3 flex items-center gap-2 text-[0.7rem] text-[var(--text-muted)]">
        <Check className="h-3.5 w-3.5 text-[var(--emerald)]" />
        Included · {icon ? <span className="ml-1">{icon}</span> : null}
      </div>
    </div>
  );
}

function SummaryItem({
  section,
  index,
}: {
  section: AnalysisResult["sections"][number];
  index: number;
}) {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(index < 2);

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.4, delay: index * 0.03 }}
      className="card card-lift overflow-hidden"
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-4 px-5 py-4 text-left"
      >
        <span className="chapter-pill chapter-pill--violet text-xs font-semibold">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <FileText className="h-3.5 w-3.5 text-[var(--text-muted)]" />
            <div className="font-semibold tracking-tight">{section.name}</div>
          </div>
          <div className="text-xs text-[var(--text-muted)] mt-0.5 truncate">
            {section.originalGist || "No gist provided"}
          </div>
        </div>
        <ChevronDown
          className={`h-4 w-4 text-[var(--text-muted)] transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <div className="px-5 pb-5 pt-1">
          <div className="text-[0.65rem] tracking-[0.18em] uppercase text-[var(--text-muted)] mb-1.5">
            Original gist
          </div>
          <p className="text-sm leading-relaxed text-[var(--text-soft)]">
            {section.originalGist}
          </p>
          {section.keyPoints.length > 0 && (
            <>
              <div className="mt-4 text-[0.65rem] tracking-[0.18em] uppercase text-[var(--text-muted)] mb-1.5">
                Key points
              </div>
              <ul className="space-y-1.5">
                {section.keyPoints.map((k, i) => (
                  <li key={i} className="flex gap-2 text-sm">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[var(--violet)] shrink-0" />
                    <span className="text-[var(--text-soft)]">{k}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </motion.div>
  );
}

function RewriteItem({
  section,
  index,
}: {
  section: AnalysisResult["sections"][number];
  index: number;
}) {
  const reduced = useReducedMotion();
  const [copied, setCopied] = useState(false);

  async function copyRewrite() {
    try {
      await navigator.clipboard.writeText(section.rewrite);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      /* ignore */
    }
  }

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.4, delay: index * 0.03 }}
      className="card card-lift p-5"
    >
      <div className="flex items-start gap-4">
        <span className="chapter-pill chapter-pill--fuchsia text-xs font-semibold">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <PenLine className="h-3.5 w-3.5 text-[var(--fuchsia)]" />
            <div className="font-semibold tracking-tight">{section.name}</div>
            <span className="badge badge-fuchsia ml-1">paraphrased</span>
          </div>
        </div>
        <button
          onClick={copyRewrite}
          className="btn-ghost text-xs h-8 px-2.5 shrink-0"
          aria-label="Copy rewrite"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              Copy rewrite
            </>
          )}
        </button>
      </div>
      <div className="quote-slab mt-4 quote-slab--fuchsia">
        {section.rewrite || "—"}
      </div>
    </motion.div>
  );
}

function CitationItem({
  citation,
  index,
}: {
  citation: AnalysisResult["citations"][number];
  index: number;
}) {
  const reduced = useReducedMotion();
  const [tab, setTab] = useState<"apa" | "mla" | "bibtex">("apa");
  const [copied, setCopied] = useState(false);

  const value =
    tab === "apa" ? citation.apa : tab === "mla" ? citation.mla : citation.bibtex;

  async function copyValue() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      /* ignore */
    }
  }

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.4, delay: index * 0.03 }}
      className="card card-lift p-5"
    >
      <div className="flex flex-wrap items-start gap-3 justify-between">
        <div className="flex items-center gap-2">
          <Quote className="h-4 w-4 text-[var(--fuchsia)]" />
          <span className="badge badge-violet">{citation.id}</span>
          {citation.note && (
            <span className="text-xs text-[var(--text-muted)] line-clamp-1 max-w-[36ch]">
              {citation.note}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <div className="card flex items-center divide-x divide-[var(--border)] overflow-hidden text-xs">
            {(["apa", "mla", "bibtex"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-2.5 py-1.5 uppercase tracking-wider transition-colors ${
                  tab === t
                    ? "bg-[color-mix(in_oklab,var(--violet)_14%,var(--surface))] text-[var(--violet)] font-semibold"
                    : "hover:bg-[var(--surface-soft)] text-[var(--text-muted)]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <button
            onClick={copyValue}
            className="btn-ghost text-xs h-8 px-2.5"
            aria-label="Copy citation"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                Copy
              </>
            )}
          </button>
        </div>
      </div>
      {tab === "bibtex" ? (
        <div className="code-slab mt-3">
          <div className="code-slab__header">
            <span className="code-slab__dots">
              <span className="code-slab__dot" style={{ background: "#ef4444" }} />
              <span className="code-slab__dot" style={{ background: "#f59e0b" }} />
              <span className="code-slab__dot" style={{ background: "#10b981" }} />
            </span>
            <span>BibTeX</span>
          </div>
          <pre className="code-slab__body">{citation.bibtex || "—"}</pre>
        </div>
      ) : (
        <p className="mt-3 text-sm leading-relaxed text-[var(--text-soft)]">
          {value || "—"}
        </p>
      )}
    </motion.div>
  );
}
