import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api, openChannelFlow, type BackendMatch } from "@/lib/funnel";
import { useApp } from "./AppProviders";
import { haptic } from "@/lib/telegram";

export function LiveView() {
  const { t, config } = useApp();
  const [game, setGame] = useState<string>("ALL");

  const q = useQuery({
    queryKey: ["live"],
    queryFn: ({ signal }) => api.live(signal),
    refetchInterval: 60_000,
    staleTime: 30_000,
  });

  const matches = q.data?.matches ?? [];
  const games = useMemo(() => {
    const set = new Set<string>();
    matches.forEach((m) => m.game && set.add(m.game.toUpperCase()));
    return Array.from(set);
  }, [matches]);
  const filtered = game === "ALL" ? matches : matches.filter((m) => m.game?.toUpperCase() === game);

  return (
    <div className="pb-10">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="live-dot" />
          <h2 className="display uppercase text-xl headline-gradient">{t.live}</h2>
        </div>
        <span className="lower-third text-muted-foreground mono">
          {filtered.length} {filtered.length === 1 ? "match" : "matches"}
        </span>
      </div>

      {games.length > 1 && (
        <div className="scroll-x -mx-4 px-4 mb-3">
          <div className="inline-flex gap-2">
            {["ALL", ...games].map((g) => {
              const active = game === g;
              return (
                <button
                  key={g}
                  onClick={() => { haptic("selection"); setGame(g); }}
                  className={`press-btn h-11 rounded-full px-4 text-sm lower-third whitespace-nowrap transition ${
                    active ? "chip-active" : "chip-idle hover:text-foreground"
                  }`}

                >
                  {g}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {q.isLoading && Array.from({ length: 4 }).map((_, i) => <Skel key={i} />)}
        {!q.isLoading && filtered.length === 0 && (
          <div className="surface-card rounded-2xl p-10 text-center">
            <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full btn-signal-soft">
              <span className="live-dot" />
            </div>
            <div className="text-sm text-muted-foreground">{q.isError ? t.signalLost : t.emptyLive}</div>
          </div>
        )}
        {filtered.map((m, i) => (
          <MatchCard
            key={String(m.id ?? `${m.team1}-${m.team2}-${i}`)}
            m={m}
            delay={i * 50}
            cta={t.watchInChannel}
            liveLabel={t.liveDot}
            onTap={() => openChannelFlow(config, "live_match")}
          />
        ))}
      </div>
    </div>
  );
}

function Skel() {
  return <div className="h-32 animate-pulse rounded-2xl surface-card" />;
}

function MatchCard({ m, delay, cta, liveLabel, onTap }: { m: BackendMatch; delay: number; cta: string; liveLabel: string; onTap: () => void }) {
  const s1 = m.score1 ?? 0;
  const s2 = m.score2 ?? 0;
  const leading = s1 === s2 ? 0 : s1 > s2 ? 1 : 2;
  return (
    <div
      className="card-in edge-glow relative overflow-hidden rounded-2xl surface-card p-4"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div aria-hidden className="pointer-events-none absolute -top-16 -right-12 h-40 w-40 rounded-full bg-signal/15 blur-3xl" />

      <div className="relative flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-2 min-w-0">
          <span className="lower-third rounded-md btn-signal-soft px-1.5 py-0.5">
            {m.game?.toUpperCase() || "GAME"}
          </span>
          {m.league && <span className="text-muted-foreground truncate max-w-[40vw]">{m.league}</span>}
        </div>
        <span className="inline-flex items-center gap-1.5 lower-third text-signal">
          <span className="live-dot" /> {liveLabel}
        </span>
      </div>

      <div className="relative mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <div className={`text-right truncate ${leading === 1 ? "text-foreground" : "text-muted-foreground"}`}>
          <div className="display text-xl uppercase truncate">{m.team1}</div>
        </div>
        <div className="display tabular-nums mono inline-flex items-baseline gap-1 leading-none" style={{ fontSize: "clamp(30px, 9vw, 38px)" }}>
          <span className={leading === 1 ? "signal-text" : ""}>{s1}</span>
          <span className="text-muted-foreground/60 text-2xl">:</span>
          <span className={leading === 2 ? "signal-text" : ""}>{s2}</span>
        </div>

        <div className={`text-left truncate ${leading === 2 ? "text-foreground" : "text-muted-foreground"}`}>
          <div className="display text-xl uppercase truncate">{m.team2}</div>
        </div>
      </div>

      {m.format && (
        <div className="relative mt-2 text-center lower-third text-muted-foreground mono">{m.format}</div>
      )}

      <button
        onClick={onTap}
        className="press-btn signal-sweep relative mt-4 w-full overflow-hidden btn-premium"
      >
        {cta}
      </button>

    </div>
  );
}
