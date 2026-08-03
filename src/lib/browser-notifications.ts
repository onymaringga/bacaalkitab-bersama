/**
 * Notifikasi browser lokal saat user menandai pasal selesai.
 * (Bukan push server — muncul dari Browser Notification API.)
 */

const PREF_KEY = "bacaalkitab-celebrate-notif";
const ASKED_KEY = "bacaalkitab-celebrate-notif-asked";

export type NotificationPermissionState =
  | "unsupported"
  | "default"
  | "granted"
  | "denied";

const CONGRATS = [
  (passage: string) => ({
    title: "Selamat!",
    body: `${passage} selesai dibaca. Satu langkah lagi dalam perjalanan Firmanmu.`,
  }),
  (passage: string) => ({
    title: "Hebat, terus setia!",
    body: `Kamu baru menyelesaikan ${passage}. Tuhan memberkati ketekunanmu.`,
  }),
  (passage: string) => ({
    title: "Pasal selesai",
    body: `${passage} sudah ditandai selesai. Luangkan napas singkat—lalu syukuri Firman hari ini.`,
  }),
  (passage: string) => ({
    title: "Bagus kerja!",
    body: `Selamat menyelesaikan ${passage}. Konsistensi kecil membangun iman yang kuat.`,
  }),
];

export function isBrowserNotificationSupported() {
  return typeof window !== "undefined" && "Notification" in window;
}

export function getBrowserNotificationPermission(): NotificationPermissionState {
  if (!isBrowserNotificationSupported()) return "unsupported";
  return Notification.permission as Exclude<
    NotificationPermissionState,
    "unsupported"
  >;
}

export function isCelebrateNotificationEnabled() {
  if (typeof window === "undefined") return true;
  try {
    const raw = window.localStorage.getItem(PREF_KEY);
    if (raw === null) return true;
    return raw === "1";
  } catch {
    return true;
  }
}

export function setCelebrateNotificationEnabled(enabled: boolean) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PREF_KEY, enabled ? "1" : "0");
    window.dispatchEvent(new Event("celebrate-notif-updated"));
  } catch {
    /* ignore */
  }
}

export function subscribeCelebrateNotificationPref(onChange: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("celebrate-notif-updated", onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener("celebrate-notif-updated", onChange);
    window.removeEventListener("storage", onChange);
  };
}

function markAsked() {
  try {
    window.localStorage.setItem(ASKED_KEY, "1");
  } catch {
    /* ignore */
  }
}

export function hasAskedCelebrateNotification() {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(ASKED_KEY) === "1";
  } catch {
    return false;
  }
}

/** Minta izin notifikasi browser (harus dipanggil dari gestur user). */
export async function requestBrowserNotificationPermission(): Promise<NotificationPermissionState> {
  if (!isBrowserNotificationSupported()) return "unsupported";
  markAsked();
  if (Notification.permission === "granted") return "granted";
  if (Notification.permission === "denied") return "denied";
  try {
    const result = await Notification.requestPermission();
    window.dispatchEvent(new Event("celebrate-notif-updated"));
    return result;
  } catch {
    return getBrowserNotificationPermission();
  }
}

function pickCongrats(passage: string) {
  const index = Math.floor(Math.random() * CONGRATS.length);
  return CONGRATS[index]!(passage);
}

function notificationIcon() {
  if (typeof window === "undefined") return undefined;
  return `${window.location.origin}/favicon.ico`;
}

/**
 * Tampilkan ucapan selamat setelah checklist pasal selesai.
 * Meminta izin sekali bila belum pernah ditanya.
 */
export async function celebrateReadingComplete(passage: string) {
  if (typeof window === "undefined") return;
  if (!passage || passage === "Belum dijadwalkan") return;
  if (!isCelebrateNotificationEnabled()) return;
  if (!isBrowserNotificationSupported()) return;

  let permission: NotificationPermission = Notification.permission;
  if (permission === "default" && !hasAskedCelebrateNotification()) {
    const result = await requestBrowserNotificationPermission();
    if (result === "unsupported") return;
    permission = result;
  }
  if (permission !== "granted") return;

  const { title, body } = pickCongrats(passage.trim());

  try {
    const notif = new Notification(title, {
      body,
      icon: notificationIcon(),
      tag: `baca-selesai-${passage}`,
    });
    notif.onclick = () => {
      window.focus();
      notif.close();
    };
  } catch {
    /* Beberapa browser membatasi Notification tanpa service worker */
  }
}
