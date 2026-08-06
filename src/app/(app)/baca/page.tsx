import { lazyView } from "@/lib/lazy-page-view";

const BacaView = lazyView(() =>
  import("@/components/baca/baca-view").then((m) => ({
    default: m.BacaView,
  })),
);

export default function BacaPage() {
  return <BacaView />;
}
