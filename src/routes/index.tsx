import { createFileRoute } from "@tanstack/react-router";
import { NewsView } from "@/components/NewsView";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PULSE — Live news. Live scores." },
      { name: "description", content: "Always-on press desk for crypto, casino and esports." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <NewsView />
      <Footer />
    </>
  );
}
