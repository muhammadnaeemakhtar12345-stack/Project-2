"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  Brain,
  Layers,
  ShieldCheck,
  Quote,
  Sparkles,
  FileText,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  body: string;
  accent: "violet" | "fuchsia" | "sky" | "emerald" | "amber" | "rose";
}

const items: Feature[] = [
  {
    icon: Brain,
    title: "Reads like a senior reviewer",
    body: "Scores clarity, novelty, rigor and impact — and explains each judgement, not just a one-paragraph summary.",
    accent: "violet",
  },
  {
    icon: Layers,
    title: "Section-by-section synthesis",
    body: "Abstract through Conclusion — each rewritten in 3-6 sentences with bullet-ready key points.",
    accent: "sky",
  },
  {
    icon: ShieldCheck,
    title: "Plagiarism-safe rewriting",
    body: "Every paragraph is rephrased structurally — no shared six-word spans with the source paper.",
    accent: "emerald",
  },
  {
    icon: Quote,
    title: "Citations done for you",
    body: "Detected references are reformatted into APA, MLA and BibTeX, ready to paste into your work.",
    accent: "fuchsia",
  },
  {
    icon: Sparkles,
    title: "Originality scoring",
    body: "A grade letter and 0-100 score on how independent your rewrite is from the source phrasing.",
    accent: "amber",
  },
  {
    icon: FileText,
    title: "Branded PDF deliverable",
    body: "Multi-page report with cover, score ring, executive summary and quote slabs — portfolio-grade output.",
    accent: "rose",
  },
];

const accentMap: Record<string, { fg: string; bg: string }> = {
  violet: {
    fg: "var(--violet)",
    bg: "color-mix(in oklab, var(--violet) 12%, var(--surface))",
  },
  fuchsia: {
    fg: "var(--fuchsia)",
    bg: "color-mix(in oklab, var(--fuchsia) 12%, var(--surface))",
  },
  sky: {
    fg: "var(--sky)",
    bg: "color-mix(in oklab, var(--sky) 12%, var(--surface))",
  },
  emerald: {
    fg: "var(--emerald)",
    bg: "color-mix(in oklab, var(--emerald) 14%, var(--surface))",
  },
  amber: {
    fg: "var(--amber)",
    bg: "color-mix(in oklab, var(--amber) 14%, var(--surface))",
  },
  rose: {
    fg: "var(--rose)",
    bg: "color-mix(in oklab, var(--rose) 14%, var(--surface))",
  },
};

export function Features() {
  const reduced = useReducedMotion();
  return (
    <section
      id="features"
      className="mx-auto max-w-6xl px-5 py-20 sm:py-28 relative"
    >
      <div className="ornament mb-14">
        <span className="ornament__diamond" />
      </div>

      <div className="mx-auto max-w-2xl text-center">
        <div className="cap-pill justify-center">What you get</div>
        <h2 className="headline-serif mt-6 text-[clamp(2rem,4.4vw,3.2rem)] leading-[1.04] text-[var(--ink)]">
          A research <em>deliverable</em>, not a chat reply.
        </h2>
        <p className="mt-5 text-[var(--text-soft)] leading-[1.7]">
          Six features that turn a thirty-page PDF into a study-ready brief —
          without burying citations or clipping structure.
        </p>
      </div>

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it, i) => {
          const a = accentMap[it.accent];
          return (
            <motion.div
              key={it.title}
              initial={reduced ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{
                duration: 0.55,
                delay: i * 0.06,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="feature-card group relative"
              style={
                {
                  "--accent": a.fg,
                } as React.CSSProperties
              }
            >
              <div className="feature-card__inner">
                <span
                  className="feature-card__icon"
                  style={{ background: a.bg, color: a.fg }}
                >
                  <it.icon className="h-[22px] w-[22px]" />
                </span>
                <h3 className="mt-5 headline-serif text-[1.36rem] leading-[1.2] text-[var(--ink)]">
                  {it.title}
                </h3>
                <p className="mt-2.5 text-[14.5px] text-[var(--text-soft)] leading-[1.65]">
                  {it.body}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
