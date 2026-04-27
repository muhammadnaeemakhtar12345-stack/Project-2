import { BrandMark } from "./BrandMark";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-20 border-t border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_55%,var(--bg))]">
      <div className="mx-auto max-w-6xl px-5 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-[var(--text-muted)]">
        <div className="flex items-center gap-2">
          <BrandMark className="h-6 w-6" />
          <span className="text-[var(--text)] font-medium">Quilix</span>
          <span className="opacity-60">·</span>
          <span>AI Paper Synthesis &amp; Plagiarism-Free Rewriting</span>
        </div>
        <div>© {year} Quilix. All rights reserved.</div>
      </div>
    </footer>
  );
}
