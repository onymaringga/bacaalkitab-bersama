/** Foto profil demo — wajah beragam dari Unsplash. */
const AVATAR_BY_ID: Record<string, string> = {
  "member-1":
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
  "member-2":
    "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face",
  "member-3":
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
  "member-4":
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
  "member-5":
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face",
  "member-6":
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
  "member-7":
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
  "member-8":
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face",
  "member-9":
    "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=200&h=200&fit=crop&crop=face",
  "member-10":
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&h=200&fit=crop&crop=face",
  "member-11":
    "https://images.unsplash.com/photo-1463453091185-61582044d556?w=200&h=200&fit=crop&crop=face",
  "member-12":
    "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop&crop=face",
  "member-13":
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face",
  "member-14":
    "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop&crop=face",
};

const NAME_HINTS: Record<string, string> = {
  pingkan: "member-1",
  ony: "member-2",
  naraulita: "member-2",
  devitha: "member-3",
  megan: "member-4",
  rafli: "member-5",
  christian: "member-6",
  bisay: "member-6",
  yessica: "member-7",
  tyassari: "member-8",
  daniel: "member-9",
  grace: "member-10",
  michael: "member-11",
  anita: "member-12",
  joshua: "member-13",
  lidya: "member-14",
};

const FALLBACK_POOL = [
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&h=200&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200&h=200&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=200&h=200&fit=crop&crop=face",
];

const CUSTOM_AVATAR_KEY = "bacaalkitab-custom-avatar";
const CURRENT_USER_MEMBER_ID = "member-2";

function hashKey(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

export function getAvatarUrlByMemberId(memberId: string): string {
  if (memberId === CURRENT_USER_MEMBER_ID && typeof window !== "undefined") {
    try {
      const custom = localStorage.getItem(CUSTOM_AVATAR_KEY);
      if (custom) return custom;
    } catch {
      /* ignore */
    }
  }
  return (
    AVATAR_BY_ID[memberId] ??
    FALLBACK_POOL[hashKey(memberId) % FALLBACK_POOL.length]
  );
}

export function getAvatarUrlByName(name: string): string {
  const trimmed = name.trim().toLowerCase();
  if (!trimmed) return FALLBACK_POOL[0];

  for (const [hint, memberId] of Object.entries(NAME_HINTS)) {
    if (trimmed.includes(hint)) {
      return getAvatarUrlByMemberId(memberId);
    }
  }

  return FALLBACK_POOL[hashKey(trimmed) % FALLBACK_POOL.length];
}

/** Foto profil user yang sedang login (bisa diganti di halaman profil). */
export function getCurrentUserAvatarUrl(fallbackName?: string): string {
  if (typeof window !== "undefined") {
    try {
      const custom = localStorage.getItem(CUSTOM_AVATAR_KEY);
      if (custom) return custom;
    } catch {
      /* ignore */
    }
  }
  if (fallbackName) return getAvatarUrlByName(fallbackName);
  return getAvatarUrlByMemberId(CURRENT_USER_MEMBER_ID);
}

export function setCurrentUserAvatarUrl(url: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CUSTOM_AVATAR_KEY, url);
  window.dispatchEvent(new Event("profile-avatar-updated"));
}

export function clearCurrentUserAvatarUrl() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CUSTOM_AVATAR_KEY);
  window.dispatchEvent(new Event("profile-avatar-updated"));
}

export function subscribeProfileAvatar(onChange: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("profile-avatar-updated", onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener("profile-avatar-updated", onChange);
    window.removeEventListener("storage", onChange);
  };
}

export const PROFILE_AVATAR_PRESETS = [
  AVATAR_BY_ID["member-2"],
  AVATAR_BY_ID["member-3"],
  AVATAR_BY_ID["member-5"],
  AVATAR_BY_ID["member-8"],
  AVATAR_BY_ID["member-12"],
  AVATAR_BY_ID["member-1"],
  FALLBACK_POOL[0],
  FALLBACK_POOL[3],
];
