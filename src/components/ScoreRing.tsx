"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  animate,
} from "framer-motion";
import { useEffect, useState } from "react";

interface Props {
  value: number; // 0-100
  size?: number;
  stroke?: number;
  label?: string;
}

const colorFor = (v: number) => {
  if (v >= 85) return "#059669";
  if (v >= 70) return "#7c3aed";
  if (v >= 55) return "#d97706";
  return "#e11d48";
};

export function ScoreRing({
  value,
  size = 116,
  stroke = 10,
  label = "/100",
}: Props) {
  const reduced = useReducedMotion();
  const motionValue = useMotionValue(reduced ? value : 0);
  const display = useTransform(motionValue, (v) => Math.round(v));
  const [shown, setShown] = useState(reduced ? value : 0);

  useEffect(() => {
    if (reduced) {
      motionValue.set(value);
      setShown(value);
      return;
    }
    const ctrl = animate(motionValue, value, {
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1],
    });
    const unsub = display.on("change", (v) => setShown(v));
    return () => {
      ctrl.stop();
      unsub();
    };
  }, [value, motionValue, display, reduced]);

  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (Math.min(100, Math.max(0, shown)) / 100) * c;
  const color = colorFor(value);

  return (
    <div
      className="relative grid place-items-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--border)"
          strokeWidth={stroke}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center px-2">
        <div
          style={{
            maxWidth: size - stroke * 2 - 6,
            lineHeight: 1,
          }}
        >
          <div
            className="font-semibold tracking-tight leading-none"
            style={{
              color,
              fontSize: Math.max(18, Math.round(size * 0.28)),
            }}
          >
            {shown}
          </div>
          <div
            className="mt-1 uppercase text-[var(--text-muted)] font-medium"
            style={{
              fontSize: Math.max(8, Math.round(size * 0.085)),
              letterSpacing: "0.12em",
              lineHeight: 1.05,
            }}
          >
            {label}
          </div>
        </div>
      </div>
    </div>
  );
}
