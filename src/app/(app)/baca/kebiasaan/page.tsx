import { lazyView } from "@/lib/lazy-page-view";

const CustomsExploreView = lazyView(() =>
  import("@/components/customs/customs-explore-view").then((m) => ({
    default: m.CustomsExploreView,
  })),
);

export default function BacaKebiasaanPage() {
  return <CustomsExploreView />;
}
