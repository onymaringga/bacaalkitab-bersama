import { lazyView } from "@/lib/lazy-page-view";

const KelompokView = lazyView(() =>
  import("@/components/group/kelompok-view").then((m) => ({
    default: m.KelompokView,
  })),
);

export default function KelompokPage() {
  return <KelompokView />;
}
