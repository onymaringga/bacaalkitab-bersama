import { lazyView } from "@/lib/lazy-page-view";

const StoriesExploreView = lazyView(() =>
  import("@/components/stories/stories-explore-view").then((m) => ({
    default: m.StoriesExploreView,
  })),
);

export default function BacaKisahPage() {
  return <StoriesExploreView />;
}
