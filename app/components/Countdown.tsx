// components/Countdown.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

type Props = { targetDate?: string };
const DEFAULT_TARGET = "2025-11-26T22:30:00+05:30"; // 26 Nov 2025, 10:30 PM IST

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function AnimatedNumber({ value }: { value: number | string }) {
  // simple motion span (no hooks) — keyed by value when used
  return (
    <motion.span
      key={String(value)}
      initial={{ opacity: 0, y: 6, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 160, damping: 16 }}
      className="text-4xl font-extrabold tabular-nums"
      aria-hidden="true"
    >
      {value}
    </motion.span>
  );
}

function Ring({ size = 80, stroke = 6, progress = 0 }: { size?: number; stroke?: number; progress: number }) {
  const center = size / 2;
  const radius = center - stroke;
  const circumference = 2 * Math.PI * radius;
  const dash = Math.max(0, Math.min(1, progress)) * circumference;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
      <defs>
        <linearGradient id="gradient1" x1="0" x2="1">
          <stop offset="0%" stopColor="#f472b6" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
      </defs>

      <circle cx={center} cy={center} r={radius} stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} fill="none" />
      <motion.circle
        cx={center}
        cy={center}
        r={radius}
        stroke="url(#gradient1)"
        strokeWidth={stroke}
        strokeLinecap="round"
        fill="none"
        strokeDasharray={`${dash} ${circumference - dash}`}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: circumference - dash }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        transform={`rotate(-90 ${center} ${center})`}
      />
    </svg>
  );
}

export default function Countdown({ targetDate = DEFAULT_TARGET }: Props) {
  const target = useMemo(() => new Date(targetDate).getTime(), [targetDate]);

  // mounted === whether we are running on client; used to avoid SSR/client mismatch
  const [mounted, setMounted] = useState(false);

  // 'now' only starts updating on client, after mount
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    // mark mounted so we render time-dependent UI only on client
    setMounted(true);
    setNow(Date.now());

    const id = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(id);
  }, []);

  // If not mounted or now is null, render a non-time-dependent skeleton that matches client initial render.
  if (!mounted || now === null) {
    return (
      <section id="countdown" className="scroll-mt-24 py-10">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h2 className="text-3xl font-semibold tracking-tight">Countdown to our Day 💍</h2>
          <p className="mt-2 text-sm text-slate-400">The moment we’ve been waiting for is getting closer...</p>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {["Days", "Hours", "Min", "Sec"].map((label) => (
              <div key={label} className="flex flex-col items-center gap-3 rounded-2xl bg-slate-800/60 py-6 px-4 shadow-md w-full">
                {/* render placeholder ring & placeholder numbers, same DOM shape as final, to avoid layout shift */}
                <div className="opacity-50">
                  <Ring size={90} stroke={6} progress={0} />
                </div>
                <span className="text-4xl font-extrabold tabular-nums">--</span>
                <div className="text-xs uppercase tracking-wide text-slate-400">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Now compute time normally — this runs only on client
  const diff = Math.max(0, target - now);
  const totalSeconds = Math.floor(diff / 1000);
  const seconds = totalSeconds % 60;
  const minutes = Math.floor(totalSeconds / 60) % 60;
  const hours = Math.floor(totalSeconds / 3600) % 24;
  const days = Math.floor(totalSeconds / 3600 / 24);
  const isDone = diff <= 0;

  const buckets: [string, string | number, number][] = [
    ["Days", String(days), days === 0 ? 0 : Math.min(1, days / (days + 1))],
    ["Hours", pad(hours), hours / 24],
    ["Min", pad(minutes), minutes / 60],
    ["Sec", pad(seconds), seconds / 60],
  ];

  return (
    <section id="countdown" className="scroll-mt-24 py-10">
      <div className="mx-auto max-w-6xl px-4 text-center">
        <h2 className="text-3xl font-semibold tracking-tight">Countdown to our Day 💍</h2>
        <p className="mt-2 text-sm text-slate-400">The moment we’ve been waiting for is getting closer...</p>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {buckets.map(([label, value, progress]) => (
            <div key={label as string} className="flex flex-col items-center gap-3 rounded-2xl bg-slate-800/60 py-6 px-4 shadow-md w-full">
              <Ring size={90} stroke={6} progress={Number(progress)} />
              {/* Use a motion.span keyed by value — stable hook order */}
              <motion.span
                key={String(value)}
                initial={{ opacity: 0, y: 6, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 160, damping: 16 }}
                className="text-4xl font-extrabold tabular-nums"
                aria-hidden="true"
              >
                {value}
              </motion.span>
              <div className="text-xs uppercase tracking-wide text-slate-400">{label}</div>
            </div>
          ))}
        </div>

        {isDone && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-6 text-xl font-semibold text-pink-300">
            It's Wedding Day! 🎉💗
          </motion.div>
        )}

        <div className="sr-only" aria-live="polite">
          {isDone ? "The wedding has started." : `Time left: ${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds.`}
        </div>
      </div>
    </section>
  );
}
