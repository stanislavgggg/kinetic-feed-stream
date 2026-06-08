import { useState } from "react";
import { useApp } from "./AppProviders";
import { haptic } from "@/lib/telegram";
import type { Lang } from "@/lib/i18n";

const LANGS: Lang[] = ["en", "ru", "es"];

export function LangSwitcher() {
  const { lang, setLang } = useApp();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => { haptic("selection"); setOpen((v) => !v); }}
        className="press-btn h-8 rounded-md border border-border bg-card px-2 lower-third"
        aria-label="Language"
      >
        {lang.toUpperCase()}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-9 z-50 w-28 overflow-hidden rounded-md border border-border bg-popover shadow-xl">
            {LANGS.map((l) => (
              <button
                key={l}
                onClick={() => { setLang(l); setOpen(false); haptic("light"); }}
                className={`block w-full px-3 py-2 text-left text-sm lower-third ${lang === l ? "text-signal" : "text-foreground"}`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
