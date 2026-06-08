import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/funnel";
import { useApp } from "./AppProviders";

function fmtPrice(p: number | null): string {
  if (p == null) return "—";
  if (p >= 1000) return p.toLocaleString(undefined, { maximumFractionDigits: 0 });
  if (p >= 1) return p.toFixed(2);
  return p.toPrecision(3);
}
function fmtPct(n: number | null): string {
  if (n == null) return "—";
  const s = n > 0 ? "+" : "";
  return `${s}${n.toFixed(2)}%`;
}

export function Ticker() {
  const { t } = useApp();
  // Pull live matches & news (cached by other surfaces).
  const news = useQuery({
    queryKey: ["news", "all"],
    queryFn: ({ signal }) => api.news("all", signal),
    staleTime: 60_000,
  });
  const live = useQuery({
    queryKey: ["live"],
    queryFn: ({ signal }) => api.live(signal),
    staleTime: 30_000,
  });

  const matches = live.data?.matches ?? [];
  const coins = news.data?.market?.coins ?? [];

  type Item = { key: string; left: string; right: string; tone?: "up" | "down" | "signal" };
  const items: Item[] = matches.length
    ? matches.slice(0, 12).map((m, i) => ({
        key: `m${i}`,
        left: `${m.game?.toUpperCase() ?? "LIVE"} · ${m.team1} ${m.score1 ?? 0}–${m.score2 ?? 0} ${m.team2}`,
        right: m.league ?? "",
        tone: "signal",
      }))
    : coins.slice(0, 14).map((c, i) => ({
        key: `c${i}`,
        left: `${c.symbol.toUpperCase()} $${fmtPrice(c.price)}`,
        right: fmtPct(c.change_24h),
        tone: (c.change_24h ?? 0) >= 0 ? "up" : "down",
      }));

  if (!items.length) return <div className="h-7" />;

  const renderRow = (key: string) => (
    <span key={key} className="inline-flex items-center gap-7">
      {items.map((it) => (
        <span key={`${key}-${it.key}`} className="inline-flex items-center gap-2 text-[12px]">
          <span className="text-muted-foreground lower-third">{matches.length ? t.liveDot : t.market}</span>
          <span className="text-foreground">{it.left}</span>
          <span
            className={
              it.tone === "up" ? "text-up" : it.tone === "down" ? "text-down" : "text-signal"
            }
          >
            {it.right}
          </span>
        </span>
      ))}
    </span>
  );

  return (
    <div className="border-y border-border bg-card/60 backdrop-blur overflow-hidden">
      <div className="ticker-track py-1.5">
        {renderRow("a")}
        {renderRow("b")}
      </div>
    </div>
  );
}
