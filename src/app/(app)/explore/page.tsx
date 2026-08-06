import { lazyView } from "@/lib/lazy-page-view";

const ExploreHubView = lazyView(() =>
  import("@/components/explore/explore-hub-view").then((m) => ({
    default: m.ExploreHubView,
  })),
);

export default function ExplorePage() {
  return <ExploreHubView />;
}
