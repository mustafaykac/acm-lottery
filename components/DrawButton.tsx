"use client";

import { useCallback, useRef } from "react";
import { CheckCircle, Loader2, Sparkles } from "lucide-react";
import { useDrawStore } from "@/store/draw-store";
import type { Winner } from "@/types/draw";

interface DrawButtonProps {
  onDrawStarted: (winner: Winner) => void;
}

export default function DrawButton({ onDrawStarted }: DrawButtonProps) {
  const winners = useDrawStore((state) => state.winners);
  const isDrawing = useDrawStore((state) => state.isDrawing);
  const remainingPool = useDrawStore((state) => state.remainingPool);
  const runDraw = useDrawStore((state) => state.runDraw);
  const totalWinners = useDrawStore(
    (state) => state.session?.totalWinners ?? state.settings.totalWinners
  );
  const clickLockRef = useRef(false);

  const nextDrawNumber = winners.length + 1;
  const isComplete = winners.length >= totalWinners;
  // Bekleyen kazanan henuz aciklanmadigi surece (isDrawing true iken), 5. kura
  // bitmis olsa bile buton "Kura Tamamlandi" yerine donme durumunu gostermeye devam eder.
  const showCompleted = isComplete && !isDrawing;
  const isDisabled = isComplete || isDrawing || remainingPool.length === 0;

  const handleClick = useCallback(() => {
    if (clickLockRef.current || isDisabled) return;
    clickLockRef.current = true;
    try {
      const winner = runDraw();
      onDrawStarted(winner);
    } catch {
      // Kura zaten devam ediyorsa veya tamamlandıysa sessizce yok say.
    } finally {
      setTimeout(() => {
        clickLockRef.current = false;
      }, 300);
    }
  }, [isDisabled, onDrawStarted, runDraw]);

  let label = "Kura Tamamlandı";
  if (!showCompleted) {
    label = isDrawing ? "Kazanan Beliriyor..." : `${nextDrawNumber}. Kazananı Belirle`;
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isDisabled}
      className={`group relative flex items-center gap-3 overflow-hidden rounded-2xl px-10 py-5 font-display text-xl font-bold shadow-glow transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 ${
        showCompleted
          ? "bg-white/10 text-white/60"
          : "bg-gradient-to-r from-gold-500 to-ember-500 text-navy-950 hover:shadow-glow-strong"
      }`}
    >
      {isDrawing ? (
        <Loader2 className="h-6 w-6 animate-spin" />
      ) : showCompleted ? (
        <CheckCircle className="h-6 w-6" />
      ) : (
        <Sparkles className="h-6 w-6 transition group-hover:rotate-12" />
      )}
      {label}
    </button>
  );
}
