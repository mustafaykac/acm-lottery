"use client";

import { Settings } from "lucide-react";
import BrandLogo from "./BrandLogo";
import FullscreenButton from "./FullscreenButton";

interface AppHeaderProps {
  onOpenSettings: () => void;
}

export default function AppHeader({ onOpenSettings }: AppHeaderProps) {
  return (
    <header className="relative z-20 flex items-center justify-between px-6 py-4 sm:px-10">
      <div className="flex items-center gap-3">
        <BrandLogo size="sm" />
        <div className="leading-tight">
          <p className="font-display text-sm font-semibold tracking-[0.2em] text-gold-400">
            KURUMSAL ETKİNLİK
          </p>
          <p className="text-xs text-white/60">Hull City Maç Deneyimi Kura Sistemi</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <FullscreenButton />
        <button
          type="button"
          onClick={onOpenSettings}
          className="flex items-center justify-center rounded-xl border border-white/10 bg-white/5 p-2.5 text-white/80 backdrop-blur-md transition hover:border-gold-400/40 hover:bg-white/10 hover:text-white"
          aria-label="Ayarlar"
          title="Ayarlar"
        >
          <Settings className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
