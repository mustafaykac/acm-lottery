"use client";

import { Users, UserCheck, Trophy, Activity } from "lucide-react";
import { useDrawStore } from "@/store/draw-store";

const STATUS_LABELS: Record<string, string> = {
  READY: "Hazır",
  RUNNING: "Devam Ediyor",
  COMPLETED: "Tamamlandı",
};

export default function DrawProgress() {
  const allParticipants = useDrawStore((state) => state.allParticipants);
  const remainingPool = useDrawStore((state) => state.remainingPool);
  const winners = useDrawStore((state) => state.winners);
  const isDrawing = useDrawStore((state) => state.isDrawing);
  const session = useDrawStore((state) => state.session);
  const totalWinners = useDrawStore(
    (state) => state.session?.totalWinners ?? state.settings.totalWinners
  );

  const revealedCount = isDrawing ? winners.length - 1 : winners.length;

  const items = [
    { icon: Users, label: "Toplam Katılımcı", value: allParticipants.length },
    { icon: UserCheck, label: "Kalan Aday", value: remainingPool.length },
    { icon: Trophy, label: "Kazanan", value: `${revealedCount} / ${totalWinners}` },
    {
      icon: Activity,
      label: "Kura Durumu",
      value: session ? STATUS_LABELS[session.status] ?? session.status : "-",
    },
  ];

  return (
    <div className="mx-auto grid w-full max-w-5xl grid-cols-2 gap-3 px-6 sm:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center backdrop-blur-md"
        >
          <item.icon className="mx-auto mb-1.5 h-4 w-4 text-gold-400" />
          <p className="font-display text-xl font-bold text-white">{item.value}</p>
          <p className="text-[11px] uppercase tracking-wide text-white/50">{item.label}</p>
        </div>
      ))}
    </div>
  );
}
