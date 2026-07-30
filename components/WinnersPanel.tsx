"use client";

import { Trophy } from "lucide-react";
import { useDrawStore } from "@/store/draw-store";
import WinnerCard from "./WinnerCard";

export default function WinnersPanel() {
  const winners = useDrawStore((state) => state.winners);
  const isDrawing = useDrawStore((state) => state.isDrawing);
  const totalWinners = useDrawStore(
    (state) => state.session?.totalWinners ?? state.settings.totalWinners
  );

  // Seçim anında gerçekleşir ancak animasyon+açıkça gösterim bitene kadar
  // (isDrawing true olduğu sürece) en son kazanan panelde "Bekleniyor" görünür.
  const visibleWinners = isDrawing ? winners.slice(0, -1) : winners;

  const slots = Array.from({ length: totalWinners }, (_, index) => {
    const order = index + 1;
    return visibleWinners.find((winner) => winner.drawNumber === order);
  });

  return (
    <div className="flex h-full max-h-[calc(100vh-14rem)] flex-col rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
      <div className="mb-4 flex items-center gap-2">
        <Trophy className="h-5 w-5 text-gold-400" />
        <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-white">
          Kazananlar
        </h3>
      </div>
      <div className="flex flex-1 flex-col gap-3 overflow-y-auto pr-1">
        {slots.map((winner, index) => (
          <WinnerCard key={index + 1} order={index + 1} winner={winner} />
        ))}
      </div>
    </div>
  );
}
