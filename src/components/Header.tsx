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
        <Link href="/" className="flex items-center gap-2.5 group">
          <BrandMark className="h-9 w-9 transition-transform duration-300 group-hover:rotate-[-4deg]" />
          <div className="leading-tight">
            <div className="font-semibold text-[var(--text)] text-[1.05rem] tracking-tight">
              Quilix
            </div>
            <div className="text-[0.68rem] text-[var(--text-muted)] tracking-wide uppercase">
              Paper Synthesis
            </div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-sm text-[var(--text-soft)]">
          <a href="#how" className="hover:text-[var(--text)] transition-colors">
            How it works
          </a>
          <a href="#features" className="hover:text-[var(--text)] transition-colors">
            Features
          </a>
          <a href="#analyze" className="hover:text-[var(--text)] transition-colors">
            Analyze
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <a href="#analyze" className="btn-primary hidden sm:inline-flex text-sm">
            Get started
          </a>
        </div>
      </div>
    </header>
  );
}
