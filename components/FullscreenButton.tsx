"use client";

import { useEffect, useState } from "react";
import { Maximize, Minimize } from "lucide-react";
import { cn } from "@/lib/utils";

interface FullscreenButtonProps {
  className?: string;
}

export default function FullscreenButton({ className }: FullscreenButtonProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", handleChange);
    return () => document.removeEventListener("fullscreenchange", handleChange);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      // Tam ekran desteklenmiyorsa sessizce yok say.
    }
  };

  return (
    <button
      type="button"
      onClick={toggleFullscreen}
      className={cn(
        "flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 backdrop-blur-md transition hover:border-gold-400/40 hover:bg-white/10 hover:text-white",
        className
      )}
      aria-label={isFullscreen ? "Tam ekrandan çık" : "Tam ekrana geç"}
      title={isFullscreen ? "Tam ekrandan çık" : "Tam ekrana geç"}
    >
      {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
      <span className="hidden sm:inline">{isFullscreen ? "Tam Ekrandan Çık" : "Tam Ekran"}</span>
    </button>
  );
}
