"use client";

import { Download, FileJson, Printer } from "lucide-react";
import { useDrawStore } from "@/store/draw-store";
import { exportWinnersAsCsv, exportWinnersAsJson } from "@/lib/export-results";
import { formatDateTime } from "@/lib/utils";

export default function ExportResults() {
  const winners = useDrawStore((state) => state.winners);
  const auditLog = useDrawStore((state) => state.auditLog);
  const session = useDrawStore((state) => state.session);

  return (
    <div className="mx-auto mt-10 w-full max-w-3xl rounded-3xl border border-gold-400/30 bg-white/5 p-8 text-center backdrop-blur-md print:border-none print:bg-white print:text-black">
      <h3 className="font-display text-2xl font-bold text-white print:text-black">
        Kura Tamamlandı
      </h3>
      <p className="mt-2 text-sm text-white/60 print:text-black/70">
        {session?.completedAt ? formatDateTime(session.completedAt) : ""} tarihinde {winners.length}{" "}
        kazanan belirlendi.
      </p>

      <div className="mt-6 space-y-2 text-left">
        {winners.map((winner) => (
          <div
            key={winner.drawNumber}
            className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 print:border-black/20 print:text-black"
          >
            <span className="font-semibold text-gold-400 print:text-black">
              {winner.drawNumber}. {winner.participant.fullName}
            </span>
            <span className="text-white/50 print:text-black/60">
              {formatDateTime(winner.selectedAt)}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3 print:hidden">
        <button
          type="button"
          onClick={() => exportWinnersAsCsv(winners)}
          className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-white/80 transition hover:bg-white/10"
        >
          <Download className="h-4 w-4" /> CSV İndir
        </button>
        <button
          type="button"
          onClick={() => exportWinnersAsJson(winners, auditLog, session)}
          className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-white/80 transition hover:bg-white/10"
        >
          <FileJson className="h-4 w-4" /> JSON İndir
        </button>
        <button
          type="button"
          onClick={() => window.print()}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-gold-500 to-ember-500 px-5 py-3 text-sm font-semibold text-navy-950 shadow-glow transition hover:shadow-glow-strong"
        >
          <Printer className="h-4 w-4" /> Yazdır
        </button>
      </div>
    </div>
  );
}
