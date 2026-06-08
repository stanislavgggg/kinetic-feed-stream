import { useApp } from "./AppProviders";
import { LangSwitcher } from "./LangSwitcher";
import { BRAND } from "@/lib/brand";
import { haptic } from "@/lib/telegram";
import { openChannelFlow, api } from "@/lib/funnel";
import { Send } from "lucide-react";

export function Onboarding() {
  const { t, setOnboarded, config } = useApp();
  return (
    <div
      className="relative min-h-[100svh] wrap flex flex-col overflow-hidden"
      style={{ paddingTop: "var(--safe-top)", paddingBottom: "var(--safe-bottom)" }}
    >

      {/* Aurora background — cool obsidian + warm signal */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 -left-32 h-[460px] w-[460px] rounded-full bg-signal/25 blur-3xl glow-pulse" />
        <div className="absolute top-40 -right-40 h-[420px] w-[420px] rounded-full bg-ember/20 blur-3xl glow-pulse" style={{ animationDelay: "-1.2s" }} />
        <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 h-[480px] w-[480px] rounded-full" style={{ background: "radial-gradient(circle, color-mix(in oklab, var(--signal) 12%, transparent), transparent 70%)" }} />
        <div className="absolute inset-0 scanlines opacity-30" />
      </div>

      <div className="flex items-center justify-between py-3">
        <div className="flex items-center gap-2">
          <span className="relative inline-grid place-items-center">
            <span className="absolute -inset-1.5 rounded-full bg-signal/40 blur-md glow-pulse" />
            <span className="relative inline-block h-2.5 w-2.5 rounded-full bg-signal shadow-[0_0_10px_var(--color-signal-glow)]" />
          </span>
          <span className="display uppercase text-xl font-extrabold tracking-tight headline-gradient">{BRAND.name}</span>
        </div>
        <LangSwitcher />
      </div>

      <div className="flex flex-1 flex-col justify-center py-10">
        <div className="inline-flex items-center gap-2 self-start rounded-full btn-signal-soft px-3 py-1 lower-third">
          <span className="live-dot" /> ON AIR · 24/7
        </div>

        <h1 className="display mt-5 text-[56px] leading-[0.92] uppercase">
          <span className="headline-gradient">{t.onboardTitle}</span>
        </h1>
        <p className="mt-5 text-base text-muted-foreground max-w-[36ch]">
          {t.onboardBody}
        </p>

        <div className="mt-8 grid grid-cols-3 gap-2">
          {[
            { c: "Crypto", k: "text-cat-crypto" },
            { c: "Casino", k: "text-cat-casino" },
            { c: "Esports", k: "text-cat-esports" },
          ].map((x, i) => (
            <div
              key={x.c}
              className="edge-glow relative surface-card rounded-xl p-3 card-in"
              style={{ animationDelay: `${i * 90}ms` }}
            >
              <div className={`lower-third ${x.k}`}>● {x.c}</div>
              <div className="mt-1 text-[11px] text-muted-foreground">Wire feed</div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-3 surface-card rounded-xl text-center overflow-hidden">
          {[
            { k: "Sources", v: "120+" },
            { k: "Refresh", v: "60s" },
            { k: "Languages", v: "EN·RU·ES" },
          ].map((s, i) => (
            <div key={s.k} className={`px-2 py-3 ${i < 2 ? "border-r border-border/60" : ""}`}>
              <div className="display text-lg headline-gradient">{s.v}</div>
              <div className="lower-third text-muted-foreground">{s.k}</div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => { haptic("medium"); setOnboarded(true); }}
        className="press-btn signal-sweep relative overflow-hidden mb-6 w-full btn-premium text-base"
      >
        {t.onboardCta}
      </button>


      <p className="pb-6 text-center text-[11px] text-muted-foreground">{t.disclaimer}</p>
    </div>
  );
}
