import { lazyView } from "@/lib/lazy-page-view";

const PlacesExploreView = lazyView(() =>
  import("@/components/places/places-explore-view").then((m) => ({
    default: m.PlacesExploreView,
  })),
);

export default function BacaPetaPage() {
  return <PlacesExploreView />;
}
