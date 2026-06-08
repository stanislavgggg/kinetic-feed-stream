import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Lock, ArrowUpRight } from "lucide-react";
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
const catBg: Record<NewsItem["category"], string> = {
  crypto: "bg-cat-crypto/15 border-cat-crypto/40",
  casino: "bg-cat-casino/15 border-cat-casino/40",
  esports: "bg-cat-esports/15 border-cat-esports/40",
};
const catStripe: Record<NewsItem["category"], string> = {
  crypto: "linear-gradient(180deg, var(--color-cat-crypto), transparent)",
  casino: "linear-gradient(180deg, var(--color-cat-casino), transparent)",
  esports: "linear-gradient(180deg, var(--color-cat-esports), transparent)",
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
  const hero = freeItems[0];
  const rest = freeItems.slice(1);
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
                className={`press-btn h-9 rounded-full px-4 text-sm lower-third whitespace-nowrap transition ${
                  active ? "chip-active" : "chip-idle hover:text-foreground"
                }`}
              >
                {c.label(lang, t)}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
        <span className="mono">{updated ? `${t.updated} ${relTime(updated, lang)}` : q.isFetching ? t.refreshing : ""}</span>
        <span className="lower-third inline-flex items-center gap-1">
          {q.isFetching ? <><span className="live-dot" /> {t.refreshing}</> : null}
        </span>
      </div>

      <div className="mt-3 flex flex-col gap-3">
        {q.isLoading && (
          <>
            <HeroSkeleton />
            {Array.from({ length: 4 }).map((_, i) => <NewsSkeleton key={i} />)}
          </>
        )}

        {!q.isLoading && items.length === 0 && (
          <EmptyState text={q.isError ? t.signalLost : t.emptyNews} />
        )}

        {hero && <HeroCard item={hero} lang={lang} />}

        {rest.map((it, i) => (
          <NewsCard key={String(it.id)} item={it} lang={lang} delay={i * 50} />
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

function HeroSkeleton() {
  return <div className="h-64 animate-pulse rounded-2xl surface-card" />;
}

function NewsSkeleton() {
  return (
    <div className="rounded-xl surface-card p-4 animate-pulse">
      <div className="h-3 w-20 bg-muted rounded" />
      <div className="mt-3 h-4 w-3/4 bg-muted rounded" />
      <div className="mt-2 h-3 w-1/2 bg-muted rounded" />
    </div>
  );
}

function HeroCard({ item, lang }: { item: NewsItem; lang: Lang }) {
  const [imgOk, setImgOk] = useState(!!item.image);
  const onTap = () => {
    haptic("light");
    api.event("cta_tap", { surface: "feed_hero", source: item.source });
    openExternal(item.url);
  };
  return (
    <button
      onClick={onTap}
      className="card-in edge-glow group relative overflow-hidden rounded-2xl surface-elevated text-left press-btn"
    >
      {item.image && imgOk ? (
        <div className="relative aspect-[16/10] w-full overflow-hidden">
          <img
            src={item.image}
            alt=""
            onError={() => setImgOk(false)}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            loading="lazy"
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 0%, color-mix(in oklab, var(--surface-1) 60%, transparent) 50%, var(--surface-1) 100%)" }} />
          <div className="absolute left-3 top-3 flex items-center gap-2">
            <span className={`lower-third rounded-md border px-2 py-1 ${catBg[item.category]} ${catColor[item.category]}`}>
              ● {item.category.toUpperCase()}
            </span>
            <span className="lower-third rounded-md btn-signal-soft px-2 py-1 inline-flex items-center gap-1">
              <span className="live-dot" /> TOP
            </span>
          </div>
        </div>
      ) : (
        <div className="relative h-40 w-full overflow-hidden tape-stripe">
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 0%, var(--surface-1) 100%)" }} />
        </div>
      )}
      <div className="relative -mt-12 p-4">
        <h2 className="display text-[26px] leading-[1.02] uppercase">
          <span className="headline-gradient">{item.title}</span>
        </h2>
        {item.summary && (
          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{item.summary}</p>
        )}
        <div className="mt-3 flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="truncate max-w-[40vw]">{item.source}</span>
            <span>·</span>
            <span className="mono">{relTime(item.published_at, lang)}</span>
          </div>
          <span className="inline-flex items-center gap-1 lower-third signal-text">
            Read <ArrowUpRight size={12} className="text-ember" />
          </span>
        </div>
      </div>
    </button>
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
      className="press-btn card-in text-left rounded-xl surface-card p-4 hover:border-foreground/15 transition relative overflow-hidden"
      style={{ animationDelay: `${delay}ms` }}
    >
      <span
        className="absolute left-0 top-0 h-full w-[3px]"
        style={{ background: catStripe[item.category] }}
      />
      <div className="flex items-center gap-2 text-[11px] pl-1">
        <span className={`lower-third ${catColor[item.category]}`}>● {item.category.toUpperCase()}</span>
        <span className="text-muted-foreground">·</span>
        <span className="text-muted-foreground truncate">{item.source}</span>
        <span className="text-muted-foreground">·</span>
        <span className="text-muted-foreground mono">{relTime(item.published_at, lang)}</span>
      </div>
      <div className="mt-2 flex gap-3 pl-1">
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
    <div className="relative h-20 w-20 flex-none overflow-hidden rounded-lg border border-border">
      <img
        src={src}
        onError={() => setOk(false)}
        alt=""
        className="h-full w-full object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-tr from-background/30 to-transparent" />
    </div>
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
    fng.value >= 75 ? "bg-up/15 text-up border-up/40" :
    fng.value <= 25 ? "bg-down/15 text-down border-down/40" :
    "bg-muted text-muted-foreground border-border";
  return (
    <div className="scroll-x -mx-4 px-4">
      <div className="inline-flex gap-2">
        {fng && (
          <div className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3 h-9 ${fngColor}`}>
            <span className="lower-third">{fngLabel}</span>
            <span className="text-sm font-bold tabular-nums mono">{fng.value}</span>
            <span className="text-[11px] opacity-80">{fng.label}</span>
          </div>
        )}
        {market.coins.map((c) => {
          const up = (c.change_24h ?? 0) >= 0;
          return (
            <div key={c.symbol} className="inline-flex shrink-0 items-center gap-2 rounded-full surface-card px-3 h-9">
              <span className="lower-third">{c.symbol.toUpperCase()}</span>
              <span className="text-sm tabular-nums mono">
                {c.price != null ? (c.price >= 1 ? c.price.toLocaleString(undefined, { maximumFractionDigits: 2 }) : c.price.toPrecision(3)) : "—"}
              </span>
              <span className={`text-[11px] tabular-nums mono ${up ? "text-up" : "text-down"}`}>
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
      <div className="relative overflow-hidden rounded-2xl surface-elevated edge-glow">
        <div className="space-y-px">
          {items.map((it) => (
            <div key={String(it.id)} className="p-4 border-b border-border/60">
              <div className="text-[11px] text-muted-foreground">{it.source} · {it.category}</div>
              <div className="mt-1 display text-[18px] uppercase blurred-headline">{it.title}</div>
              <div className="mt-1 h-2 w-2/3 rounded bg-muted blurred-headline" />
            </div>
          ))}
        </div>
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, color-mix(in oklab, var(--surface-1) 10%, transparent) 0%, color-mix(in oklab, var(--surface-1) 75%, transparent) 50%, var(--surface-1) 100%)" }} />
        <button
          ref={ref}
          onClick={onTap}
          className="press-btn absolute inset-0 flex flex-col items-center justify-end gap-3 p-6 text-center"
        >
          <div className="grid h-14 w-14 place-items-center rounded-full btn-signal-soft">
            <Lock size={26} />
          </div>
          <h3 className="display text-2xl uppercase headline-gradient">{t.fullReadsInChannel}</h3>
          <p className="text-sm text-muted-foreground">{t.stickySub}</p>
          <span className="press-btn signal-sweep relative overflow-hidden mt-2 mb-6 inline-flex h-12 items-center rounded-lg btn-signal px-5 lower-third">
            {t.subscribe}
          </span>
        </button>
      </div>
    </div>
  );
}

function StickyCTA({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <div className="fixed inset-x-0 bottom-[68px] z-30 pointer-events-none pb-[env(safe-area-inset-bottom)]">
      <div className="wrap pointer-events-none">
        <div className="pointer-events-auto mb-2 rounded-2xl glass p-2 shadow-2xl">
          <button
            onClick={onClick}
            className="press-btn signal-sweep relative overflow-hidden h-12 w-full rounded-lg btn-signal lower-third"
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
    <div className="surface-card rounded-2xl p-8 text-center">
      <div className="mx-auto mb-3 grid h-10 w-10 place-items-center rounded-full btn-signal-soft">
        <span className="live-dot" />
      </div>
      <div className="text-sm text-muted-foreground">{text}</div>
    </div>
  );
}
