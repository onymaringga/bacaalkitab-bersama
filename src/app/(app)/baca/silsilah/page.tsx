import { lazyView } from "@/lib/lazy-page-view";

const GenealogyView = lazyView(() =>
  import("@/components/genealogy/genealogy-view").then((m) => ({
    default: m.GenealogyView,
  })),
);

export default function BacaSilsilahPage() {
  return <GenealogyView />;
}
