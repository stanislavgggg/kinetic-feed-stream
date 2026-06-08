import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  head: () => ({ meta: [{ title: "Privacy — PULSE" }] }),
  component: Privacy,
});

function Privacy() {
  return (
    <article className="wrap py-6 prose-sm text-foreground">
      <Link to="/" className="lower-third text-muted-foreground">← Back</Link>
      <h1 className="display text-3xl uppercase mt-4">Privacy</h1>
      <p className="mt-4 text-sm text-muted-foreground">
        PULSE is an informational service. We use your Telegram user identifier to personalize
        access state (e.g. whether you've joined our channel) and to log anonymous interaction
        events (views, taps). We do not sell personal data. Content is provided "as is" and is
        not financial advice. 18+.
      </p>
      <p className="mt-4 text-sm text-muted-foreground">
        For any privacy request, contact the operator listed in the Telegram channel description.
      </p>
    </article>
  );
}
