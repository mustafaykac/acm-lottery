"use client";

import { useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FileSpreadsheet, Loader2, UploadCloud } from "lucide-react";
import { ParticipantFileError, parseParticipantFile } from "@/lib/participant-parser";
import { useDrawStore } from "@/store/draw-store";

export default function FileUploader() {
  const setPendingParseResult = useDrawStore((state) => state.setPendingParseResult);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      setIsProcessing(true);
      setErrorMessage(null);
      try {
        const result = await parseParticipantFile(file);
        if (result.participants.length === 0) {
          setErrorMessage(
            "Dosyada geçerli hiçbir katılımcı bulunamadı. Lütfen ad veya ad soyad kolonunu kontrol edin."
          );
          return;
        }
        setPendingParseResult(result);
      } catch (error) {
        if (error instanceof ParticipantFileError) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage("Dosya işlenirken beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.");
        }
      } finally {
        setIsProcessing(false);
      }
    },
    [setPendingParseResult]
  );

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragging(false);
      const file = event.dataTransfer.files?.[0];
      if (file) void handleFile(file);
    },
    [handleFile]
  );

  const onInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) void handleFile(file);
      event.target.value = "";
    },
    [handleFile]
  );

  return (
    <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-3xl flex-col items-center justify-center px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full"
      >
        <h2 className="mb-2 text-center font-display text-3xl font-bold text-white">
          Katılımcı Listesini Yükle
        </h2>
        <p className="mb-8 text-center text-white/60">
          .xlsx, .xls veya .csv formatında yaklaşık 1.000 kişilik listenizi yükleyin.
        </p>

        <div
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed p-14 text-center backdrop-blur-md transition ${
            isDragging
              ? "border-gold-400 bg-gold-400/10"
              : "border-white/15 bg-white/5 hover:border-gold-400/50 hover:bg-white/[0.07]"
          }`}
        >
          {isProcessing ? (
            <Loader2 className="mb-4 h-12 w-12 animate-spin text-gold-400" />
          ) : (
            <UploadCloud className="mb-4 h-12 w-12 text-gold-400" />
          )}
          <p className="font-display text-lg font-semibold text-white">
            {isProcessing ? "Dosya işleniyor..." : "Dosyayı sürükleyin veya seçmek için tıklayın"}
          </p>
          <p className="mt-2 flex items-center gap-2 text-sm text-white/50">
            <FileSpreadsheet className="h-4 w-4" /> .xlsx, .xls, .csv
          </p>
          <input
            ref={inputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            className="hidden"
            onChange={onInputChange}
          />
        </div>

        {errorMessage && (
          <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {errorMessage}
          </div>
        )}

        <p className="mt-6 text-center text-xs text-white/40">
          Beklenen kolonlar: Ad Soyad (veya Ad / Soyad), Departman, Sicil No. Kolon isimleri
          farklı olsa da sistem otomatik olarak tanıyabilir.
        </p>
      </motion.div>
    </div>
  );
}
