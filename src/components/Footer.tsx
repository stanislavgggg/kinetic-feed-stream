import { Link } from "@tanstack/react-router";
import { useApp } from "./AppProviders";

export function Footer() {
  const { t } = useApp();
  return (
    <footer className="mt-10 hairline pb-6 pt-4 text-center text-[11px] text-muted-foreground">
      <p>{t.disclaimer}</p>
      <p className="mt-2">
        <Link to="/privacy" className="underline underline-offset-2">{t.privacy}</Link>
      </p>
    </footer>
  );
}
