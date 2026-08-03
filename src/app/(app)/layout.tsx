import { AppShell } from "@/components/layout/app-shell";
import { RolePreviewProvider } from "@/components/role-preview/role-preview-provider";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <RolePreviewProvider>
      <AppShell>{children}</AppShell>
    </RolePreviewProvider>
  );
}
