"use client";

export default function BackgroundEffects() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-gradient-to-b from-navy-950 via-navy-900 to-navy-950">
      <div className="absolute inset-0 opacity-[0.07]" aria-hidden>
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(245,196,81,0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(245,196,81,0.5) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      <div
        className="absolute -top-40 left-1/4 h-[32rem] w-[32rem] rounded-full bg-gold-500/20 blur-[120px] animate-pulse-glow"
        aria-hidden
      />
      <div
        className="absolute top-1/3 -right-32 h-[28rem] w-[28rem] rounded-full bg-ember-500/15 blur-[110px] animate-pulse-glow"
        style={{ animationDelay: "1.2s" }}
        aria-hidden
      />
      <div
        className="absolute bottom-0 left-1/3 h-[26rem] w-[26rem] rounded-full bg-gold-400/10 blur-[100px] animate-pulse-glow"
        style={{ animationDelay: "2.1s" }}
        aria-hidden
      />

      <div className="absolute inset-x-0 top-0 flex justify-center gap-24 opacity-30" aria-hidden>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-96 w-40 origin-top bg-gradient-to-b from-white/10 to-transparent"
            style={{
              clipPath: "polygon(35% 0%, 65% 0%, 100% 100%, 0% 100%)",
              animation: `float ${8 + i}s ease-in-out infinite`,
              animationDelay: `${i * 0.7}s`,
            }}
          />
        ))}
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-navy-950/60" aria-hidden />
    </div>
  );
}
