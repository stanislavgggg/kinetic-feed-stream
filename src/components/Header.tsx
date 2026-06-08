import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useApp } from "./AppProviders";
import { getUser } from "@/lib/telegram";
import { BRAND } from "@/lib/brand";
import { LangSwitcher } from "./LangSwitcher";

function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

export function Header() {
  const { config, t } = useApp();
  const user = typeof window !== "undefined" ? getUser() : null;
  const name = config?.display_name || BRAND.name;
  const initial = (user?.first_name || user?.username || "•")[0]?.toUpperCase();
  const now = useClock();
  const hhmm = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
  const ss = now.getSeconds().toString().padStart(2, "0");

  return (
    <header
      className="sticky top-0 z-30 -mx-4 px-4 glass"
      style={{ paddingTop: "var(--safe-top)" }}
    >
      <div className="wrap flex items-center justify-between gap-3 py-2">
        <Link to="/" className="flex items-center gap-2.5 min-h-[40px]">
          <span className="relative inline-grid place-items-center">
            <span className="absolute inset-0 -m-1.5 rounded-full bg-signal/40 blur-md glow-pulse" />
            <span className="relative inline-block h-2.5 w-2.5 rounded-full bg-signal shadow-[0_0_10px_var(--color-signal-glow)]" />
          </span>
          <span className="display text-[18px] font-extrabold tracking-tight uppercase headline-gradient whitespace-nowrap">
            {name}
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <div className="mono hidden sm:flex items-center gap-1 text-[11px] text-muted-foreground tabular-nums">
            <span className="text-foreground">{hhmm}</span>
            <span className="opacity-50">:{ss}</span>
          </div>
          <LangSwitcher />
          {user?.photo_url ? (
            <img src={user.photo_url} alt="" className="h-9 w-9 rounded-full border border-border object-cover" />
          ) : (
            <div className="grid h-9 w-9 place-items-center rounded-full border border-border bg-card text-xs font-semibold">
              {initial}
            </div>
          )}
        </div>
      </div>
      <BreakingStrap label={t.liveDot} tagline={BRAND.tagline.en} hhmm={hhmm} ss={ss} />
      <div className="hr-gradient" />
    </header>
  );
}


function BreakingStrap({ label, tagline, hhmm, ss }: { label: string; tagline: string; hhmm: string; ss: string }) {
  return (
    <div className="relative -mx-4 overflow-hidden">
      <div
        className="flex items-stretch text-[11px] min-w-0"
        style={{
          paddingLeft: "max(env(safe-area-inset-left), 1rem)",
          paddingRight: "max(env(safe-area-inset-right), 1rem)",
        }}
      >
        <div className="tape-stripe text-signal-foreground px-2.5 py-1 lower-third inline-flex items-center gap-1.5 shrink-0 max-w-[55%]">
          <span className="live-dot bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)] shrink-0" />
          <span className="truncate">{label} · BREAKING</span>
        </div>
        <div className="flex-1 min-w-0 px-2.5 py-1 flex items-center justify-between gap-2 bg-[color-mix(in_oklab,var(--surface-1)_70%,transparent)] backdrop-blur">
          <span className="text-muted-foreground lower-third truncate min-w-0">{tagline}</span>
          <span className="mono text-muted-foreground tabular-nums shrink-0 sm:hidden">{hhmm}<span className="opacity-50">:{ss}</span></span>
          <span className="mono text-muted-foreground hidden sm:inline shrink-0">wire-room · v1</span>
        </div>
      </div>
    </div>
  );
}
