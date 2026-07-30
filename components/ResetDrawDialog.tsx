"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";
import { useDrawStore } from "@/store/draw-store";

const CONFIRM_PHRASE = "KURAYI SIFIRLA";

interface ResetDrawDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ResetDrawDialog({ isOpen, onClose }: ResetDrawDialogProps) {
  const [confirmText, setConfirmText] = useState("");
  const resetAll = useDrawStore((state) => state.resetAll);

  const isConfirmed = confirmText.trim() === CONFIRM_PHRASE;

  const handleClose = () => {
    setConfirmText("");
    onClose();
  };

  const handleReset = () => {
    if (!isConfirmed) return;
    resetAll();
    setConfirmText("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-navy-950/85 p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            className="w-full max-w-md rounded-3xl border border-red-500/40 bg-navy-900 p-7"
          >
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-center gap-2 text-red-400">
                <AlertTriangle className="h-5 w-5" />
                <h3 className="font-display text-lg font-semibold text-white">Kurayı Sıfırla</h3>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="rounded-lg p-1 text-white/50 hover:bg-white/10 hover:text-white"
                aria-label="Kapat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-sm text-white/70">
              Bu işlem <span className="font-semibold text-red-300">tüm kazananları, audit
              kayıtlarını ve katılımcı listesini kalıcı olarak silecektir</span>. Bu işlem geri
              alınamaz.
            </p>

            <p className="mt-4 text-sm text-white/60">
              Onaylamak için aşağıya <span className="font-mono text-gold-400">{CONFIRM_PHRASE}</span>{" "}
              yazın:
            </p>

            <input
              type="text"
              value={confirmText}
              onChange={(event) => setConfirmText(event.target.value)}
              placeholder={CONFIRM_PHRASE}
              className="mt-3 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 font-mono text-white placeholder:text-white/25 focus:border-red-400 focus:outline-none"
            />

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="rounded-xl border border-white/15 px-5 py-2.5 text-sm font-medium text-white/70 hover:bg-white/5"
              >
                Vazgeç
              </button>
              <button
                type="button"
                disabled={!isConfirmed}
                onClick={handleReset}
                className="rounded-xl bg-red-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-30"
              >
                Kurayı Sıfırla
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
