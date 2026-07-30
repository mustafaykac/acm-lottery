"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Clock } from "lucide-react";
import type { Winner } from "@/types/draw";

interface WinnerCardProps {
  order: number;
  winner?: Winner;
}

export default function WinnerCard({ order, winner }: WinnerCardProps) {
  if (!winner) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-dashed border-white/15 bg-white/[0.03] px-4 py-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 text-sm font-semibold text-white/40">
          {order}
        </div>
        <div className="flex items-center gap-2 text-sm text-white/40">
          <Clock className="h-4 w-4" />
          <span>{order}. Kazanan &mdash; Bekleniyor</span>
        </div>
      </div>
    );
  }

  const selectedTime = new Date(winner.selectedAt).toLocaleTimeString("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <motion.div
      initial={{ opacity: 0, x: 24, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 220, damping: 20 }}
      className="flex items-center gap-3 rounded-2xl border border-gold-400/40 bg-gradient-to-r from-gold-500/10 to-ember-500/5 px-4 py-3 shadow-glow"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gold-400 to-ember-500 text-sm font-bold text-navy-950">
        {order}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-display text-sm font-semibold text-white">
          {winner.participant.fullName}
        </p>
        <p className="truncate text-xs text-white/50">
          {[winner.participant.department, winner.participant.employeeNumber]
            .filter(Boolean)
            .join(" · ") || "—"}
          {" · "}
          {selectedTime}
        </p>
      </div>
      <CheckCircle2 className="h-5 w-5 shrink-0 text-gold-400" />
    </motion.div>
  );
}
