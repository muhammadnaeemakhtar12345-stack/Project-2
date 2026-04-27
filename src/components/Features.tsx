"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  Brain,
  Layers,
  Quote,
  ShieldCheck,
  Sparkles,
  FileText,
} from "lucide-react";

const items = [
  {
    icon: Brain,
    title: "Reads like a senior reviewer",
    body: "A structured analyst that scores clarity, novelty, rigor and impact — not just a one-paragraph summary.",
    accent: "violet",
  },
  {
    icon: Layers,
    title: "Section-by-section synthesis",
    body: "Abstract through Conclusion, each rewritten in 3–6 sentences with bulletable key points.",
    accent: "fuchsia",
  },
  {
    icon: ShieldCheck,
    title: "Plagiarism-safe rewriting",
    body: "Every paragraph is rephrased structurally — no shared 6-word spans with the source.",
    accent: "emerald",
  },
  {
    icon: Quote,
    title: "Citations done for you",
    body: "Detected references are reformatted into APA, MLA and BibTeX — ready to paste into your paper.",
    accent: "sky",
  },
  {
    icon: Sparkles,
    title: "Originality scoring",
    body: "A grade letter and 0–100 score on how independent your rewrite is from the source.",
    accent: "amber",
  },
  {
    icon: FileText,
    title: "Branded PDF deliverable",
    body: "Cover page with score ring, executive summary, quote slabs and footer — portfolio-grade output.",
    accent: "violet",
  },
];

const accentClass: Record<string, string> = {
  violet: "bg-[color-mix(in_oklab,var(--violet)_12%,var(--surface))] text-[var(--violet)]",
  fuchsia: "bg-[color-mix(in_oklab,var(--fuchsia)_12%,var(--surface))] text-[var(--fuchsia)]",
  emerald: "bg-[color-mix(in_oklab,var(--emerald)_14%,var(--surface))] text-[var(--emerald)]",
  sky: "bg-[color-mix(in_oklab,var(--sky)_14%,var(--surface))] text-[var(--sky)]",
  amber: "bg-[color-mix(in_oklab,var(--amber)_14%,var(--surface))] text-[var(--amber)]",
};

export function Features() {
  const reduced = useReducedMotion();
  return (
    <section id="features" className="mx-auto max-w-6xl px-5 py-16 sm:py-24">
      <div className="max-w-2xl">
        <span className="cap-pill mb-4 inline-flex">What you get</span>
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight section-rail">
          Built like a research deliverable, not a chat reply.
        </h2>
        <p className="mt-3 text-[var(--text-soft)] leading-relaxed">
          Six features that turn a 30-page PDF into a study-ready brief — without
          burying the citations.
        </p>
      </div>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it, i) => (
          <motion.div
            key={it.title}
            initial={reduced ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{
              duration: 0.45,
              delay: i * 0.04,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="card card-lift p-5"
          >
            <div
              className={`mb-3.5 grid h-11 w-11 place-items-center rounded-xl ${
                accentClass[it.accent]
              }`}
            >
              <it.icon className="h-5 w-5" />
            </div>
            <h3 className="font-semibold tracking-tight">{it.title}</h3>
            <p className="mt-1.5 text-sm text-[var(--text-soft)] leading-relaxed">
              {it.body}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
