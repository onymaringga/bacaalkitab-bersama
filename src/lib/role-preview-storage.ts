export type GroupViewRole = "member" | "leader";

export const ROLE_PREVIEW_STORAGE_KEY = "bacaalkitab-role-preview";

export function readStoredViewRole(): GroupViewRole {
  if (typeof window === "undefined") return "member";
  const stored = localStorage.getItem(ROLE_PREVIEW_STORAGE_KEY);
  return stored === "leader" ? "leader" : "member";
}

export function writeStoredViewRole(role: GroupViewRole) {
  localStorage.setItem(ROLE_PREVIEW_STORAGE_KEY, role);
}
