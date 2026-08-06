import { lazyView } from "@/lib/lazy-page-view";

const KitabExploreView = lazyView(() =>
  import("@/components/kitab/kitab-explore-view").then((m) => ({
    default: m.KitabExploreView,
  })),
);

export default function BacaKitabPage() {
  return <KitabExploreView />;
}
