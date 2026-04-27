"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { AmbientOrbs } from "./AmbientOrbs";
import { PaperMockup } from "./PaperMockup";

export function Hero() {
  const reduced = useReducedMotion();
  const initial = reduced ? false : { opacity: 0, y: 20 };
  const animate = { opacity: 1, y: 0 };

  return (
    <section className="relative pt-14 pb-16 sm:pt-20 sm:pb-24 overflow-hidden">
      <AmbientOrbs />

      <div className="mx-auto max-w-6xl px-5 relative">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* LEFT — editorial copy */}
          <div className="lg:col-span-7">
            <motion.div
              initial={initial}
              animate={animate}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="cap-pill"
            >
              An AI study companion for researchers
            </motion.div>

            <motion.h1
              initial={initial}
              animate={animate}
              transition={{
                duration: 0.65,
                delay: 0.06,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="headline-serif mt-7 text-[clamp(2.6rem,6vw,4.6rem)] leading-[1.02] text-[var(--ink)]"
            >
              Distill any paper.
              <br />
              <em>Rewrite</em> it in your own words.
            </motion.h1>

            <motion.p
              initial={initial}
              animate={animate}
              transition={{
                duration: 0.6,
                delay: 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mt-6 max-w-xl text-[1.06rem] text-[var(--text-soft)] leading-[1.7]"
            >
              Quilix reads a research PDF, finds every section from{" "}
              <span className="font-serif italic text-[var(--ink)]">
                Abstract
              </span>{" "}
              to{" "}
              <span className="font-serif italic text-[var(--ink)]">
                Conclusion
              </span>
              , paraphrases each one in your own words, and hands back
              ready-to-cite references in APA, MLA and BibTeX — all set in a
              calm, downloadable report.
            </motion.p>

            <motion.div
              initial={initial}
              animate={animate}
              transition={{
                duration: 0.6,
                delay: 0.2,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mt-9 flex flex-wrap items-center gap-3"
            >
              <a href="#analyze" className="btn-primary">
                Begin a synthesis <ArrowRight className="h-4 w-4" />
              </a>
              <a href="#how" className="btn-ghost">
                See how it works
              </a>
            </motion.div>

            {/* Editorial pillar list — replaces tech-style colored dots row */}
            <motion.dl
              initial={initial}
              animate={animate}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-y-5 gap-x-6 max-w-2xl"
            >
              <Pillar n="01" label="Section detection" />
              <Pillar n="02" label="Plagiarism-free rewrite" />
              <Pillar n="03" label="Smart citations" />
              <Pillar n="04" label="Branded report" />
            </motion.dl>
          </div>

          {/* RIGHT — paper mockup */}
          <div className="lg:col-span-5">
            <PaperMockup />
          </div>
        </div>
      </div>
    </section>
  );
}

function Pillar({ n, label }: { n: string; label: string }) {
  return (
    <div className="border-t border-[var(--rule)] pt-3">
      <div className="folio">{n}</div>
      <div className="mt-1 text-[13px] text-[var(--text-soft)] leading-snug">
        {label}
      </div>
    </div>
  );
}
