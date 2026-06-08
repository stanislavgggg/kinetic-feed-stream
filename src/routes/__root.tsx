import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { AppShell } from "@/components/AppShell";
import { AppProviders } from "@/components/AppProviders";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center wrap">
      <div className="text-center">
        <div className="display text-6xl text-signal">404</div>
        <p className="mt-2 text-sm text-muted-foreground">Off-air. This page isn't broadcasting.</p>
        <a href="/" className="press-btn mt-6 inline-flex h-11 items-center rounded-lg bg-signal px-4 text-signal-foreground display uppercase tracking-widest text-sm">
          Back to the wire
        </a>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  useEffect(() => { reportLovableError(error, { boundary: "tanstack_root_error_component" }); }, [error]);
  return (
    <div className="flex min-h-[100dvh] items-center justify-center wrap">
      <div className="text-center">
        <div className="display text-3xl">Signal interrupted</div>
        <p className="mt-2 text-sm text-muted-foreground">Something broke on our end.</p>
        <div className="mt-6 flex justify-center gap-2">
          <button onClick={() => { router.invalidate(); reset(); }} className="press-btn h-11 rounded-lg bg-signal px-4 text-signal-foreground display uppercase tracking-widest text-sm">Try again</button>
          <a href="/" className="press-btn h-11 inline-flex items-center rounded-lg border border-border px-4 text-sm">Home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: "PULSE — Live news. Live scores." },
      { name: "description", content: "An always-on press desk for crypto, casino and esports." },
      { name: "theme-color", content: "#1a0e0b" },
      { property: "og:title", content: "PULSE — Live news. Live scores." },
      { property: "og:description", content: "An always-on press desk for crypto, casino and esports." },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Saira+Condensed:wght@500;700;800&family=Public+Sans:wght@400;500;600;700&display=swap",
      },
    ],
    // Telegram script is injected client-side from AppProviders to avoid
    // SSR hydration mismatch (the script mutates <html> style on load).

  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head><HeadContent /></head>
      <body suppressHydrationWarning>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <AppProviders>
        <AppShell>
          <Outlet />
        </AppShell>
      </AppProviders>
    </QueryClientProvider>
  );
}
