"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Upload, BookOpen, PenLine, Quote, FileDown } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Step {
  icon: LucideIcon;
  title: string;
  body: string;
  accent: "violet" | "fuchsia" | "sky" | "emerald" | "amber";
}

const steps: Step[] = [
  {
    icon: Upload,
    title: "Drop a PDF",
    body: "Upload any research paper. We extract the text in your browser before any analysis begins.",
    accent: "violet",
  },
  {
    icon: BookOpen,
    title: "Read it for you",
    body: "Quilix detects every section — Abstract through Conclusion — and summarises each in plain English.",
    accent: "sky",
  },
  {
    icon: PenLine,
    title: "Rewrite in your own words",
    body: "Each section is paraphrased in academic, concise, or neutral tone — never copying source phrasing.",
    accent: "fuchsia",
  },
  {
    icon: Quote,
    title: "Cite three ways",
    body: "References are reformatted into APA, MLA and BibTeX, ready to paste straight into your manuscript.",
    accent: "emerald",
  },
  {
    icon: FileDown,
    title: "Download the report",
    body: "A polished, multi-page PDF with cover, originality score, executive summary and per-section detail.",
    accent: "amber",
  },
];

const accentMap: Record<string, { fg: string; bg: string; ring: string }> = {
  violet: {
    fg: "var(--violet)",
    bg: "color-mix(in oklab, var(--violet) 12%, var(--surface))",
    ring: "color-mix(in oklab, var(--violet) 50%, transparent)",
  },
  fuchsia: {
    fg: "var(--fuchsia)",
    bg: "color-mix(in oklab, var(--fuchsia) 12%, var(--surface))",
    ring: "color-mix(in oklab, var(--fuchsia) 50%, transparent)",
  },
  sky: {
    fg: "var(--sky)",
    bg: "color-mix(in oklab, var(--sky) 12%, var(--surface))",
    ring: "color-mix(in oklab, var(--sky) 50%, transparent)",
  },
  emerald: {
    fg: "var(--emerald)",
    bg: "color-mix(in oklab, var(--emerald) 14%, var(--surface))",
    ring: "color-mix(in oklab, var(--emerald) 50%, transparent)",
  },
  amber: {
    fg: "var(--amber)",
    bg: "color-mix(in oklab, var(--amber) 14%, var(--surface))",
    ring: "color-mix(in oklab, var(--amber) 50%, transparent)",
  },
};

export function HowItWorks() {
  const reduced = useReducedMotion();
  const variants: Variants = {
    hidden: { opacity: 0, y: 18 },
    show: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.55,
        delay: i * 0.07,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      },
    }),
  };

  return (
    <section id="how" className="mx-auto max-w-6xl px-5 py-20 sm:py-28 relative">
      <div className="ornament mb-14">
        <span className="ornament__diamond" />
      </div>

      <div className="mx-auto max-w-2xl text-center">
        <div className="cap-pill justify-center">How it works</div>
        <h2 className="headline-serif mt-6 text-[clamp(2rem,4.4vw,3.2rem)] leading-[1.04] text-[var(--ink)]">
          Five quiet steps from <em>raw paper</em> to polished report.
        </h2>
        <p className="mt-5 text-[var(--text-soft)] leading-[1.7]">
          A focused workflow, no clutter — designed for students and
          researchers who need clarity fast.
        </p>
      </div>

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {steps.map((s, i) => {
          const a = accentMap[s.accent];
          return (
            <motion.div
              key={s.title}
              initial={reduced ? false : "hidden"}
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              custom={i}
              variants={variants}
              className="step-card group relative"
              style={
                {
                  "--accent": a.fg,
                  "--accent-bg": a.bg,
                  "--accent-ring": a.ring,
                } as React.CSSProperties
              }
            >
              <div className="step-card__inner">
                <div className="flex items-start justify-between mb-5">
                  <span
                    className="step-card__icon"
                    style={{ background: a.bg, color: a.fg }}
                  >
                    <s.icon className="h-5 w-5" />
                  </span>
                  <span className="folio text-[1.05rem]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="headline-serif text-[1.32rem] leading-[1.2] text-[var(--ink)]">
                  {s.title}
                </h3>
                <p className="mt-2.5 text-[14px] text-[var(--text-soft)] leading-[1.65]">
                  {s.body}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
