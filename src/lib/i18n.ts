export type Lang = "en" | "ru" | "es";

const LS_KEY = "mp_lang";

export interface Dict {
  news: string; live: string; all: string; crypto: string; casino: string; esports: string;
  updated: string; justNow: string;
  minAgo: (n: number) => string; hourAgo: (n: number) => string; dayAgo: (n: number) => string;
  emptyNews: string; emptyLive: string; signalLost: string; upcoming: string; liveDot: string;
  fullReadsInChannel: string; stickySub: string; subscribe: string; openChannel: string;
  watchInChannel: string; onboardTitle: string; onboardBody: string; onboardCta: string;
  privacy: string; disclaimer: string; language: string; fng: string; market: string;
  refreshing: string; feedLockHeader: string;
  channel: string; channelTabSub: string; openInTelegram: string; joinChannel: string;
  skipForNow: string; livePinnedTitle: string; livePinnedSub: string; liveStickyCta: string;
  socialProof: (n: number) => string; channelInside: string;
  channelPost1Title: string; channelPost1Sub: string;
  channelPost2Title: string; channelPost2Sub: string;
  channelPost3Title: string; channelPost3Sub: string;
}

const dict: Record<Lang, Dict> = {
  en: {
    news: "News",
    live: "Live",
    all: "All",
    crypto: "Crypto",
    casino: "Casino",
    esports: "Esports",
    updated: "Updated",
    justNow: "just now",
    minAgo: (n: number) => `${n}m`,
    hourAgo: (n: number) => `${n}h`,
    dayAgo: (n: number) => `${n}d`,
    emptyNews: "No stories yet. Pull to refresh.",
    emptyLive: "No live matches right now.",
    signalLost: "Signal lost. Check your connection.",
    upcoming: "Upcoming",
    liveDot: "LIVE",
    fullReadsInChannel: "Full reads — in the channel",
    stickySub: "One subscription → full access",
    subscribe: "Subscribe in Telegram",
    openChannel: "Open channel",
    watchInChannel: "Watch in channel",
    onboardTitle: "Live news. Live scores.",
    onboardBody:
      "An always-on press desk for crypto, casino and esports. Stories, scores and signals — one tap away.",
    onboardCta: "Enter the wire",
    privacy: "Privacy",
    disclaimer: "Informational only. 18+. Not financial advice.",
    language: "Language",
    fng: "Fear & Greed",
    market: "Market",
    refreshing: "Refreshing",
    feedLockHeader: "More on the wire",
    channel: "Channel",
    channelTabSub: "Inside the broadcast",
    openInTelegram: "Open in Telegram",
    joinChannel: "Join the channel",
    skipForNow: "Skip for now",
    livePinnedTitle: "Live commentary — in the channel",
    livePinnedSub: "Frame-by-frame calls, odds shifts, and clutch moments",
    liveStickyCta: "Open live wire in Telegram",
    socialProof: (n: number) => `${n.toLocaleString("en-US")} on the wire now`,
    channelInside: "What's inside",
    channelPost1Title: "Match-day live commentary",
    channelPost1Sub: "Round-by-round calls and odds shifts",
    channelPost2Title: "Pre-market crypto desk",
    channelPost2Sub: "Catalysts, on-chain flows, fast takes",
    channelPost3Title: "Casino signal log",
    channelPost3Sub: "Drops, RTP shifts, fresh promos",
  },
  ru: {
    news: "Новости",
    live: "Лайв",
    all: "Все",
    crypto: "Крипто",
    casino: "Казино",
    esports: "Киберспорт",
    updated: "Обновлено",
    justNow: "только что",
    minAgo: (n: number) => `${n} мин`,
    hourAgo: (n: number) => `${n} ч`,
    dayAgo: (n: number) => `${n} д`,
    emptyNews: "Новостей пока нет. Потяните для обновления.",
    emptyLive: "Сейчас нет лайв-матчей.",
    signalLost: "Сигнал потерян. Проверьте соединение.",
    upcoming: "Скоро",
    liveDot: "ЛАЙВ",
    fullReadsInChannel: "Полные материалы — в канале",
    stickySub: "Одна подписка → полный доступ",
    subscribe: "Подписаться в Telegram",
    openChannel: "Открыть канал",
    watchInChannel: "Смотреть в канале",
    onboardTitle: "Живые новости. Живой счёт.",
    onboardBody:
      "Редакция, которая не спит: крипто, казино и киберспорт. Истории, счёт и сигналы в одно касание.",
    onboardCta: "Войти в эфир",
    privacy: "Конфиденциальность",
    disclaimer: "Только информация. 18+. Не финансовый совет.",
    language: "Язык",
    fng: "Индекс страха",
    market: "Рынок",
    refreshing: "Обновляем",
    feedLockHeader: "Ещё в эфире",
    channel: "Канал",
    channelTabSub: "Внутри эфира",
    openInTelegram: "Открыть в Telegram",
    joinChannel: "Вступить в канал",
    skipForNow: "Позже",
    livePinnedTitle: "Лайв-комментарии — в канале",
    livePinnedSub: "Покадровые разборы, движение коэффициентов и клатч-моменты",
    liveStickyCta: "Открыть прямой эфир в Telegram",
    socialProof: (n: number) => `${n.toLocaleString("ru-RU")} сейчас на линии`,
    channelInside: "Что внутри",
    channelPost1Title: "Лайв-комментарии матчей",
    channelPost1Sub: "Раунд за раундом и движение коэффициентов",
    channelPost2Title: "Утренний крипто-деск",
    channelPost2Sub: "Катализаторы, on-chain потоки, быстрые тейки",
    channelPost3Title: "Журнал казино-сигналов",
    channelPost3Sub: "Дропы, RTP, свежие промо",
  },
  es: {
    news: "Noticias",
    live: "En vivo",
    all: "Todo",
    crypto: "Cripto",
    casino: "Casino",
    esports: "Esports",
    updated: "Actualizado",
    justNow: "ahora",
    minAgo: (n: number) => `${n} min`,
    hourAgo: (n: number) => `${n} h`,
    dayAgo: (n: number) => `${n} d`,
    emptyNews: "Sin noticias aún. Desliza para actualizar.",
    emptyLive: "No hay partidos en vivo ahora.",
    signalLost: "Sin señal. Revisa tu conexión.",
    upcoming: "Próximos",
    liveDot: "EN VIVO",
    fullReadsInChannel: "Lecturas completas — en el canal",
    stickySub: "Una suscripción → acceso total",
    subscribe: "Suscribirse en Telegram",
    openChannel: "Abrir canal",
    watchInChannel: "Ver en el canal",
    onboardTitle: "Noticias en vivo. Marcadores en vivo.",
    onboardBody:
      "Una redacción que nunca duerme: cripto, casino y esports. Historias, marcadores y señales a un toque.",
    onboardCta: "Entrar al directo",
    privacy: "Privacidad",
    disclaimer: "Solo informativo. 18+. No es asesoría financiera.",
    language: "Idioma",
    fng: "Miedo y Codicia",
    market: "Mercado",
    refreshing: "Actualizando",
    feedLockHeader: "Más en directo",
    channel: "Canal",
    channelTabSub: "Dentro del directo",
    openInTelegram: "Abrir en Telegram",
    joinChannel: "Unirse al canal",
    skipForNow: "Más tarde",
    livePinnedTitle: "Comentarios en vivo — en el canal",
    livePinnedSub: "Jugada a jugada, movimiento de cuotas y momentos clutch",
    liveStickyCta: "Abrir el directo en Telegram",
    socialProof: (n: number) => `${n.toLocaleString("es-ES")} en línea ahora`,
    channelInside: "Qué hay dentro",
    channelPost1Title: "Comentarios de partidos en vivo",
    channelPost1Sub: "Ronda a ronda y movimientos de cuotas",
    channelPost2Title: "Mesa cripto pre-mercado",
    channelPost2Sub: "Catalizadores, flujos on-chain, tomas rápidas",
    channelPost3Title: "Bitácora de señales de casino",
    channelPost3Sub: "Drops, RTP, promos frescas",
  },
};


export function detectLang(): Lang {
  if (typeof window === "undefined") return "en";
  try {
    const url = new URL(window.location.href);
    const q = url.searchParams.get("lang");
    if (q && ["en", "ru", "es"].includes(q)) return q as Lang;
    const saved = localStorage.getItem(LS_KEY);
    if (saved && ["en", "ru", "es"].includes(saved)) return saved as Lang;
    const tg = (window as any).Telegram?.WebApp?.initDataUnsafe?.user?.language_code as
      | string
      | undefined;
    if (tg) {
      const c = tg.slice(0, 2).toLowerCase();
      if (["en", "ru", "es"].includes(c)) return c as Lang;
    }
    const nav = navigator.language?.slice(0, 2).toLowerCase();
    if (nav && ["en", "ru", "es"].includes(nav)) return nav as Lang;
  } catch {}
  return "en";
}

export function saveLang(lang: Lang) {
  try {
    localStorage.setItem(LS_KEY, lang);
  } catch {}
}

export function t(lang: Lang): Dict {
  return (dict[lang] ?? dict.en) as Dict;
}

export function pickLocalized(
  map: Partial<Record<Lang, string>> | undefined,
  lang: Lang,
  fallback: string,
): string {
  if (!map) return fallback;
  return map[lang] || map.en || fallback;
}

export function relTime(iso: string | undefined, lang: Lang): string {
  if (!iso) return "";
  const T = t(lang);
  const d = new Date(iso).getTime();
  if (isNaN(d)) return "";
  const diff = Math.max(0, Date.now() - d);
  const m = Math.floor(diff / 60000);
  if (m < 1) return T.justNow;
  if (m < 60) return T.minAgo(m);
  const h = Math.floor(m / 60);
  if (h < 24) return T.hourAgo(h);
  const day = Math.floor(h / 24);
  return T.dayAgo(day);
}
