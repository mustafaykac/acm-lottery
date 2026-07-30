"use client";

import { useState } from "react";
import Image from "next/image";
import { Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

type BrandLogoSize = "sm" | "lg";

interface BrandLogoProps {
  size?: BrandLogoSize;
  className?: string;
}

const BOX_SIZE_CLASSES: Record<BrandLogoSize, string> = {
  sm: "h-11 w-11",
  lg: "h-24 w-24 sm:h-28 sm:w-28",
};

const FALLBACK_ICON_SIZE_CLASSES: Record<BrandLogoSize, string> = {
  sm: "h-6 w-6",
  lg: "h-12 w-12 sm:h-14 sm:w-14",
};

/**
 * Kurum logosunu (/public/logo.png) mumkun olan en yuksek kalitede gosterir.
 * `unoptimized` ile Next.js'in yeniden sikistirmasi atlanir, dosyanin orijinal
 * cozunurlugu tarayiciya oldugu gibi ulasir. Dosya bulunamazsa (404/hata)
 * otomatik olarak kupa ikonlu metin tabanli kurumsal rozete duser.
 */
export default function BrandLogo({ size = "sm", className }: BrandLogoProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={cn(
          "flex shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-400 to-ember-500 shadow-glow",
          BOX_SIZE_CLASSES[size],
          className
        )}
      >
        <Trophy className={cn("text-navy-950", FALLBACK_ICON_SIZE_CLASSES[size])} />
      </div>
    );
  }

  return (
    <div className={cn("relative shrink-0", BOX_SIZE_CLASSES[size], className)}>
      <Image
        src="/logo.png"
        alt="Hull City Logosu"
        fill
        priority
        unoptimized
        className="object-contain"
        onError={() => setFailed(true)}
      />
    </div>
  );
}
