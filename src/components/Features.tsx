"use client";

import { motion, useReducedMotion } from "framer-motion";

interface Feature {
  num: string;
  title: string;
  body: string;
}

const items: Feature[] = [
  {
    num: "I",
    title: "Reads like a senior reviewer",
    body: "Quilix scores clarity, novelty, rigor and impact — and explains its reasoning. Not a one-paragraph summary; a structured editorial pass.",
  },
  {
    num: "II",
    title: "Section-by-section synthesis",
    body: "Abstract through Conclusion, each rewritten in three to six sentences with bulletable key points and an original-gist line.",
  },
  {
    num: "III",
    title: "Plagiarism-safe rewriting",
    body: "Every paragraph is rephrased structurally — no shared six-word spans with the source — and graded against an originality rubric.",
  },
  {
    num: "IV",
    title: "Citations, three editions",
    body: "Detected references are reformatted into APA, MLA and BibTeX. Copy them inline, or pull the BibTeX block into your manuscript.",
  },
  {
    num: "V",
    title: "Originality scoring",
    body: "A grade letter plus a 0–100 score on how independent your rewrite reads — alongside concrete suggestions to lift it further.",
  },
  {
    num: "VI",
    title: "A branded edition",
    body: "Download a multi-page PDF with cover, score ring, executive summary, quote slabs and footnotes. Portfolio-grade, never markdown.",
  },
];

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

      <div className="grid lg:grid-cols-12 gap-10">
        {/* Left rail — heading + pull quote */}
        <div className="lg:col-span-5 lg:sticky lg:top-28 self-start">
          <div className="cap-pill">The edition</div>
          <h2 className="headline-serif mt-6 text-[clamp(2rem,4.4vw,3.2rem)] leading-[1.04] text-[var(--ink)]">
            Built like a research <em>deliverable</em>, not a chat reply.
          </h2>
          <p className="mt-5 text-[var(--text-soft)] leading-[1.7]">
            Six features that turn a thirty-page PDF into a study-ready brief —
            without burying the citations or clipping the structure.
          </p>

          <figure
            className="mt-9 pl-5 border-l-2"
            style={{ borderColor: "var(--violet)" }}
          >
            <blockquote className="font-serif italic text-[1.18rem] leading-[1.45] text-[var(--ink)]">
              &ldquo;A calm reading layer over the whole literature — citations,
              voice, and originality, set with care.&rdquo;
            </blockquote>
            <figcaption className="mt-3 text-[11px] tracking-[0.22em] uppercase text-[var(--text-muted)]">
              Quilix &middot; Editorial principle
            </figcaption>
          </figure>
        </div>

        {/* Right column — editorial entries */}
        <ol className="lg:col-span-7 space-y-0">
          {items.map((it, i) => (
            <motion.li
              key={it.title}
              initial={reduced ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.5,
                delay: i * 0.05,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group grid grid-cols-[3.4rem_1fr] gap-x-6 py-7 border-t border-[var(--rule)] first:border-t-0"
            >
              <div className="folio text-[1.35rem] sm:text-[1.55rem] pt-0.5 transition-colors duration-300 group-hover:text-[var(--violet)]">
                {it.num}
              </div>
              <div>
                <h3 className="headline-serif text-[1.4rem] sm:text-[1.55rem] leading-[1.18] text-[var(--ink)]">
                  {it.title}
                </h3>
                <p className="mt-2 text-[var(--text-soft)] leading-[1.7] max-w-2xl">
                  {it.body}
                </p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
