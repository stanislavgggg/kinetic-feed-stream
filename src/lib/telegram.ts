export type TGUser = { id: number; first_name?: string; username?: string; photo_url?: string; language_code?: string };

export function getTG(): any | null {
  if (typeof window === "undefined") return null;
  return (window as any).Telegram?.WebApp ?? null;
}

export function getUser(): TGUser | null {
  const tg = getTG();
  return tg?.initDataUnsafe?.user ?? null;
}

export function getUid(): number | null {
  const u = getUser();
  return u?.id ?? null;
}

export function ready() {
  const tg = getTG();
  try {
    tg?.ready?.();
    tg?.expand?.();
  } catch {}
}

export function haptic(kind: "light" | "medium" | "heavy" | "selection" | "success" = "light") {
  const tg = getTG();
  try {
    if (kind === "selection") tg?.HapticFeedback?.selectionChanged?.();
    else if (kind === "success") tg?.HapticFeedback?.notificationOccurred?.("success");
    else tg?.HapticFeedback?.impactOccurred?.(kind);
  } catch {}
}

export function openExternal(url: string) {
  const tg = getTG();
  try {
    if (tg?.openLink) {
      tg.openLink(url, { try_instant_view: false });
      return;
    }
  } catch {}
  try {
    window.open(url, "_blank", "noopener,noreferrer");
  } catch {}
}

export function openTelegramLink(url: string) {
  const tg = getTG();
  try {
    if (tg?.openTelegramLink) {
      tg.openTelegramLink(url);
      return;
    }
  } catch {}
  try {
    window.open(url, "_blank", "noopener,noreferrer");
  } catch {}
}
