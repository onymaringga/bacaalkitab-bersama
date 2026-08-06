import { lazyView } from "@/lib/lazy-page-view";

const CharactersExploreView = lazyView(() =>
  import("@/components/characters/characters-explore-view").then((m) => ({
    default: m.CharactersExploreView,
  })),
);

export default function BacaTokohPage() {
  return <CharactersExploreView />;
}
