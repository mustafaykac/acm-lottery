"use client";

import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Sparkles, Trophy } from "lucide-react";
import { useDrawStore } from "@/store/draw-store";
import BrandLogo from "./BrandLogo";

export default function WelcomeScreen() {
  const goToUpload = useDrawStore((state) => state.goToUpload);
  const totalWinners = useDrawStore((state) => state.settings.totalWinners);

  return (
    <div className="flex min-h-[calc(100vh-6rem)] flex-col items-center justify-center px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="flex flex-col items-center"
      >
        <BrandLogo size="lg" className="mb-6 shadow-glow-strong" />

        <p className="mb-3 font-display text-sm font-semibold tracking-[0.35em] text-gold-400">
          HULL CITY MAÇ DENEYİMİ
        </p>
        <h1 className="max-w-3xl font-display text-4xl font-bold leading-tight text-white sm:text-6xl">
          Büyük Kura Heyecanı
        </h1>
        <p className="mt-6 max-w-2xl text-balance text-lg text-white/70 sm:text-xl">
          İngiltere&apos;de unutulmaz bir futbol deneyimi yaşayacak {totalWinners} şanslı kişi
          belirleniyor. Kuraya başlamak için katılımcı listesini yükleyin.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={goToUpload}
            className="group flex items-center gap-2 rounded-2xl bg-gradient-to-r from-gold-500 to-ember-500 px-8 py-4 font-display text-lg font-semibold text-navy-950 shadow-glow transition hover:shadow-glow-strong active:scale-[0.98]"
          >
            Katılımcı Listesini Yükle
            <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
          </button>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            {
              icon: ShieldCheck,
              title: "Güvenli Rastgelelik",
              text: "crypto.getRandomValues() ile taraf tutmayan seçim",
            },
            {
              icon: Sparkles,
              title: "Şeffaf Kayıt",
              text: "Her kura için denetlenebilir audit kaydı",
            },
            {
              icon: Trophy,
              title: `${totalWinners} Kazanan`,
              text: "Tek tek açılan, adil ve izlenebilir kura",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-5 text-left backdrop-blur-md"
            >
              <item.icon className="mb-3 h-6 w-6 text-gold-400" />
              <p className="font-display text-sm font-semibold text-white">{item.title}</p>
              <p className="mt-1 text-xs text-white/60">{item.text}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
