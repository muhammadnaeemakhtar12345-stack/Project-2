import * as React from "react";

/**
 * Quilix mark — a folded research page with a quill-stroke spine.
 * Editorial, scholarly, monochromatic ink — no rainbow gradient.
 */
export function BrandMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="qx-paper" x1="0" y1="0" x2="0" y2="64">
          <stop offset="0%" stopColor="var(--paper)" />
          <stop offset="100%" stopColor="var(--paper-edge)" />
        </linearGradient>
      </defs>
      {/* page body */}
      <path
        d="M14 8 L42 8 L54 20 L54 56 Q54 58 52 58 L14 58 Q12 58 12 56 L12 10 Q12 8 14 8 Z"
        fill="url(#qx-paper)"
        stroke="var(--ink)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* folded corner */}
      <path
        d="M42 8 L42 20 L54 20 Z"
        fill="color-mix(in oklab, var(--paper-edge) 70%, var(--ink))"
        stroke="var(--ink)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* text rules */}
      <line x1="20" y1="32" x2="46" y2="32" stroke="var(--ink)" strokeOpacity="0.32" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="20" y1="38" x2="42" y2="38" stroke="var(--ink)" strokeOpacity="0.32" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="20" y1="44" x2="38" y2="44" stroke="var(--ink)" strokeOpacity="0.32" strokeWidth="1.4" strokeLinecap="round" />
      {/* quill stroke / underline accent */}
      <path
        d="M22 50 L44 50"
        stroke="var(--violet)"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}
