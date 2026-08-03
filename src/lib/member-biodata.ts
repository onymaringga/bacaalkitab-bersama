export type MemberBiodata = {
  fullName: string;
  nickname: string;
  email: string;
  phone: string;
  birthDate: string;
  gender: "" | "perempuan" | "laki-laki";
  city: string;
  church: string;
  groupName: string;
  bio: string;
};

export const DEFAULT_MEMBER_BIODATA: MemberBiodata = {
  fullName: "Ony Naraulita Maringga",
  nickname: "Ony",
  email: "onynaraulita@gmail.com",
  phone: "0812-3456-7890",
  birthDate: "1998-03-14",
  gender: "perempuan",
  city: "Jakarta",
  church: "Gereja Kristen Bethany",
  groupName: "TG-16",
  bio: "Suka baca Alkitab di pagi hari sebelum berangkat kerja.",
};

const LEGACY_DEMO_EMAILS = new Set([
  "onynaraulita@bacaalkitab.local",
]);

const BIODATA_KEY = "bacaalkitab-member-biodata";

let cachedRaw: string | null = null;
let cachedBiodata: MemberBiodata = DEFAULT_MEMBER_BIODATA;
let hasCache = false;

function migrateBiodata(biodata: MemberBiodata): MemberBiodata {
  const email = biodata.email.trim().toLowerCase();
  if (LEGACY_DEMO_EMAILS.has(email)) {
    return { ...biodata, email: DEFAULT_MEMBER_BIODATA.email };
  }
  return biodata;
}

export function readMemberBiodata(): MemberBiodata {
  if (typeof window === "undefined") return DEFAULT_MEMBER_BIODATA;
  const raw = window.localStorage.getItem(BIODATA_KEY);
  if (hasCache && raw === cachedRaw) return cachedBiodata;
  cachedRaw = raw;
  hasCache = true;
  if (!raw) {
    cachedBiodata = DEFAULT_MEMBER_BIODATA;
    return cachedBiodata;
  }
  try {
    cachedBiodata = migrateBiodata({
      ...DEFAULT_MEMBER_BIODATA,
      ...(JSON.parse(raw) as Partial<MemberBiodata>),
    });
  } catch {
    cachedBiodata = DEFAULT_MEMBER_BIODATA;
  }
  return cachedBiodata;
}

export function writeMemberBiodata(biodata: MemberBiodata) {
  if (typeof window === "undefined") return;
  const raw = JSON.stringify(biodata);
  window.localStorage.setItem(BIODATA_KEY, raw);
  cachedRaw = raw;
  cachedBiodata = biodata;
  hasCache = true;
  window.dispatchEvent(new Event("member-biodata-updated"));
}

export function subscribeMemberBiodata(onChange: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("member-biodata-updated", onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener("member-biodata-updated", onChange);
    window.removeEventListener("storage", onChange);
  };
}

/** Snapshot SSR — referensi stabil untuk useSyncExternalStore. */
export function getServerMemberBiodata() {
  return DEFAULT_MEMBER_BIODATA;
}

export function genderLabel(gender: MemberBiodata["gender"]) {
  if (gender === "perempuan") return "Perempuan";
  if (gender === "laki-laki") return "Laki-laki";
  return "—";
}
