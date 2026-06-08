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
      {games.length > 1 && (
        <div className="scroll-x -mx-4 px-4 mb-3">
          <div className="inline-flex gap-2">
            {["ALL", ...games].map((g) => {
              const active = game === g;
              return (
                <button
                  key={g}
                  onClick={() => { haptic("selection"); setGame(g); }}
                  className={`press-btn h-9 rounded-full px-4 text-sm lower-third whitespace-nowrap border ${
                    active ? "bg-foreground text-background border-foreground" : "border-border text-muted-foreground"
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
          <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            {q.isError ? t.signalLost : t.emptyLive}
          </div>
        )}
        {filtered.map((m, i) => (
          <MatchCard
            key={String(m.id ?? `${m.team1}-${m.team2}-${i}`)}
            m={m}
            delay={i * 40}
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
  return <div className="h-28 animate-pulse rounded-xl border border-border bg-card" />;
}

function MatchCard({ m, delay, cta, liveLabel, onTap }: { m: BackendMatch; delay: number; cta: string; liveLabel: string; onTap: () => void }) {
  return (
    <div className="card-in rounded-xl border border-border bg-card p-4" style={{ animationDelay: `${delay}ms` }}>
      <div className="flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-2">
          <span className="lower-third text-signal">{m.game?.toUpperCase() || "GAME"}</span>
          {m.league && <span className="text-muted-foreground truncate max-w-[40vw]">· {m.league}</span>}
        </div>
        <span className="inline-flex items-center gap-1.5 lower-third text-signal">
          <span className="live-dot" /> {liveLabel}
        </span>
      </div>
      <div className="mt-3 flex items-center justify-between gap-3">
        <div className="display text-xl uppercase truncate flex-1 text-right">{m.team1}</div>
        <div className="display text-3xl tabular-nums">
          {m.score1 ?? 0}<span className="text-muted-foreground px-1">–</span>{m.score2 ?? 0}
        </div>
        <div className="display text-xl uppercase truncate flex-1">{m.team2}</div>
      </div>
      <button
        onClick={onTap}
        className="press-btn mt-4 h-11 w-full rounded-lg bg-signal text-signal-foreground lower-third"
      >
        {cta}
      </button>
    </div>
  );
}
