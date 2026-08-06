import { lazyView } from "@/lib/lazy-page-view";

const JadwalView = lazyView(() =>
  import("@/components/schedule/jadwal-view").then((m) => ({
    default: m.JadwalView,
  })),
);

export default function JadwalPage() {
  return <JadwalView />;
}
