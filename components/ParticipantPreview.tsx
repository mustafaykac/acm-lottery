"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Copy, Trophy, Users } from "lucide-react";
import { useDrawStore } from "@/store/draw-store";
import { MAX_TOTAL_WINNERS, MIN_TOTAL_WINNERS } from "@/types/draw";

export default function ParticipantPreview() {
  const pendingParseResult = useDrawStore((state) => state.pendingParseResult);
  const confirmParticipants = useDrawStore((state) => state.confirmParticipants);
  const goToUpload = useDrawStore((state) => state.goToUpload);
  const totalWinners = useDrawStore((state) => state.settings.totalWinners);
  const updateSettings = useDrawStore((state) => state.updateSettings);
  const [activeTab, setActiveTab] = useState<"list" | "issues" | "duplicates">("list");

  if (!pendingParseResult) return null;

  const { participants, issues, duplicateGroups, fileName, totalRows } = pendingParseResult;
  const maxWinners = Math.max(MIN_TOTAL_WINNERS, Math.min(MAX_TOTAL_WINNERS, participants.length));
  const isWinnerCountValid = totalWinners >= MIN_TOTAL_WINNERS && totalWinners <= maxWinners;

  const handleWinnerCountChange = (rawValue: string) => {
    const parsed = Number(rawValue);
    if (!Number.isFinite(parsed)) return;
    updateSettings({ totalWinners: Math.trunc(parsed) });
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="mb-1 font-display text-3xl font-bold text-white">Liste Önizleme</h2>
        <p className="mb-8 text-white/60">
          <span className="text-gold-400">{fileName}</span> dosyası işlendi. Kuraya başlamadan
          önce listeyi kontrol edip onaylayın.
        </p>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            icon={Users}
            label="Geçerli Katılımcı"
            value={participants.length}
            accent="text-emerald-400"
          />
          <StatCard
            icon={AlertTriangle}
            label="Geçersiz Satır"
            value={issues.length}
            accent="text-amber-400"
          />
          <StatCard
            icon={Copy}
            label="Tekrarlı Kayıt Grubu"
            value={duplicateGroups.length}
            accent="text-red-400"
          />
        </div>

        <p className="mb-4 text-xs text-white/40">
          Dosyadaki toplam veri satırı: {totalRows}. Boş isimler listeye alınmadı, tekrarlı
          kayıtların sadece ilk kaydı kura havuzuna eklendi.
        </p>

        <div className="mb-4 flex gap-2 border-b border-white/10">
          {[
            { key: "list" as const, label: `Katılımcılar (${participants.length})` },
            { key: "issues" as const, label: `Geçersiz Satırlar (${issues.length})` },
            { key: "duplicates" as const, label: `Tekrarlar (${duplicateGroups.length})` },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 text-sm font-medium transition ${
                activeTab === tab.key
                  ? "border-b-2 border-gold-400 text-white"
                  : "text-white/50 hover:text-white/80"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="max-h-96 overflow-y-auto rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md">
          {activeTab === "list" && (
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 bg-navy-800/95 text-xs uppercase tracking-wide text-white/50">
                <tr>
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">Ad Soyad</th>
                  <th className="px-4 py-3">Departman</th>
                  <th className="px-4 py-3">Sicil No</th>
                </tr>
              </thead>
              <tbody>
                {participants.map((participant, index) => (
                  <tr key={participant.id} className="border-t border-white/5 text-white/80">
                    <td className="px-4 py-2 text-white/40">{index + 1}</td>
                    <td className="px-4 py-2">{participant.fullName}</td>
                    <td className="px-4 py-2">{participant.department ?? "-"}</td>
                    <td className="px-4 py-2">{participant.employeeNumber ?? "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === "issues" && (
            <ul className="divide-y divide-white/5">
              {issues.length === 0 && (
                <li className="px-4 py-6 text-center text-white/50">Geçersiz satır bulunamadı.</li>
              )}
              {issues.map((issue, index) => (
                <li key={`${issue.row}-${index}`} className="px-4 py-3 text-sm text-white/70">
                  <span className="font-semibold text-amber-400">Satır {issue.row}:</span>{" "}
                  {issue.reason}
                </li>
              ))}
            </ul>
          )}

          {activeTab === "duplicates" && (
            <ul className="divide-y divide-white/5">
              {duplicateGroups.length === 0 && (
                <li className="px-4 py-6 text-center text-white/50">Tekrarlı kayıt bulunamadı.</li>
              )}
              {duplicateGroups.map((group) => (
                <li key={group.key} className="px-4 py-3 text-sm text-white/70">
                  <span className="font-semibold text-red-400">
                    {group.participants[0]?.fullName}
                  </span>{" "}
                  {group.participants.length} kez listede bulundu, sadece ilk kayıt havuza alındı.
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-8 flex flex-col gap-6 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold-400/10 text-gold-400">
              <Trophy className="h-5 w-5" />
            </div>
            <div>
              <label htmlFor="totalWinners" className="block text-sm font-semibold text-white">
                Kazanan Sayısı
              </label>
              <p className="text-xs text-white/50">
                Bu kurada belirlenecek kazanan sayısı (en fazla {maxWinners}).
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <input
              id="totalWinners"
              type="number"
              min={MIN_TOTAL_WINNERS}
              max={maxWinners}
              value={totalWinners}
              onChange={(event) => handleWinnerCountChange(event.target.value)}
              className={`w-24 rounded-xl border bg-navy-900/60 px-4 py-2 text-center font-display text-lg font-bold text-white focus:outline-none ${
                isWinnerCountValid ? "border-white/15 focus:border-gold-400" : "border-red-500/60"
              }`}
            />
            {!isWinnerCountValid && (
              <p className="text-xs text-red-300">
                {MIN_TOTAL_WINNERS} - {maxWinners} arasında bir değer girin.
              </p>
            )}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={goToUpload}
            className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-white/80 transition hover:bg-white/10"
          >
            Farklı Dosya Yükle
          </button>
          <button
            type="button"
            disabled={participants.length === 0 || !isWinnerCountValid}
            onClick={confirmParticipants}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-gold-500 to-ember-500 px-6 py-3 font-display text-sm font-semibold text-navy-950 shadow-glow transition hover:shadow-glow-strong disabled:cursor-not-allowed disabled:opacity-40"
          >
            <CheckCircle2 className="h-4 w-4" />
            Listeyi Onayla ve Kuraya Geç
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: typeof Users;
  label: string;
  value: number;
  accent: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
      <Icon className={`mb-2 h-5 w-5 ${accent}`} />
      <p className="font-display text-2xl font-bold text-white">{value}</p>
      <p className="text-xs text-white/50">{label}</p>
    </div>
  );
}
