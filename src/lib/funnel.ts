import { BRAND } from "./brand";
import type { Lang } from "./i18n";
import { getUid, openTelegramLink, haptic } from "./telegram";

const BASE = BRAND.apiBase;

const EMPTY_CONFIG: AppConfig = {
  brand: BRAND.name,
  display_name: BRAND.name,
  mode: "channel",
  cta: {
    label: {},
    url: "",
    channel: BRAND.channelHandleFallback,
    channel_url: "",
    gate: false,
    bot_username: BRAND.botUsernameFallback,
    partner_name: "",
  },
};

const EMPTY_MEMBERSHIP: MembershipResponse = {
  uid: null,
  member: false,
  gate: { enabled: false, locked: false, is_member: false, channel: BRAND.channelHandleFallback },
  channel: BRAND.channelHandleFallback,
  configured: false,
};

const EMPTY_NEWS: NewsResponse = {
  items: [],
  market: { coins: [], fng: null, mcap_change_24h: null, btc_dominance: null },
  updated_at: "",
};

const EMPTY_LIVE: { matches: BackendMatch[] } = { matches: [] };

export type NewsCategory = "all" | "crypto" | "casino" | "esports";

export interface NewsItem {
  id: string | number;
  title: string;
  url: string;
  source: string;
  category: "crypto" | "casino" | "esports";
  published_at: string;
  image: string | null;
  summary: string;
}
export interface NewsCoin {
  symbol: string;
  name?: string;
  price: number | null;
  change_24h: number | null;
  image?: string | null;
}
export interface NewsMarket {
  coins: NewsCoin[];
  fng: { value: number; label: string } | null;
  mcap_change_24h: number | null;
  btc_dominance: number | null;
}
export interface NewsResponse {
  items: NewsItem[];
  market: NewsMarket;
  updated_at: string;
}

export interface BackendMatch {
  game: string;
  team1: string;
  team2: string;
  league?: string;
  score1?: number | null;
  score2?: number | null;
  begin_at?: string;
  format?: string;
  id?: number | string;
}

export interface AppConfig {
  brand: string;
  display_name: string;
  mode: "product" | "channel";
  cta: {
    label: Partial<Record<Lang, string>>;
    url: string;
    channel: string;
    channel_url: string;
    gate: boolean;
    bot_username: string;
    partner_name: string;
  };
  privacy_url?: string;
}

export interface BackendGate {
  enabled: boolean;
  locked: boolean;
  is_member: boolean;
  channel: string;
}
export interface MembershipResponse {
  uid: number | null;
  member: boolean;
  gate: BackendGate;
  channel: string;
  configured: boolean;
}

async function getJSON<T>(path: string, signal?: AbortSignal): Promise<T> {
  if (!BASE) {
    throw new Error("VITE_API_BASE is not configured");
  }
  const res = await fetch(`${BASE}${path}`, { signal, headers: { accept: "application/json" } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()) as T;
}

export const api = {
  config: (signal?: AbortSignal) => BASE ? getJSON<AppConfig>("/api/config", signal) : Promise.resolve(EMPTY_CONFIG),
  news: (category: NewsCategory, signal?: AbortSignal) =>
    BASE ? getJSON<NewsResponse>(`/api/news?category=${category}&limit=40`, signal) : Promise.resolve(EMPTY_NEWS),
  live: (signal?: AbortSignal) => BASE ? getJSON<{ matches: BackendMatch[] }>("/api/live", signal) : Promise.resolve(EMPTY_LIVE),
  upcoming: (signal?: AbortSignal) =>
    BASE ? getJSON<{ matches: BackendMatch[] }>("/api/upcoming", signal) : Promise.resolve(EMPTY_LIVE),
  membership: (uid: number | null, signal?: AbortSignal) =>
    BASE ? getJSON<MembershipResponse>(`/api/membership${uid != null ? `?uid=${uid}` : ""}`, signal) : Promise.resolve({ ...EMPTY_MEMBERSHIP, uid }),
  event: (event: "cta_view" | "cta_tap" | "channel_open", meta?: Record<string, unknown>) => {
    if (!BASE) return;
    try {
      const body = JSON.stringify({ event, uid: getUid() ?? undefined, meta });
      fetch(`${BASE}/api/event`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body,
        keepalive: true,
      }).catch(() => {});
    } catch {}
  },
};

export function channelLinkFor(cfg: AppConfig | null): string {
  const fromCfg = cfg?.cta?.channel_url?.trim();
  if (fromCfg && !/example|placeholder/i.test(fromCfg)) return fromCfg;
  const handle = cfg?.cta?.channel?.replace(/^@/, "") || BRAND.channelHandleFallback.replace(/^@/, "");
  if (handle) return `https://t.me/${handle}`;
  const bot = cfg?.cta?.bot_username || BRAND.botUsernameFallback;
  if (bot) return `https://t.me/${bot}?start=join`;
  return "https://t.me/";
}

export function openChannelFlow(cfg: AppConfig | null, surface: string) {
  haptic("medium");
  api.event("cta_tap", { surface });
  api.event("channel_open", { surface });
  openTelegramLink(channelLinkFor(cfg));
}
