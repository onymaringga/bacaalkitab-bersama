import { lazyView } from "@/lib/lazy-page-view";

const GlossaryExploreView = lazyView(() =>
  import("@/components/glossary/glossary-explore-view").then((m) => ({
    default: m.GlossaryExploreView,
  })),
);

export default function BacaGlosariumPage() {
  return <GlossaryExploreView />;
}
