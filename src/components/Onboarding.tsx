import { useApp } from "./AppProviders";
import { LangSwitcher } from "./LangSwitcher";
import { BRAND } from "@/lib/brand";
import { haptic } from "@/lib/telegram";

export function Onboarding() {
  const { t, setOnboarded } = useApp();
  return (
    <div className="relative min-h-[100dvh] wrap flex flex-col overflow-hidden">
      {/* Aurora background */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 -left-24 h-[420px] w-[420px] rounded-full bg-signal/30 blur-3xl glow-pulse" />
        <div className="absolute -bottom-40 -right-24 h-[420px] w-[420px] rounded-full bg-ember/25 blur-3xl glow-pulse" style={{ animationDelay: "-1.2s" }} />
        <div className="absolute inset-0 scanlines opacity-40" />
      </div>

      <div className="flex items-center justify-between py-3">
        <div className="flex items-center gap-2">
          <span className="relative inline-grid place-items-center">
            <span className="absolute -inset-1 rounded-full bg-signal/40 blur-md glow-pulse" />
            <span className="relative inline-block h-2.5 w-2.5 rounded-full bg-signal" />
          </span>
          <span className="display uppercase text-xl font-extrabold tracking-tight headline-gradient">{BRAND.name}</span>
        </div>
        <LangSwitcher />
      </div>

      <div className="flex flex-1 flex-col justify-center py-10">
        <div className="inline-flex items-center gap-2 self-start rounded-full border border-signal/40 bg-signal/10 px-3 py-1 lower-third text-signal">
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
              className="edge-glow relative rounded-xl border border-border bg-card/70 backdrop-blur p-3 card-in"
              style={{ animationDelay: `${i * 90}ms` }}
            >
              <div className={`lower-third ${x.k}`}>● {x.c}</div>
              <div className="mt-1 text-[11px] text-muted-foreground">Wire feed</div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-3 divide-x divide-border/70 rounded-xl border border-border bg-card/60 backdrop-blur text-center">
          {[
            { k: "Sources", v: "120+" },
            { k: "Refresh", v: "60s" },
            { k: "Languages", v: "EN·RU·ES" },
          ].map((s) => (
            <div key={s.k} className="px-2 py-3">
              <div className="display text-lg">{s.v}</div>
              <div className="lower-third text-muted-foreground">{s.k}</div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => { haptic("medium"); setOnboarded(true); }}
        className="press-btn relative overflow-hidden signal-sweep mb-6 h-14 w-full rounded-xl bg-signal text-signal-foreground display uppercase tracking-widest text-base glow-signal"
      >
        {t.onboardCta}
      </button>

      <p className="pb-6 text-center text-[11px] text-muted-foreground">{t.disclaimer}</p>
    </div>
  );
}
