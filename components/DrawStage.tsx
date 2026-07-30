"use client";

import { useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { Winner } from "@/types/draw";
import { useDrawStore } from "@/store/draw-store";
import AppHeader from "./AppHeader";
import BrandLogo from "./BrandLogo";
import DrawProgress from "./DrawProgress";
import WinnersPanel from "./WinnersPanel";
import RollingNames from "./RollingNames";
import DrawButton from "./DrawButton";
import WinnerReveal from "./WinnerReveal";
import ExportResults from "./ExportResults";
import SettingsDialog from "./SettingsDialog";

export default function DrawStage() {
  const allParticipants = useDrawStore((state) => state.allParticipants);
  const settings = useDrawStore((state) => state.settings);
  const finishReveal = useDrawStore((state) => state.finishReveal);
  const phase = useDrawStore((state) => state.phase);
  const totalWinners = useDrawStore(
    (state) => state.session?.totalWinners ?? state.settings.totalWinners
  );

  const [isSpinning, setIsSpinning] = useState(false);
  const [revealedWinner, setRevealedWinner] = useState<Winner | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const pendingWinnerRef = useRef<Winner | null>(null);

  const handleDrawStarted = useCallback((winner: Winner) => {
    pendingWinnerRef.current = winner;
    setIsSpinning(true);
  }, []);

  const handleRollComplete = useCallback(() => {
    setIsSpinning(false);
    setRevealedWinner(pendingWinnerRef.current);
    pendingWinnerRef.current = null;
  }, []);

  const handleContinue = useCallback(() => {
    setRevealedWinner(null);
    finishReveal();
  }, [finishReveal]);

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader onOpenSettings={() => setIsSettingsOpen(true)} />

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col items-center gap-8 px-6 pb-12">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center text-center"
        >
          <BrandLogo size="lg" className="mb-4 shadow-glow" />
          <p className="font-display text-xs font-semibold tracking-[0.35em] text-gold-400 sm:text-sm">
            HULL CITY MAÇ DENEYİMİ
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold text-white sm:text-5xl">
            Büyük Kura Heyecanı
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-white/60 sm:text-base">
            İngiltere&apos;de unutulmaz bir futbol deneyimi yaşayacak {totalWinners} şanslı kişi
            belirleniyor.
          </p>
        </motion.div>

        <DrawProgress />

        <div className="grid w-full flex-1 grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
          <div className="flex flex-col items-center justify-center gap-8 rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-10">
            {isSpinning ? (
              <RollingNames
                participants={allParticipants}
                isSpinning={isSpinning}
                durationMs={settings.animationDurationMs}
                onComplete={handleRollComplete}
              />
            ) : (
              <div className="flex h-48 w-full max-w-3xl items-center justify-center rounded-3xl border border-dashed border-white/10 text-white/30 sm:h-56">
                {phase === "COMPLETED"
                  ? "Kura tamamlandı"
                  : "Kazananı belirlemek için butona basın"}
              </div>
            )}

            <DrawButton onDrawStarted={handleDrawStarted} />
          </div>

          <WinnersPanel />
        </div>

        {phase === "COMPLETED" && <ExportResults />}
      </main>

      <WinnerReveal winner={revealedWinner} onContinue={handleContinue} />
      <SettingsDialog isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
}
