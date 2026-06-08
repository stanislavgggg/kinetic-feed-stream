import { Link } from "@tanstack/react-router";
import { useApp } from "./AppProviders";
import { getUser } from "@/lib/telegram";
import { BRAND } from "@/lib/brand";
import { LangSwitcher } from "./LangSwitcher";

export function Header() {
  const { config } = useApp();
  const user = typeof window !== "undefined" ? getUser() : null;
  const name = config?.display_name || BRAND.name;
  const initial = (user?.first_name || user?.username || "•")[0]?.toUpperCase();

  return (
    <header className="wrap sticky top-0 z-30 -mx-[max(0px,calc((100%-480px)/2))] px-0">
      <div className="wrap flex items-center justify-between gap-3 py-3">
        <Link to="/" className="flex items-center gap-2">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-signal shadow-[0_0_12px_var(--color-signal)]" />
          <span className="display text-2xl font-extrabold tracking-tight uppercase">{name}</span>
        </Link>
        <div className="flex items-center gap-2">
          <LangSwitcher />
          {user?.photo_url ? (
            <img src={user.photo_url} alt="" className="h-8 w-8 rounded-full border border-border object-cover" />
          ) : (
            <div className="grid h-8 w-8 place-items-center rounded-full border border-border bg-card text-xs font-semibold">
              {initial}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
