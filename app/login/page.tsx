"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, ShieldAlert } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (submitting) return; // guard against double submit
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.error || "Giriş başarısız.");
        setSubmitting(false);
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("Sunucuya ulaşılamadı. Lütfen tekrar deneyin.");
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-card backdrop-blur-md sm:p-10"
      >
        <div className="flex flex-col items-center text-center">
          <BrandLogo size="lg" className="mb-6" />
          <p className="mb-2 font-display text-xs font-semibold tracking-[0.35em] text-gold-400">
            KURUMSAL ETKİNLİK
          </p>
          <h1 className="font-display text-2xl font-bold text-white">Kura Sistemine Giriş</h1>
          <p className="mt-2 text-sm text-white/60">
            Devam etmek için yönetici bilgilerinizi girin.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5 text-left">
            <label htmlFor="username" className="text-xs font-semibold text-white/70">
              Kullanıcı Adı
            </label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              required
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="rounded-xl border border-white/10 bg-navy-950/60 px-4 py-3 text-white outline-none transition focus:border-gold-400/60"
            />
          </div>

          <div className="flex flex-col gap-1.5 text-left">
            <label htmlFor="password" className="text-xs font-semibold text-white/70">
              Şifre
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-xl border border-white/10 bg-navy-950/60 px-4 py-3 text-white outline-none transition focus:border-gold-400/60"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              <ShieldAlert className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-gold-500 to-ember-500 px-6 py-3.5 font-display text-base font-semibold text-navy-950 shadow-glow transition hover:shadow-glow-strong active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Lock className="h-4 w-4" />
            {submitting ? "Giriş yapılıyor..." : "Giriş Yap"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
