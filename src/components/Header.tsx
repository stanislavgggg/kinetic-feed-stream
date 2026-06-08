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
    <header className="sticky top-0 z-30 -mx-4 px-4 glass">
      <div className="wrap flex items-center justify-between gap-3 py-2.5">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="relative inline-grid place-items-center">
            <span className="absolute inset-0 -m-1 rounded-full bg-signal/30 blur-md glow-pulse" />
            <span className="relative inline-block h-2.5 w-2.5 rounded-full bg-signal" />
          </span>
          <span className="display text-[22px] font-extrabold tracking-tight uppercase headline-gradient">
            {name}
          </span>
          <span className="ml-1 hidden xs:inline lower-third text-muted-foreground">{t.liveDot}</span>
        </Link>
        <div className="flex items-center gap-2">
          <div className="mono hidden sm:flex items-center gap-1 text-[11px] text-muted-foreground tabular-nums">
            <span className="text-foreground">{hhmm}</span>
            <span className="opacity-50">:{ss}</span>
            <span className="opacity-60">UTC{-now.getTimezoneOffset() / 60 >= 0 ? "+" : ""}{-now.getTimezoneOffset() / 60}</span>
          </div>
          <LangSwitcher />
          {user?.photo_url ? (
            <img src={user.photo_url} alt="" className="h-8 w-8 rounded-full border border-border object-cover" />
          ) : (
            <div className="grid h-8 w-8 place-items-center rounded-full border border-border bg-card text-xs font-semibold">
              {initial}
            </div>
          )}
        </div>
      </div>
      <BreakingStrap label={t.liveDot} tagline={BRAND.tagline.en} />
    </header>
  );
}

function BreakingStrap({ label, tagline }: { label: string; tagline: string }) {
  return (
    <div className="relative -mx-4 overflow-hidden">
      <div className="flex items-stretch text-[11px]">
        <div className="tape-stripe text-signal-foreground px-3 py-1 lower-third inline-flex items-center gap-1.5">
          <span className="live-dot bg-white" /> {label} · BREAKING
        </div>
        <div className="flex-1 bg-foreground/[0.04] border-y border-border/60 px-3 py-1 flex items-center justify-between">
          <span className="text-muted-foreground lower-third">{tagline}</span>
          <span className="mono text-muted-foreground">v1 · wire-room</span>
        </div>
      </div>
    </div>
  );
}
