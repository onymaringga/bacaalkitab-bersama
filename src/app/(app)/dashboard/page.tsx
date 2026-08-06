import { lazyView } from "@/lib/lazy-page-view";

const DashboardContent = lazyView(() =>
  import("@/components/dashboard/dashboard-content").then((m) => ({
    default: m.DashboardContent,
  })),
);

export default function DashboardPage() {
  return <DashboardContent />;
}
