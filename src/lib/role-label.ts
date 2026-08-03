import { copy } from "@/lib/copy";

export function getRoleLabel(role: string) {
  const labels = copy.common.roles as Record<string, string>;
  return labels[role] ?? role;
}
