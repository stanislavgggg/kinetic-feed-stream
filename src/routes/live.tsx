import { createFileRoute } from "@tanstack/react-router";
import { LiveView } from "@/components/LiveView";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/live")({
  head: () => ({
    meta: [
      { title: "PULSE — Live scores" },
      { name: "description", content: "Live scores wire across games and leagues." },
    ],
  }),
  component: LivePage,
});

function LivePage() {
  return (
    <>
      <LiveView />
      <Footer />
    </>
  );
}
