import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { api, type AppConfig, type MembershipResponse } from "@/lib/funnel";
import { detectLang, saveLang, t as tFn, type Dict, type Lang } from "@/lib/i18n";
import { ready, getUid } from "@/lib/telegram";

interface AppCtx {
  lang: Lang;
  t: Dict;
  setLang: (l: Lang) => void;
  config: AppConfig | null;
  membership: MembershipResponse | null;
  refetchMembership: () => void;
  gateLocked: boolean; // gate enabled AND not a member
  onboarded: boolean;
  setOnboarded: (b: boolean) => void;
}

const Ctx = createContext<AppCtx | null>(null);
export function useApp(): AppCtx {
  const v = useContext(Ctx);
  if (!v) throw new Error("AppProviders missing");
  return v;
}

const ONB_KEY = "mp_onboarded_v1";

export function AppProviders({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  const [onboarded, setOnboardedState] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    ready();
    setLangState(detectLang());
    try { setOnboardedState(localStorage.getItem(ONB_KEY) === "1"); } catch {}
    setMounted(true);
  }, []);

  const setLang = useCallback((l: Lang) => { setLangState(l); saveLang(l); }, []);
  const setOnboarded = useCallback((b: boolean) => {
    setOnboardedState(b);
    try { localStorage.setItem(ONB_KEY, b ? "1" : "0"); } catch {}
  }, []);

  const configQ = useQuery({
    queryKey: ["config"],
    queryFn: ({ signal }) => api.config(signal),
    enabled: mounted,
    staleTime: 60_000,
    retry: 1,
  });

  const uid = mounted ? getUid() : null;
  const memQ = useQuery({
    queryKey: ["membership", uid],
    queryFn: ({ signal }) => api.membership(uid, signal),
    enabled: mounted,
    staleTime: 15_000,
    retry: 1,
  });

  // Re-check membership on focus/visibility when gated & not a member.
  useEffect(() => {
    if (!mounted) return;
    const gateOn = !!(configQ.data?.cta?.gate || memQ.data?.gate?.enabled);
    const isMember = !!memQ.data?.member;
    if (!gateOn || isMember) return;
    const handler = () => {
      if (document.visibilityState === "visible") memQ.refetch();
    };
    window.addEventListener("focus", handler);
    document.addEventListener("visibilitychange", handler);
    return () => {
      window.removeEventListener("focus", handler);
      document.removeEventListener("visibilitychange", handler);
    };
  }, [mounted, configQ.data, memQ]);

  const config = configQ.data ?? null;
  const membership = memQ.data ?? null;
  const gateOn = !!(config?.cta?.gate || membership?.gate?.enabled);
  const isMember = !!membership?.member;
  const gateLocked = gateOn && !isMember;

  const t = useMemo(() => tFn(lang), [lang]);
  const value = useMemo<AppCtx>(() => ({
    lang, t, setLang, config, membership,
    refetchMembership: () => { memQ.refetch(); },
    gateLocked, onboarded, setOnboarded,
  }), [lang, t, setLang, config, membership, memQ, gateLocked, onboarded, setOnboarded]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
