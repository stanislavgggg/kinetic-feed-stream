import { useApp } from "./AppProviders";
import { LangSwitcher } from "./LangSwitcher";
import { BRAND } from "@/lib/brand";
import { haptic } from "@/lib/telegram";

export function Onboarding() {
  const { t, setOnboarded } = useApp();
  return (
    <div className="min-h-[100dvh] wrap flex flex-col">
      <div className="flex items-center justify-between py-3">
        <div className="flex items-center gap-2">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-signal shadow-[0_0_12px_var(--color-signal)] live-dot" />
          <span className="display uppercase text-xl font-extrabold tracking-tight">{BRAND.name}</span>
        </div>
        <LangSwitcher />
      </div>

      <div className="flex flex-1 flex-col justify-center py-10">
        <div className="lower-third text-signal mb-3">● ON AIR</div>
        <h1 className="display text-5xl leading-[0.95] uppercase">
          {t.onboardTitle}
        </h1>
        <p className="mt-5 text-base text-muted-foreground max-w-[34ch]">
          {t.onboardBody}
        </p>

        <div className="mt-8 grid grid-cols-3 gap-2">
          {["Crypto", "Casino", "Esports"].map((c, i) => (
            <div key={c} className="rounded-lg border border-border bg-card/80 p-3 card-in" style={{ animationDelay: `${i * 80}ms` }}>
              <div className="lower-third text-signal">{c}</div>
              <div className="mt-1 text-xs text-muted-foreground">Wire feed</div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => { haptic("medium"); setOnboarded(true); }}
        className="press-btn mb-6 h-14 w-full rounded-xl bg-signal text-signal-foreground display uppercase tracking-widest text-base shadow-[0_10px_30px_-12px_oklch(0.66_0.22_32_/_0.6)]"
      >
        {t.onboardCta}
      </button>

      <p className="pb-6 text-center text-[11px] text-muted-foreground">{t.disclaimer}</p>
    </div>
  );
}
