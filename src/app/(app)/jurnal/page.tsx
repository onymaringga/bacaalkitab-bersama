import { lazyView } from "@/lib/lazy-page-view";

const JournalHubView = lazyView(() =>
  import("@/components/journal/journal-hub-view").then((m) => ({
    default: m.JournalHubView,
  })),
);

export default function JurnalPage() {
  return <JournalHubView />;
}
