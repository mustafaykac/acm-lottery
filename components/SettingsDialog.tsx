"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Download, FileJson, ListChecks, Printer, RotateCcw, Trophy, Upload, Volume2, VolumeX, X } from "lucide-react";
import { useDrawStore } from "@/store/draw-store";
import { setSoundEnabled } from "@/lib/sound-manager";
import { exportWinnersAsCsv, exportWinnersAsJson } from "@/lib/export-results";
import {
  DEFAULT_ANIMATION_DURATION_MS,
  MAX_ANIMATION_DURATION_MS,
  MAX_TOTAL_WINNERS,
  MIN_ANIMATION_DURATION_MS,
  MIN_TOTAL_WINNERS,
} from "@/types/draw";
import ResetDrawDialog from "./ResetDrawDialog";

interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsDialog({ isOpen, onClose }: SettingsDialogProps) {
  const settings = useDrawStore((state) => state.settings);
  const updateSettings = useDrawStore((state) => state.updateSettings);
  const allParticipants = useDrawStore((state) => state.allParticipants);
  const winners = useDrawStore((state) => state.winners);
  const goToUpload = useDrawStore((state) => state.goToUpload);
  const updateTotalWinners = useDrawStore((state) => state.updateTotalWinners);

  const auditLog = useDrawStore((state) => state.auditLog);
  const session = useDrawStore((state) => state.session);

  const [showParticipantList, setShowParticipantList] = useState(false);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);

  const canUploadNewList = winners.length === 0;
  const maxWinners = Math.max(
    MIN_TOTAL_WINNERS,
    Math.min(MAX_TOTAL_WINNERS, allParticipants.length || MAX_TOTAL_WINNERS)
  );

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex justify-end bg-navy-950/70 backdrop-blur-sm"
            onClick={onClose}
          >
            <motion.aside
              initial={{ x: 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 40, opacity: 0 }}
              onClick={(event) => event.stopPropagation()}
              className="h-full w-full max-w-md overflow-y-auto border-l border-white/10 bg-navy-900 p-6"
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="font-display text-xl font-bold text-white">Ayarlar</h2>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg p-1.5 text-white/50 hover:bg-white/10 hover:text-white"
                  aria-label="Kapat"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <section className="mb-6">
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-white/40">
                  Katılımcı Listesi
                </h3>
                <div className="space-y-2">
                  <button
                    type="button"
                    disabled={!canUploadNewList}
                    onClick={() => {
                      goToUpload();
                      onClose();
                    }}
                    title={
                      canUploadNewList
                        ? undefined
                        : "Kura başladıktan sonra yeni liste yüklemek için önce kurayı sıfırlayın."
                    }
                    className="flex w-full items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Upload className="h-4 w-4" /> Yeni Liste Yükle
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowParticipantList((prev) => !prev)}
                    className="flex w-full items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80 transition hover:bg-white/10"
                  >
                    <ListChecks className="h-4 w-4" />
                    {showParticipantList ? "Listeyi Gizle" : `Mevcut Listeyi Görüntüle (${allParticipants.length})`}
                  </button>
                  {showParticipantList && (
                    <div className="max-h-48 overflow-y-auto rounded-xl border border-white/10 bg-white/5 p-2 text-xs text-white/60">
                      {allParticipants.length === 0 && (
                        <p className="p-2 text-center">Henüz liste yüklenmedi.</p>
                      )}
                      {allParticipants.map((participant, index) => (
                        <div key={participant.id} className="px-2 py-1">
                          {index + 1}. {participant.fullName}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </section>

              <section className="mb-6">
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-white/40">
                  Kazanan Sayısı
                </h3>
                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                  <Trophy className="h-4 w-4 shrink-0 text-gold-400" />
                  <input
                    type="number"
                    min={MIN_TOTAL_WINNERS}
                    max={maxWinners}
                    value={settings.totalWinners}
                    disabled={!canUploadNewList}
                    onChange={(event) => updateTotalWinners(Number(event.target.value))}
                    title={
                      canUploadNewList
                        ? undefined
                        : "Kura başladıktan sonra kazanan sayısı değiştirilemez."
                    }
                    className="w-20 rounded-lg border border-white/15 bg-navy-900/60 px-2 py-1 text-center text-sm text-white focus:border-gold-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-40"
                  />
                  <span className="text-xs text-white/50">
                    {canUploadNewList
                      ? `1 - ${maxWinners} arasında`
                      : "Kura başladı, değiştirilemez"}
                  </span>
                </div>
              </section>

              <section className="mb-6">
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-white/40">
                  Ses
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    const next = !settings.soundEnabled;
                    updateSettings({ soundEnabled: next });
                    setSoundEnabled(next);
                  }}
                  className="flex w-full items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80 transition hover:bg-white/10"
                >
                  {settings.soundEnabled ? (
                    <Volume2 className="h-4 w-4 text-gold-400" />
                  ) : (
                    <VolumeX className="h-4 w-4" />
                  )}
                  {settings.soundEnabled ? "Sesler Açık" : "Sesler Kapalı"}
                </button>
              </section>

              <section className="mb-6">
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-white/40">
                  Animasyon Süresi
                </h3>
                <input
                  type="range"
                  min={MIN_ANIMATION_DURATION_MS}
                  max={MAX_ANIMATION_DURATION_MS}
                  step={500}
                  value={settings.animationDurationMs}
                  onChange={(event) =>
                    updateSettings({ animationDurationMs: Number(event.target.value) })
                  }
                  className="w-full accent-gold-400"
                />
                <p className="mt-1 text-xs text-white/50">
                  {(settings.animationDurationMs / 1000).toFixed(1)} saniye
                  {settings.animationDurationMs === DEFAULT_ANIMATION_DURATION_MS ? " (varsayılan)" : ""}
                </p>
              </section>

              {winners.length > 0 && (
                <section className="mb-6">
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-white/40">
                    Sonuçları Dışa Aktar
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => exportWinnersAsCsv(winners)}
                      className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/80 hover:bg-white/10"
                    >
                      <Download className="h-3.5 w-3.5" /> CSV
                    </button>
                    <button
                      type="button"
                      onClick={() => exportWinnersAsJson(winners, auditLog, session)}
                      className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/80 hover:bg-white/10"
                    >
                      <FileJson className="h-3.5 w-3.5" /> JSON
                    </button>
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/80 hover:bg-white/10"
                    >
                      <Printer className="h-3.5 w-3.5" /> Yazdır
                    </button>
                  </div>
                </section>
              )}

              <section>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-white/40">
                  Tehlikeli Bölge
                </h3>
                <button
                  type="button"
                  onClick={() => setIsResetDialogOpen(true)}
                  className="flex w-full items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300 transition hover:bg-red-500/20"
                >
                  <RotateCcw className="h-4 w-4" /> Kurayı Sıfırla
                </button>
              </section>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      <ResetDrawDialog
        isOpen={isResetDialogOpen}
        onClose={() => setIsResetDialogOpen(false)}
      />
    </>
  );
}
