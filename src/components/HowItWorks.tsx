"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { FileUp, ScanText, PenLine, Quote, FileDown } from "lucide-react";

const steps = [
  {
    icon: FileUp,
    title: "Drop in a paper",
    body: "Upload any research PDF. Quilix parses it locally in your browser before any analysis begins.",
  },
  {
    icon: ScanText,
    title: "Section-aware reading",
    body: "We detect Abstract, Methods, Results, Discussion and more — and summarise each in plain English.",
  },
  {
    icon: PenLine,
    title: "Plagiarism-free rewrites",
    body: "Every section gets a clean, original rewrite in your voice — never copying the source phrasing.",
  },
  {
    icon: Quote,
    title: "Smart citations",
    body: "References are extracted and reformatted into APA, MLA and BibTeX — ready to drop into your paper.",
  },
  {
    icon: FileDown,
    title: "Branded PDF report",
    body: "Download a polished, multi-page report with score ring, executive summary, and quote slabs.",
  },
];

export function HowItWorks() {
  const reduced = useReducedMotion();
  const variants: Variants = {
    hidden: { opacity: 0, y: 16 },
    show: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.45,
        delay: i * 0.05,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      },
    }),
  };
  return (
    <section id="how" className="mx-auto max-w-6xl px-5 py-16 sm:py-24">
      <div className="max-w-2xl">
        <span className="cap-pill mb-4 inline-flex">How it works</span>
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight section-rail">
          Five calm steps from paper to polished output.
        </h2>
        <p className="mt-3 text-[var(--text-soft)] leading-relaxed">
          A focused workflow, no clutter — built for students, reviewers, and
          researchers who need clarity fast.
        </p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {steps.map((s, i) => (
          <motion.div
            key={s.title}
            initial={reduced ? false : "hidden"}
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            custom={i}
            variants={variants}
            className="card card-lift p-5"
          >
            <div className="mb-3.5 grid h-10 w-10 place-items-center rounded-xl bg-[color-mix(in_oklab,var(--violet)_12%,var(--surface))] text-[var(--violet)]">
              <s.icon className="h-5 w-5" />
            </div>
            <div className="text-[0.65rem] tracking-[0.18em] uppercase text-[var(--text-muted)] mb-1">
              Step {i + 1}
            </div>
            <h3 className="font-semibold tracking-tight text-[var(--text)] leading-snug">
              {s.title}
            </h3>
            <p className="mt-1.5 text-sm text-[var(--text-soft)] leading-relaxed">
              {s.body}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
