"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { Participant } from "@/types/participant";
import { secureRandomIndex } from "@/lib/secure-random";
import { playSound } from "@/lib/sound-manager";

interface RollingNamesProps {
  participants: Participant[];
  isSpinning: boolean;
  durationMs: number;
  onComplete: () => void;
}

const MIN_INTERVAL_MS = 45;
const MAX_INTERVAL_MS = 640;
const SETTLE_PAUSE_MS = 550;

function easeInCubic(t: number): number {
  return t * t * t;
}

export default function RollingNames({
  participants,
  isSpinning,
  durationMs,
  onComplete,
}: RollingNamesProps) {
  const [displayName, setDisplayName] = useState("");
  const [tick, setTick] = useState(0);
  const [progress, setProgress] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (!isSpinning || participants.length === 0) {
      setProgress(0);
      return;
    }

    const startTime = Date.now();
    let cancelled = false;

    void playSound("draw-start");

    function scheduleNext() {
      const elapsed = Date.now() - startTime;
      const t = Math.min(elapsed / durationMs, 1);
      setProgress(t);

      const index = secureRandomIndex(participants.length);
      const candidate = participants[index];
      setDisplayName(candidate ? candidate.fullName : "");
      setTick((n) => n + 1);

      if (t >= 0.7) {
        void playSound("tension");
      } else {
        void playSound("tick");
      }

      if (t >= 1 || cancelled) {
        timeoutRef.current = setTimeout(() => {
          if (!cancelled) onCompleteRef.current();
        }, SETTLE_PAUSE_MS);
        return;
      }

      const interval = MIN_INTERVAL_MS + (MAX_INTERVAL_MS - MIN_INTERVAL_MS) * easeInCubic(t);
      timeoutRef.current = setTimeout(scheduleNext, interval);
    }

    scheduleNext();

    return () => {
      cancelled = true;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSpinning, durationMs]);

  if (!isSpinning) return null;

  const blurAmount = Math.max(0, (1 - progress) * 6);
  const isSettling = progress > 0.85;

  return (
    <div
      className={`relative flex h-48 w-full max-w-3xl flex-col items-center justify-center overflow-hidden rounded-3xl border bg-navy-900/70 backdrop-blur-md transition-all duration-500 sm:h-56 ${
        isSettling ? "border-gold-400/70 shadow-glow-strong" : "border-gold-400/25 shadow-glow"
      }`}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-gold-400/10 to-transparent"
        style={{ opacity: 0.35 + progress * 0.5 }}
        aria-hidden
      />
      <motion.p
        key={tick}
        initial={{ opacity: 0, y: isSettling ? 0 : -14, scale: isSettling ? 1 : 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: isSettling ? 0.3 : 0.08 }}
        style={{ filter: `blur(${blurAmount}px)` }}
        className="px-6 text-center font-display text-3xl font-bold text-white sm:text-5xl"
      >
        {displayName}
      </motion.p>
      <div className="absolute bottom-5 h-1 w-2/3 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full bg-gradient-to-r from-gold-400 to-ember-500"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </div>
  );
}
