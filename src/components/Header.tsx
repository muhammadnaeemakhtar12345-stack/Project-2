"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useScroll } from "framer-motion";
import { ThemeToggle } from "./ThemeToggle";
import { BrandMark } from "./BrandMark";

export function Header() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const unsub = scrollY.on("change", (v) => setScrolled(v > 24));
    return () => unsub();
  }, [scrollY]);

  return (
    <header
      className={`header sticky top-0 z-40 ${scrolled ? "header-scrolled" : ""}`}
    >
      <div className="mx-auto max-w-6xl px-5 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <BrandMark className="h-8 w-8 transition-transform duration-500 group-hover:-translate-y-0.5" />
          <div className="leading-tight">
            <div className="font-serif text-[1.25rem] tracking-tight text-[var(--ink)]">
              Quilix
            </div>
            <div className="text-[0.62rem] tracking-[0.22em] uppercase text-[var(--text-muted)] -mt-0.5">
              Synthesis &amp; rewrite
            </div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-[0.92rem] text-[var(--text-soft)]">
          <a
            href="#how"
            className="relative hover:text-[var(--ink)] transition-colors after:absolute after:left-0 after:right-0 after:-bottom-1 after:h-px after:scale-x-0 after:origin-left after:bg-[var(--ink)] after:transition-transform after:duration-300 hover:after:scale-x-100"
          >
            Workflow
          </a>
          <a
            href="#features"
            className="relative hover:text-[var(--ink)] transition-colors after:absolute after:left-0 after:right-0 after:-bottom-1 after:h-px after:scale-x-0 after:origin-left after:bg-[var(--ink)] after:transition-transform after:duration-300 hover:after:scale-x-100"
          >
            Edition
          </a>
          <a
            href="#analyze"
            className="relative hover:text-[var(--ink)] transition-colors after:absolute after:left-0 after:right-0 after:-bottom-1 after:h-px after:scale-x-0 after:origin-left after:bg-[var(--ink)] after:transition-transform after:duration-300 hover:after:scale-x-100"
          >
            Analyze
          </a>
        </nav>

        <div className="flex items-center gap-2.5">
          <ThemeToggle />
          <a href="#analyze" className="btn-primary hidden sm:inline-flex">
            Begin a synthesis
          </a>
        </div>
      </div>
    </header>
  );
}
