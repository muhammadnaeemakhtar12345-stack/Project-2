"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { AmbientOrbs } from "./AmbientOrbs";

export function Hero() {
  const reduced = useReducedMotion();
  const initial = reduced ? false : { opacity: 0, y: 20 };
  const animate = { opacity: 1, y: 0 };

  return (
    <section className="relative pt-16 pb-12 sm:pt-24 sm:pb-20 overflow-hidden">
      <AmbientOrbs />
      <div className="mx-auto max-w-5xl px-5 text-center relative">
        <motion.span
          initial={initial}
          animate={animate}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="cap-pill"
        >
          <Sparkles className="h-3.5 w-3.5" />
          AI Research Intelligence
        </motion.span>

        <motion.h1
          initial={initial}
          animate={animate}
          transition={{ duration: 0.6, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 text-[clamp(2.4rem,5.6vw,4rem)] font-semibold leading-[1.04] tracking-tight"
        >
          Read less. Understand more.
          <br />
          <span className="gradient-text-shimmer">Cite without copying.</span>
        </motion.h1>

        <motion.p
          initial={initial}
          animate={animate}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-5 max-w-2xl text-[1.05rem] text-[var(--text-soft)] leading-relaxed"
        >
          Drop in a research paper and Quilix returns a section-by-section
          synthesis, a plagiarism-free rewrite in your own voice, and ready-to-cite
          references — all in a polished, downloadable report.
        </motion.p>

        <motion.div
          initial={initial}
          animate={animate}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <a href="#analyze" className="btn-primary text-sm">
            Upload a paper <ArrowRight className="h-4 w-4" />
          </a>
          <a href="#how" className="btn-ghost text-sm">
            See how it works
          </a>
        </motion.div>

        <motion.div
          initial={initial}
          animate={animate}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-[var(--text-muted)]"
        >
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--violet)]" />
            Section-aware summaries
          </span>
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--fuchsia)]" />
            Plagiarism-free rewrites
          </span>
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--sky)]" />
            APA · MLA · BibTeX citations
          </span>
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--emerald)]" />
            Branded PDF report
          </span>
        </motion.div>
      </div>
    </section>
  );
}
