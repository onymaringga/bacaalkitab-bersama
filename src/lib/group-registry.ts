import { demoGroups } from "@/lib/demo-data";
import type { Group } from "@/lib/types";

/** Kelompok tambahan dari aksi demo (tambah kelompok) — hilang saat refresh. */
let createdGroups: Group[] = [];

/** Override hasil edit (demo + created) — hilang saat refresh. */
const groupOverrides = new Map<string, Group>();

export function getAllGroups(): Group[] {
  const base = [...demoGroups, ...createdGroups];
  return base.map((group) => groupOverrides.get(group.id) ?? group);
}

export function getGroupById(groupId: string): Group | undefined {
  return getAllGroups().find((group) => group.id === groupId);
}

export function registerCreatedGroup(group: Group) {
  createdGroups = [...createdGroups.filter((g) => g.id !== group.id), group];
  groupOverrides.delete(group.id);
}

export function updateRegisteredGroup(group: Group) {
  const isCreated = createdGroups.some((g) => g.id === group.id);
  const isDemo = demoGroups.some((g) => g.id === group.id);
  if (isCreated) {
    createdGroups = createdGroups.map((g) =>
      g.id === group.id ? group : g,
    );
    groupOverrides.delete(group.id);
    return;
  }
  if (isDemo) {
    groupOverrides.set(group.id, group);
    return;
  }
  registerCreatedGroup(group);
}
