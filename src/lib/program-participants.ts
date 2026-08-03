import { demoGroups } from "@/lib/demo-data";
import { demoGroupMembers, getInitials } from "@/lib/group-members";
import { getProgramById } from "@/lib/program-history";

export type CertificateCategory =
  | "completion"
  | "participation"
  | "leader"
  | "incomplete";

export type ProgramParticipant = {
  id: string;
  memberId: string;
  name: string;
  email: string;
  groupId: string;
  groupName: string;
  role: "leader" | "member";
  completionRate: number;
  category: CertificateCategory;
  graduated: boolean;
  /** Present when graduated — used for certificate preview */
  certificateId: string | null;
  certificateIssuedAt: string | null;
};

export const CERTIFICATE_CATEGORY_LABEL: Record<CertificateCategory, string> = {
  completion: "Penyelesaian penuh",
  participation: "Partisipasi aktif",
  leader: "Penghargaan ketua",
  incomplete: "Belum lulus",
};

function hashSeed(input: string) {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function resolveCategory(
  programId: string,
  memberId: string,
  role: "leader" | "member",
  rate: number,
  programCompleted: boolean,
): CertificateCategory {
  if (!programCompleted) {
    return rate >= 75 ? "completion" : rate >= 50 ? "participation" : "incomplete";
  }

  const roll = hashSeed(`${programId}:${memberId}`) % 100;

  if (role === "leader" && rate >= 70 && roll < 70) {
    return "leader";
  }
  if (rate >= 85 || roll < 45) {
    return "completion";
  }
  if (rate >= 55 || roll < 75) {
    return "participation";
  }
  return "incomplete";
}

/** Demo peserta per program — berbasis anggota demo + kategori sertifikat. */
export function getProgramParticipants(
  programId: string,
): ProgramParticipant[] {
  const program = getProgramById(programId);
  if (!program) return [];

  const programCompleted = program.status === "completed";
  const issueDate = programCompleted ? program.endDate : null;

  return demoGroupMembers
    .map((member) => {
      const group = demoGroups.find((g) => g.id === member.groupId);
      const adjustedRate = Math.min(
        100,
        Math.max(
          20,
          member.yearToDateRate +
            ((hashSeed(`${programId}:${member.id}`) % 21) - 10),
        ),
      );
      const category = resolveCategory(
        programId,
        member.id,
        member.role,
        adjustedRate,
        programCompleted,
      );
      const graduated =
        programCompleted && category !== "incomplete";

      return {
        id: `${programId}-${member.id}`,
        memberId: member.id,
        name: member.name,
        email: member.email,
        groupId: member.groupId,
        groupName: group?.name ?? "Kelompok",
        role: member.role,
        completionRate: adjustedRate,
        category,
        graduated,
        certificateId: graduated
          ? `cert-${programId}-${member.id}`
          : null,
        certificateIssuedAt: graduated ? issueDate : null,
      };
    })
    .sort((a, b) => {
      if (a.graduated !== b.graduated) return a.graduated ? -1 : 1;
      return b.completionRate - a.completionRate;
    });
}

export function getProgramParticipantStats(programId: string) {
  const participants = getProgramParticipants(programId);
  const graduated = participants.filter((p) => p.graduated);
  return {
    total: participants.length,
    graduated: graduated.length,
    incomplete: participants.length - graduated.length,
    byCategory: {
      completion: graduated.filter((p) => p.category === "completion").length,
      participation: graduated.filter((p) => p.category === "participation")
        .length,
      leader: graduated.filter((p) => p.category === "leader").length,
    },
  };
}

export type ProgramGroupBreakdown = {
  groupId: string;
  groupName: string;
  leaderName: string;
  memberCount: number;
  avgCompletion: number;
  graduatedCount: number;
  incompleteCount: number;
};

export type ProgramDetailInsights = {
  avgCompletion: number;
  leaderCount: number;
  memberCount: number;
  graduationRate: number | null;
  topPerformers: ProgramParticipant[];
  needsAttention: ProgramParticipant[];
  byGroup: ProgramGroupBreakdown[];
};

/** Ringkasan analitik untuk halaman detail program. */
export function getProgramDetailInsights(
  programId: string,
): ProgramDetailInsights | null {
  const program = getProgramById(programId);
  if (!program) return null;

  const participants = getProgramParticipants(programId);
  if (participants.length === 0) {
    return {
      avgCompletion: 0,
      leaderCount: 0,
      memberCount: 0,
      graduationRate: null,
      topPerformers: [],
      needsAttention: [],
      byGroup: [],
    };
  }

  const avgCompletion = Math.round(
    participants.reduce((sum, p) => sum + p.completionRate, 0) /
      participants.length,
  );
  const leaderCount = participants.filter((p) => p.role === "leader").length;
  const memberCount = participants.length - leaderCount;
  const graduated = participants.filter((p) => p.graduated).length;
  const graduationRate =
    program.status === "completed"
      ? Math.round((graduated / participants.length) * 100)
      : null;

  const topPerformers = [...participants]
    .sort((a, b) => b.completionRate - a.completionRate)
    .slice(0, 3);

  const needsAttention = participants
    .filter((p) => p.completionRate < 55)
    .sort((a, b) => a.completionRate - b.completionRate)
    .slice(0, 5);

  const groupIds = [...new Set(participants.map((p) => p.groupId))];
  const byGroup: ProgramGroupBreakdown[] = groupIds
    .map((groupId) => {
      const groupMembers = participants.filter((p) => p.groupId === groupId);
      const group = demoGroups.find((g) => g.id === groupId);
      const graduatedCount = groupMembers.filter((p) => p.graduated).length;
      return {
        groupId,
        groupName: group?.name ?? groupMembers[0]?.groupName ?? "Kelompok",
        leaderName: group?.leaderName ?? "—",
        memberCount: groupMembers.length,
        avgCompletion: Math.round(
          groupMembers.reduce((sum, p) => sum + p.completionRate, 0) /
            groupMembers.length,
        ),
        graduatedCount,
        incompleteCount: groupMembers.length - graduatedCount,
      };
    })
    .sort((a, b) => b.avgCompletion - a.avgCompletion);

  return {
    avgCompletion,
    leaderCount,
    memberCount,
    graduationRate,
    topPerformers,
    needsAttention,
    byGroup,
  };
}

export { getInitials };
