import { BrandMark } from "./BrandMark";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-24 border-t border-[var(--rule)]">
      <div className="mx-auto max-w-6xl px-5 py-12">
        <div className="ornament mb-10">
          <span className="ornament__diamond" />
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-3">
            <BrandMark className="h-7 w-7" />
            <div className="leading-tight">
              <div className="font-serif text-[1.05rem] tracking-tight text-[var(--ink)]">
                Quilix
              </div>
              <div className="text-[10px] tracking-[0.22em] uppercase text-[var(--text-muted)] -mt-0.5">
                Synthesis &amp; rewrite
              </div>
            </div>
          </div>
          <div className="font-serif italic text-[var(--text-soft)] text-[14px] tracking-tight">
            Read less. Understand more. Cite without copying.
          </div>
          <div className="text-[11px] tracking-[0.18em] uppercase text-[var(--text-muted)]">
            © {year} Quilix &middot; All rights reserved
          </div>
        </div>
      </div>
    </footer>
  );
}
