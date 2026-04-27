"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";

interface Step {
  title: string;
  body: string;
  margin: string;
}

const steps: Step[] = [
  {
    title: "Drop in a paper",
    body: "Upload any research PDF. Quilix parses it locally in your browser before any text leaves the page.",
    margin: "Browser-side parsing — privacy-first.",
  },
  {
    title: "Section-aware reading",
    body: "Quilix detects Abstract, Methods, Results, Discussion and Conclusion, and summarises each in plain English.",
    margin: "Headings stay intact; structure is preserved.",
  },
  {
    title: "Plagiarism-free rewrites",
    body: "Every section is rewritten in your chosen voice — academic, concise, or neutral — never echoing source phrasing.",
    margin: "Voice toggle in the analyze toolbar.",
  },
  {
    title: "Citations, three ways",
    body: "References are extracted and reformatted into APA, MLA and BibTeX, ready to paste into your manuscript.",
    margin: "Copy or download per format.",
  },
  {
    title: "A branded edition",
    body: "Download a polished, multi-page PDF — cover with originality score, executive summary, and per-section synthesis.",
    margin: "Filename: quilix-report-<timestamp>.pdf",
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
        duration: 0.5,
        delay: i * 0.06,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      },
    }),
  };

  return (
    <section id="how" className="mx-auto max-w-5xl px-5 py-20 sm:py-28">
      <div className="ornament mb-14">
        <span className="ornament__diamond" />
      </div>

      <div className="max-w-2xl">
        <div className="cap-pill">The workflow</div>
        <h2 className="headline-serif mt-6 text-[clamp(2rem,4.4vw,3.2rem)] leading-[1.04] text-[var(--ink)]">
          Five quiet steps from <em>raw paper</em> to polished edition.
        </h2>
        <p className="mt-5 text-[var(--text-soft)] leading-[1.7] max-w-xl">
          No dashboards, no clutter — just a calm reading pipeline built for
          students, reviewers, and researchers who need clarity fast.
        </p>
      </div>

      <ol className="mt-14 relative">
        {/* Vertical rule */}
        <div
          className="hidden md:block absolute left-[7.5rem] top-2 bottom-2 w-px"
          style={{
            background:
              "linear-gradient(to bottom, transparent 0%, var(--rule) 8%, var(--rule) 92%, transparent 100%)",
          }}
          aria-hidden="true"
        />

        {steps.map((s, i) => (
          <motion.li
            key={s.title}
            initial={reduced ? false : "hidden"}
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            custom={i}
            variants={variants}
            className="relative grid md:grid-cols-[7rem_1fr] gap-x-8 gap-y-3 py-7 md:py-8 border-t border-[var(--rule)] first:border-t-0"
          >
            {/* Folio number */}
            <div className="md:text-right relative">
              <span className="folio text-[1.6rem] sm:text-[1.85rem]">
                {String(i + 1).padStart(2, "0")}
              </span>
              {/* Center dot on the rule */}
              <span
                className="hidden md:block absolute right-[-0.5rem] top-3 h-2 w-2 rounded-full"
                style={{
                  background: "var(--ink)",
                  boxShadow: "0 0 0 4px var(--bg)",
                }}
                aria-hidden="true"
              />
            </div>

            <div className="md:pl-7">
              <h3 className="headline-serif text-[1.55rem] sm:text-[1.7rem] leading-[1.15] text-[var(--ink)]">
                {s.title}
              </h3>
              <p className="mt-2.5 text-[var(--text-soft)] leading-[1.7] max-w-2xl">
                {s.body}
              </p>
              <p className="mt-3 font-serif italic text-[13.5px] text-[var(--tea)] leading-snug">
                <span aria-hidden="true">&#10148;&nbsp;</span>
                {s.margin}
              </p>
            </div>
          </motion.li>
        ))}
      </ol>
    </section>
  );
}
