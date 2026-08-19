"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      router.push("/login");
      router.refresh();
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loggingOut}
      title="Çıkış Yap"
      aria-label="Çıkış Yap"
      className="flex items-center justify-center rounded-xl border border-white/10 bg-white/5 p-2.5 text-white/80 backdrop-blur-md transition hover:border-gold-400/40 hover:bg-white/10 hover:text-white disabled:opacity-50"
    >
      <LogOut className="h-5 w-5" />
    </button>
  );
}
