import { Link, useRouterState } from "@tanstack/react-router";
import { Newspaper, Radio } from "lucide-react";
import type { ReactNode } from "react";
import { useApp } from "./AppProviders";
import { Onboarding } from "./Onboarding";
import { Ticker } from "./Ticker";
import { Header } from "./Header";
import { haptic } from "@/lib/telegram";

export function AppShell({ children }: { children: ReactNode }) {
  const { onboarded, t, clientReady } = useApp();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const isPrivacy = path.startsWith("/privacy");

  if (!clientReady) {
    return <div className="min-h-[100dvh] bg-background" />;
  }

  if (!onboarded && !isPrivacy) return <Onboarding />;

  return (
    <div className="relative min-h-[100dvh] pb-[calc(72px+env(safe-area-inset-bottom))]">
      <Header />
      <Ticker />
      <main className="wrap pt-3">{children}</main>
      <BottomNav newsLabel={t.news} liveLabel={t.live} path={path} />
    </div>
  );
}

function BottomNav({ newsLabel, liveLabel, path }: { newsLabel: string; liveLabel: string; path: string }) {
  const items = [
    { to: "/", label: newsLabel, icon: Newspaper, active: path === "/" },
    { to: "/live", label: liveLabel, icon: Radio, active: path.startsWith("/live") },
  ] as const;
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur pb-[env(safe-area-inset-bottom)]">
      <div className="wrap grid grid-cols-2">
        {items.map(({ to, label, icon: Icon, active }) => (
          <Link
            key={to}
            to={to}
            onClick={() => haptic("selection")}
            className={`press-btn flex h-[64px] flex-col items-center justify-center gap-1 ${active ? "text-foreground" : "text-muted-foreground"}`}
          >
            <span className="relative">
              {active && <span className="absolute -top-3 left-1/2 h-[3px] w-8 -translate-x-1/2 rounded-full bg-signal" />}
              <Icon size={22} strokeWidth={active ? 2.2 : 1.6} />
            </span>
            <span className="lower-third">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
