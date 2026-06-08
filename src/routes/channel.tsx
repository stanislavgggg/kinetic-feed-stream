import { createFileRoute } from "@tanstack/react-router";
import { ChannelView } from "@/components/ChannelView";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/channel")({
  head: () => ({
    meta: [
      { title: "Kinetic Feed — Channel" },
      { name: "description", content: "Inside the broadcast: live commentary, crypto desk, casino signal log." },
    ],
  }),
  component: ChannelPage,
});

function ChannelPage() {
  return (
    <>
      <ChannelView />
      <Footer />
    </>
  );
}
