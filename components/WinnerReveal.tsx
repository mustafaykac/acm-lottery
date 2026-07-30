"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";
import { PartyPopper, Sparkles } from "lucide-react";
import type { Winner } from "@/types/draw";
import { playSound } from "@/lib/sound-manager";
import { useDrawStore } from "@/store/draw-store";

interface WinnerRevealProps {
  winner: Winner | null;
  onContinue: () => void;
}

function fireConfetti() {
  const colors = ["#f5c451", "#f97316", "#ffffff", "#eab308"];
  const duration = 2200;
  const end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 65,
      origin: { x: 0, y: 0.6 },
      colors,
    });
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 65,
      origin: { x: 1, y: 0.6 },
      colors,
    });
    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();

  confetti({
    particleCount: 140,
    spread: 100,
    origin: { y: 0.4 },
    colors,
    startVelocity: 45,
  });
}

export default function WinnerReveal({ winner, onContinue }: WinnerRevealProps) {
  const totalWinners = useDrawStore(
    (state) => state.session?.totalWinners ?? state.settings.totalWinners
  );
  const hasCelebratedRef = useRef(false);

  useEffect(() => {
    if (!winner) {
      hasCelebratedRef.current = false;
      return;
    }
    if (hasCelebratedRef.current) return;
    hasCelebratedRef.current = true;

    void playSound("winner");
    fireConfetti();
    const celebrationTimeout = setTimeout(() => void playSound("celebration"), 350);
    return () => clearTimeout(celebrationTimeout);
  }, [winner]);

  return (
    <AnimatePresence>
      {winner && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/80 p-4 backdrop-blur-sm"
        >
          <div
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
            aria-hidden
          >
            <div className="h-[36rem] w-[36rem] rounded-full bg-gold-400/25 blur-[140px]" />
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 18 }}
            className="relative w-full max-w-xl rounded-[2rem] border-2 border-gold-400/60 bg-gradient-to-b from-navy-800 to-navy-900 p-10 text-center shadow-glow-strong"
          >
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-gold-500 to-ember-500 px-5 py-1.5 font-display text-sm font-bold text-navy-950 shadow-glow">
              {winner.drawNumber}. Kazanan
            </div>

            <Sparkles className="mx-auto mb-3 h-8 w-8 animate-pulse-glow text-gold-400" />

            <p className="font-display text-lg font-semibold tracking-[0.3em] text-gold-400">
              TEBRİKLER!
            </p>

            <h2 className="mt-3 break-words font-display text-3xl font-extrabold text-white sm:text-5xl">
              {winner.participant.fullName}
            </h2>

            <p className="mt-4 text-base text-white/80 sm:text-lg">
              Hull City maç deneyimini kazandınız!
            </p>

            {(winner.participant.department || winner.participant.employeeNumber) && (
              <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-sm text-white/50">
                {winner.participant.department && (
                  <span className="rounded-full border border-white/15 px-3 py-1">
                    {winner.participant.department}
                  </span>
                )}
                {winner.participant.employeeNumber && (
                  <span className="rounded-full border border-white/15 px-3 py-1">
                    Sicil No: {winner.participant.employeeNumber}
                  </span>
                )}
              </div>
            )}

            <button
              type="button"
              onClick={onContinue}
              className="mt-8 flex items-center gap-2 rounded-xl bg-gradient-to-r from-gold-500 to-ember-500 px-6 py-3 font-display text-sm font-semibold text-navy-950 shadow-glow transition hover:shadow-glow-strong active:scale-[0.98] mx-auto"
            >
              <PartyPopper className="h-4 w-4" />
              {winner.drawNumber >= totalWinners ? "Sonuçları Görüntüle" : "Devam Et"}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
