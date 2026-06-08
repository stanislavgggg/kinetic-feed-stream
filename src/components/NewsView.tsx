import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Lock } from "lucide-react";
import { api, openChannelFlow, type NewsCategory, type NewsItem } from "@/lib/funnel";
import { useApp } from "./AppProviders";
import { relTime, type Lang } from "@/lib/i18n";
import { haptic, openExternal } from "@/lib/telegram";

const FREE_COUNT = 4;

const CATS: { key: NewsCategory; label: (l: Lang, T: ReturnType<typeof useApp>["t"]) => string }[] = [
  { key: "all", label: (_l, T) => T.all },
  { key: "crypto", label: (_l, T) => T.crypto },
  { key: "casino", label: (_l, T) => T.casino },
  { key: "esports", label: (_l, T) => T.esports },
];

const catColor: Record<NewsItem["category"], string> = {
  crypto: "text-cat-crypto",
  casino: "text-cat-casino",
  esports: "text-cat-esports",
};

export function NewsView() {
  const { t, lang, config, gateLocked } = useApp();
  const [cat, setCat] = useState<NewsCategory>("all");
  const [lockViewed, setLockViewed] = useState(false);

  const q = useQuery({
    queryKey: ["news", cat],
    queryFn: ({ signal }) => api.news(cat, signal),
    refetchInterval: 5 * 60_000,
    staleTime: 60_000,
  });

  // Fire cta_view once when the lock becomes visible.
  useEffect(() => {
    if (lockViewed || !gateLocked || !q.data) return;
    if ((q.data.items?.length ?? 0) > FREE_COUNT) {
      api.event("cta_view", { surface: "feed_lock" });
      setLockViewed(true);
    }
  }, [gateLocked, q.data, lockViewed]);

  const items = q.data?.items ?? [];
  const market = q.data?.market;
  const updated = q.data?.updated_at;
  const showLock = gateLocked && items.length > FREE_COUNT;
  const freeItems = showLock ? items.slice(0, FREE_COUNT) : items;
  const lockedItems = showLock ? items.slice(FREE_COUNT, FREE_COUNT + 6) : [];

  return (
    <div className="pb-10">
      <MarketStrip market={market} fngLabel={t.fng} />

      <div className="scroll-x mt-3 -mx-4 px-4">
        <div className="inline-flex gap-2">
          {CATS.map((c) => {
            const active = cat === c.key;
            return (
              <button
                key={c.key}
                onClick={() => { haptic("selection"); setCat(c.key); }}
                className={`press-btn h-9 rounded-full px-4 text-sm lower-third whitespace-nowrap border ${
                  active
                    ? "bg-foreground text-background border-foreground"
                    : "border-border text-muted-foreground"
                }`}
              >
                {c.label(lang, t)}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
        <span>{updated ? `${t.updated} ${relTime(updated, lang)}` : q.isFetching ? t.refreshing : ""}</span>
        <span className="lower-third">{q.isFetching && !q.isLoading ? "●" : ""}</span>
      </div>

      <div className="mt-3 flex flex-col gap-3">
        {q.isLoading && Array.from({ length: 5 }).map((_, i) => <NewsSkeleton key={i} />)}

        {!q.isLoading && items.length === 0 && (
          <EmptyState text={q.isError ? t.signalLost : t.emptyNews} />
        )}

        {freeItems.map((it, i) => (
          <NewsCard key={String(it.id)} item={it} lang={lang} delay={i * 40} />
        ))}

        {showLock && (
          <LockedStack
            items={lockedItems}
            onTap={() => openChannelFlow(config, "feed_lock")}
            t={t}
          />
        )}
      </div>

      {gateLocked && (
        <StickyCTA
          label={t.subscribe}
          onClick={() => openChannelFlow(config, "feed_lock_sticky")}
        />
      )}
    </div>
  );
}

function NewsSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-4 animate-pulse">
      <div className="h-3 w-20 bg-muted rounded" />
      <div className="mt-3 h-4 w-3/4 bg-muted rounded" />
      <div className="mt-2 h-3 w-1/2 bg-muted rounded" />
    </div>
  );
}

function NewsCard({ item, lang, delay }: { item: NewsItem; lang: Lang; delay: number }) {
  const onTap = () => {
    haptic("light");
    api.event("cta_tap", { surface: "feed_item", source: item.source });
    openExternal(item.url);
  };
  return (
    <button
      onClick={onTap}
      className="press-btn card-in text-left rounded-xl border border-border bg-card p-4 active:bg-secondary"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-2 text-[11px]">
        <span className={`lower-third ${catColor[item.category]}`}>● {item.category.toUpperCase()}</span>
        <span className="text-muted-foreground">·</span>
        <span className="text-muted-foreground truncate">{item.source}</span>
        <span className="text-muted-foreground">·</span>
        <span className="text-muted-foreground">{relTime(item.published_at, lang)}</span>
      </div>
      <div className="mt-2 flex gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="display text-[19px] leading-snug line-clamp-2 uppercase">{item.title}</h3>
          {item.summary && (
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{item.summary}</p>
          )}
        </div>
        {item.image && <Thumb src={item.image} />}
      </div>
    </button>
  );
}

function Thumb({ src }: { src: string }) {
  const [ok, setOk] = useState(true);
  if (!ok) return null;
  return (
    <img
      src={src}
      onError={() => setOk(false)}
      alt=""
      className="h-20 w-20 flex-none rounded-lg object-cover border border-border"
      loading="lazy"
    />
  );
}

function MarketStrip({
  market,
  fngLabel,
}: {
  market: { coins: any[]; fng: { value: number; label: string } | null } | undefined;
  fngLabel: string;
}) {
  if (!market || (!market.coins?.length && !market.fng)) return null;
  const fng = market.fng;
  const fngColor =
    !fng ? "" :
    fng.value >= 75 ? "bg-up/15 text-up border-up/30" :
    fng.value <= 25 ? "bg-down/15 text-down border-down/30" :
    "bg-muted text-muted-foreground border-border";
  return (
    <div className="scroll-x -mx-4 px-4">
      <div className="inline-flex gap-2">
        {fng && (
          <div className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3 h-9 ${fngColor}`}>
            <span className="lower-third">{fngLabel}</span>
            <span className="text-sm font-bold tabular-nums">{fng.value}</span>
            <span className="text-[11px] opacity-80">{fng.label}</span>
          </div>
        )}
        {market.coins.map((c) => {
          const up = (c.change_24h ?? 0) >= 0;
          return (
            <div key={c.symbol} className="inline-flex shrink-0 items-center gap-2 rounded-full border border-border bg-card px-3 h-9">
              <span className="lower-third">{c.symbol.toUpperCase()}</span>
              <span className="text-sm tabular-nums">
                {c.price != null ? (c.price >= 1 ? c.price.toLocaleString(undefined, { maximumFractionDigits: 2 }) : c.price.toPrecision(3)) : "—"}
              </span>
              <span className={`text-[11px] tabular-nums ${up ? "text-up" : "text-down"}`}>
                {c.change_24h != null ? `${up ? "▲" : "▼"} ${Math.abs(c.change_24h).toFixed(2)}%` : ""}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LockedStack({
  items,
  onTap,
  t,
}: {
  items: NewsItem[];
  onTap: () => void;
  t: ReturnType<typeof useApp>["t"];
}) {
  const ref = useRef<HTMLButtonElement>(null);
  return (
    <div className="relative mt-1">
      <div className="lower-third mb-2 text-muted-foreground">{t.feedLockHeader}</div>
      <div className="relative overflow-hidden rounded-xl border border-border bg-card">
        <div className="space-y-px">
          {items.map((it) => (
            <div key={String(it.id)} className="p-4 border-b border-border/60">
              <div className="text-[11px] text-muted-foreground">{it.source} · {it.category}</div>
              <div className="mt-1 display text-[18px] uppercase blurred-headline">{it.title}</div>
              <div className="mt-1 h-2 w-2/3 rounded bg-muted blurred-headline" />
            </div>
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-background/70 to-background" />
        <button
          ref={ref}
          onClick={onTap}
          className="press-btn absolute inset-0 flex flex-col items-center justify-end gap-3 p-6 text-center"
        >
          <div className="grid h-14 w-14 place-items-center rounded-full bg-signal/15 text-signal border border-signal/40">
            <Lock size={26} />
          </div>
          <h3 className="display text-2xl uppercase">{t.fullReadsInChannel}</h3>
          <p className="text-sm text-muted-foreground">{t.stickySub}</p>
          <span className="press-btn mt-2 mb-6 inline-flex h-12 items-center rounded-lg bg-signal px-5 text-signal-foreground lower-third">
            {t.subscribe}
          </span>
        </button>
      </div>
    </div>
  );
}

function StickyCTA({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <div className="fixed inset-x-0 bottom-[64px] z-30 pointer-events-none pb-[env(safe-area-inset-bottom)]">
      <div className="wrap pointer-events-none">
        <div className="pointer-events-auto mb-2 rounded-xl border border-border bg-background/90 backdrop-blur p-2 shadow-2xl">
          <button
            onClick={onClick}
            className="press-btn h-12 w-full rounded-lg bg-signal text-signal-foreground lower-third"
          >
            {label}
          </button>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
      {text}
    </div>
  );
}
