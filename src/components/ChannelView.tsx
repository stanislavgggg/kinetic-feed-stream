import { useEffect } from "react";
import { Send, Radio, Coins, Dice5, ArrowUpRight } from "lucide-react";
import { useApp } from "./AppProviders";
import { api, openChannelFlow } from "@/lib/funnel";
import { BRAND } from "@/lib/brand";
import { pickLocalized } from "@/lib/i18n";

export function ChannelView() {
  const { t, config, lang } = useApp();

  useEffect(() => {
    api.event("cta_view", { surface: "channel_tab" });
  }, []);

  const tagline = pickLocalized(BRAND.tagline, lang, "Live wire");
  const onTap = () => openChannelFlow(config, "channel_tab");

  const posts = [
    { icon: Radio, title: t.channelPost1Title, sub: t.channelPost1Sub, k: "text-cat-esports" },
    { icon: Coins, title: t.channelPost2Title, sub: t.channelPost2Sub, k: "text-cat-crypto" },
    { icon: Dice5, title: t.channelPost3Title, sub: t.channelPost3Sub, k: "text-cat-casino" },
  ];

  return (
    <div className="pb-32">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl surface-elevated edge-glow p-6">
        <div aria-hidden className="pointer-events-none absolute -top-20 -right-16 h-56 w-56 rounded-full bg-signal/25 blur-3xl glow-pulse" />
        <div aria-hidden className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-ember/20 blur-3xl" />

        <div className="relative flex items-center gap-2">
          <span className="live-dot" />
          <span className="lower-third text-signal">ON AIR · 24/7</span>
        </div>

        <h1 className="relative mt-3 display uppercase leading-[0.95]" style={{ fontSize: "clamp(30px, 8vw, 44px)" }}>
          <span className="headline-gradient">{BRAND.name}</span>
        </h1>
        <p className="relative mt-2 text-sm text-muted-foreground max-w-[42ch]">{tagline} · {t.channelTabSub}</p>

        <div className="relative mt-5 inline-flex items-center gap-2 rounded-full btn-signal-soft px-3 py-1 lower-third">
          <span className="live-dot" /> {t.socialProof(3240)}
        </div>
      </div>

      {/* What's inside */}
      <div className="mt-6">
        <div className="lower-third mb-2 text-muted-foreground">{t.channelInside}</div>
        <div className="flex flex-col gap-3">
          {posts.map(({ icon: Icon, title, sub, k }, i) => (
            <div
              key={title}
              className="card-in edge-glow relative overflow-hidden rounded-2xl surface-card p-4"
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <div className="flex items-start gap-3">
                <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl btn-signal-soft ${k}`}>
                  <Icon size={20} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="display text-base uppercase truncate">{title}</div>
                  <div className="mt-1 text-sm text-muted-foreground line-clamp-2">{sub}</div>
                </div>
                <ArrowUpRight size={16} className="text-muted-foreground shrink-0 mt-1" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sticky bottom CTA */}
      <div
        className="fixed inset-x-0 z-30 pointer-events-none"
        style={{ bottom: "calc(72px + var(--safe-bottom))" }}
      >
        <div className="wrap pointer-events-none">
          <div className="pointer-events-auto mb-2 rounded-2xl glass p-2 shadow-2xl">
            <button
              onClick={onTap}
              className="press-btn signal-sweep relative overflow-hidden w-full btn-premium inline-flex items-center justify-center gap-2"
            >
              <Send size={18} />
              {t.openInTelegram}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
