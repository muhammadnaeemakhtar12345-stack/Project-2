import * as React from "react";

export function BrandMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="qx-grad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="50%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#db2777" />
        </linearGradient>
      </defs>
      <rect x="4" y="4" width="56" height="56" rx="14" fill="url(#qx-grad)" />
      <path
        d="M22 18 L42 18 Q47 18 47 23 L47 41 Q47 46 42 46 L24 46 Q22 46 22 44 Z"
        fill="rgba(255,255,255,0.18)"
        stroke="rgba(255,255,255,0.85)"
        strokeWidth="2.2"
      />
      <path
        d="M30 28 L40 28 M30 34 L38 34"
        stroke="white"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M40 44 L50 54"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="50" cy="54" r="3" fill="white" />
    </svg>
  );
}
