"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Quote } from "lucide-react";

/**
 * Hero visual — a stacked editorial paper mockup with annotations,
 * a citation pull, and a calm score badge. Establishes Quilix's
 * scholarly identity and is intentionally distinct from any
 * code-tool / dashboard hero pattern.
 */
export function PaperMockup() {
  const reduced = useReducedMotion();
  const fade = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 14 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    <div className="relative aspect-[5/6] w-full max-w-md mx-auto">
      {/* Back paper (rotated, behind) */}
      <motion.div
        {...fade(0.05)}
        className="paper-card absolute inset-0 -rotate-[5deg] translate-x-3 translate-y-2 opacity-70"
      />

      {/* Front paper */}
      <motion.div
        {...fade(0.1)}
        className="paper-card absolute inset-0 rotate-[1.2deg] p-6 sm:p-7 overflow-hidden"
      >
        <div className="relative z-10">
          {/* Header — folio + journal name */}
          <div className="flex items-center justify-between text-[10px] tracking-[0.22em] uppercase text-[color-mix(in_oklab,var(--ink)_55%,transparent)]">
            <span className="font-serif italic normal-case tracking-normal text-[12px] text-[var(--tea)]">
              Vol. I &middot; No. 1
            </span>
            <span>Synthesis Brief</span>
          </div>

          <div
            className="mt-3 h-px w-full"
            style={{
              background:
                "linear-gradient(90deg, transparent, color-mix(in oklab, var(--ink) 30%, transparent), transparent)",
            }}
          />

          {/* Title — serif, italic accent */}
          <h3 className="mt-5 font-serif text-[1.45rem] leading-[1.15] text-[var(--ink)] tracking-tight">
            Latent Diffusion Models for{" "}
            <em className="text-[var(--violet)]">High-Resolution</em> Image
            Synthesis
          </h3>

          {/* Authors (editorial small-caps treatment) */}
          <div className="mt-2.5 text-[11px] tracking-[0.18em] uppercase text-[color-mix(in_oklab,var(--ink)_55%,transparent)]">
            Rombach &middot; Blattmann &middot; Lorenz
          </div>

          {/* Section label + lines */}
          <div className="mt-5 flex items-center gap-2 text-[10px] tracking-[0.22em] uppercase text-[var(--tea)] font-semibold">
            <span className="folio not-italic font-serif text-[var(--tea)] text-[14px]">
              §1
            </span>
            <span>Abstract</span>
          </div>

          {/* Lines mimicking text */}
          <div className="mt-2 space-y-2">
            <Line w="100%" />
            <Line w="96%" />
            <Line w="88%" highlight />
            <Line w="92%" />
            <Line w="78%" />
          </div>

          {/* Pull-quote — paraphrase chip */}
          <motion.div
            {...fade(0.4)}
            className="mt-5 rounded-md border border-[color-mix(in_oklab,var(--violet)_30%,transparent)] bg-[color-mix(in_oklab,var(--violet)_8%,var(--paper))] px-3.5 py-3"
          >
            <div className="flex items-start gap-2.5">
              <Quote className="h-3.5 w-3.5 text-[var(--violet)] mt-1 shrink-0" />
              <div>
                <div className="text-[9.5px] tracking-[0.22em] uppercase text-[var(--violet)] font-bold">
                  Plagiarism-free rewrite
                </div>
                <p className="mt-1 text-[12.5px] leading-[1.55] text-[var(--ink-soft)] font-serif italic">
                  &ldquo;A diffusion approach that operates in a compressed
                  latent space — preserving fidelity while cutting compute by
                  roughly an order of magnitude.&rdquo;
                </p>
              </div>
            </div>
          </motion.div>

          {/* Citation chips */}
          <motion.div {...fade(0.5)} className="mt-4 flex flex-wrap gap-1.5">
            <CitationChip color="violet" label="APA" />
            <CitationChip color="sky" label="MLA" />
            <CitationChip color="tea" label="BibTeX" />
          </motion.div>
        </div>
      </motion.div>

      {/* Floating score badge */}
      <motion.div
        {...fade(0.6)}
        className="absolute -right-3 -top-3 sm:-right-6 sm:-top-6 z-20"
      >
        <div className="relative grid place-items-center h-[88px] w-[88px] sm:h-[104px] sm:w-[104px]">
          <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90">
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="color-mix(in oklab, var(--ink) 12%, transparent)"
              strokeWidth="6"
            />
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="var(--violet)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 42}`}
              strokeDashoffset={`${2 * Math.PI * 42 * (1 - 0.92)}`}
            />
          </svg>
          <div
            className="grid place-items-center h-[68px] w-[68px] sm:h-[82px] sm:w-[82px] rounded-full"
            style={{
              background: "var(--paper)",
              boxShadow:
                "inset 0 0 0 1px var(--paper-edge), 0 14px 30px -16px rgba(17,11,44,0.35)",
            }}
          >
            <div className="text-center leading-none">
              <div className="font-serif text-[1.65rem] sm:text-[2rem] font-semibold text-[var(--ink)]">
                92
              </div>
              <div className="mt-0.5 text-[8.5px] tracking-[0.22em] uppercase text-[color-mix(in_oklab,var(--ink)_55%,transparent)]">
                Originality
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Margin annotation */}
      <motion.div
        {...fade(0.7)}
        className="hidden sm:block absolute -left-12 top-[42%] -rotate-[6deg] text-[var(--tea)] font-serif italic text-[13px] leading-snug max-w-[120px]"
      >
        <span aria-hidden="true">&#10148;</span> section detected,
        rewritten in your own words
      </motion.div>
    </div>
  );
}

function Line({ w, highlight = false }: { w: string; highlight?: boolean }) {
  return (
    <div
      className="h-[8px] rounded-sm"
      style={{
        width: w,
        background: highlight
          ? "color-mix(in oklab, var(--violet) 28%, transparent)"
          : "color-mix(in oklab, var(--ink) 14%, transparent)",
      }}
    />
  );
}

function CitationChip({
  color,
  label,
}: {
  color: "violet" | "sky" | "tea";
  label: string;
}) {
  const map: Record<string, { fg: string; bg: string }> = {
    violet: { fg: "var(--violet)", bg: "color-mix(in oklab, var(--violet) 12%, var(--paper))" },
    sky: { fg: "var(--sky)", bg: "color-mix(in oklab, var(--sky) 14%, var(--paper))" },
    tea: { fg: "var(--tea)", bg: "color-mix(in oklab, var(--tea) 18%, var(--paper))" },
  };
  const c = map[color];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[9.5px] tracking-[0.18em] uppercase font-bold"
      style={{ color: c.fg, background: c.bg }}
    >
      <span
        className="h-1 w-1 rounded-full"
        style={{ background: c.fg }}
      />
      {label}
    </span>
  );
}
