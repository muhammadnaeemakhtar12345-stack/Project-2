"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useScroll } from "framer-motion";
import {
  SignInButton,
  SignUpButton,
  UserButton,
  useAuth,
} from "@clerk/nextjs";
import { ThemeToggle } from "./ThemeToggle";
import { BrandMark } from "./BrandMark";

export function Header() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const { isLoaded, isSignedIn } = useAuth();

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
            How it works
          </a>
          <a
            href="#features"
            className="relative hover:text-[var(--ink)] transition-colors after:absolute after:left-0 after:right-0 after:-bottom-1 after:h-px after:scale-x-0 after:origin-left after:bg-[var(--ink)] after:transition-transform after:duration-300 hover:after:scale-x-100"
          >
            Features
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
          {isLoaded && !isSignedIn && (
            <>
              <SignInButton mode="modal">
                <button className="btn-ghost text-sm">Sign in</button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="btn-primary text-sm hidden sm:inline-flex">
                  Sign up
                </button>
              </SignUpButton>
            </>
          )}
          {isLoaded && isSignedIn && (
            <>
              <a
                href="#analyze"
                className="btn-primary text-sm hidden sm:inline-flex"
              >
                Begin a synthesis
              </a>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "h-9 w-9",
                  },
                }}
              />
            </>
          )}
        </div>
      </div>
    </header>
  );
}
