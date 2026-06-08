// Brand-specific config. Swap values here to rebrand.
export const BRAND = {
  name: "Kinetic Feed",
  wordmark: "KINETIC FEED",
  tagline: { en: "Live wire", ru: "Прямой эфир", es: "En vivo" },
  // Build-time fallbacks; runtime /api/config overrides these.
  channelHandleFallback: (import.meta.env.VITE_CHANNEL_HANDLE as string) || "",
  botUsernameFallback: (import.meta.env.VITE_BOT_USERNAME as string) || "",
  apiBase: ((import.meta.env.VITE_API_BASE as string) || "").replace(/\/$/, ""),
};
