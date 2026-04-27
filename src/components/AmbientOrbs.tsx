"use client";
import { useReducedMotion } from "framer-motion";

export function AmbientOrbs() {
  const reduced = useReducedMotion();
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      <div
        className={`orb ${reduced ? "" : "float-y"}`}
        style={{
          background: "radial-gradient(circle at center, #c4b5fd, transparent 65%)",
          width: 520,
          height: 520,
          top: -160,
          left: -120,
        }}
      />
      <div
        className={`orb ${reduced ? "" : "float-y"}`}
        style={{
          background: "radial-gradient(circle at center, #f9a8d4, transparent 65%)",
          width: 460,
          height: 460,
          top: 80,
          right: -120,
          animationDelay: "-3s",
        }}
      />
      <div
        className={`orb ${reduced ? "" : "float-y"}`}
        style={{
          background: "radial-gradient(circle at center, #93c5fd, transparent 70%)",
          width: 520,
          height: 520,
          top: 520,
          left: "30%",
          animationDelay: "-6s",
        }}
      />
    </div>
  );
}
