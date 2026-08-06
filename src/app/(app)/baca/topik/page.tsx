import { lazyView } from "@/lib/lazy-page-view";

const TopicsExploreView = lazyView(() =>
  import("@/components/topics/topics-explore-view").then((m) => ({
    default: m.TopicsExploreView,
  })),
);

export default function BacaTopikPage() {
  return <TopicsExploreView />;
}
