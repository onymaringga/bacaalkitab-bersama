"use client";

import { useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { Bell, BellOff, LogOut, Mail, MessageCircle } from "lucide-react";

import { useDemoAuth } from "@/components/auth/demo-auth-provider";
import { LogoutConfirmDialog } from "@/components/auth/logout-confirm-dialog";
import { PageHeader } from "@/components/layout/page-header";
import { BibleFontSizeControl } from "@/components/bible/bible-font-size-control";
import { DownloadBibleBooks } from "@/components/bible/download-bible-books";
import { DemoActionButton } from "@/components/ui/demo-action-button";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/ui/loading-screen";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { showToast } from "@/components/ui/toast-host";
import {
  getBrowserNotificationPermission,
  isBrowserNotificationSupported,
  isCelebrateNotificationEnabled,
  requestBrowserNotificationPermission,
  setCelebrateNotificationEnabled,
  subscribeCelebrateNotificationPref,
} from "@/lib/browser-notifications";
import { copy } from "@/lib/copy";
import { demoTodayReading } from "@/lib/demo-data";
import {
  getServerMemberBiodata,
  readMemberBiodata,
  subscribeMemberBiodata,
} from "@/lib/member-biodata";
import { formatPhoneDisplay, toWhatsAppPhone } from "@/lib/phone";
import { sendReminderEmail } from "@/lib/reminder-email";
import { sendReminderWhatsApp } from "@/lib/reminder-whatsapp";
import { cn } from "@/lib/utils";

const SETTINGS_KEY = "bab-user-settings";

type ReminderChannel = "email" | "whatsapp" | "both";

type UserSettings = {
  bibleVersion: string;
  reminderTime: string;
  language: string;
  reminderChannel: ReminderChannel;
};

const defaults: UserSettings = {
  bibleVersion: "TB",
  reminderTime: "06:00",
  language: "id",
  reminderChannel: "email",
};

const SERVER_NOTIF_SNAPSHOT = JSON.stringify({
  enabled: true,
  permission: "unsupported",
  supported: false,
});

function getServerSettings() {
  return defaults;
}

function getServerNotifSnapshot() {
  return SERVER_NOTIF_SNAPSHOT;
}

let cachedRaw: string | null = null;
let cachedSettings: UserSettings = defaults;
let hasCache = false;

function normalizeChannel(value: unknown): ReminderChannel {
  if (value === "whatsapp" || value === "both" || value === "email") {
    return value;
  }
  return "email";
}

function readSettings(): UserSettings {
  if (typeof window === "undefined") return defaults;
  const raw = window.localStorage.getItem(SETTINGS_KEY);
  if (hasCache && raw === cachedRaw) return cachedSettings;
  cachedRaw = raw;
  hasCache = true;
  if (!raw) {
    cachedSettings = defaults;
    return defaults;
  }
  try {
    const parsed = JSON.parse(raw) as Partial<UserSettings>;
    cachedSettings = {
      ...defaults,
      ...parsed,
      reminderChannel: normalizeChannel(parsed.reminderChannel),
    };
  } catch {
    cachedSettings = defaults;
  }
  return cachedSettings;
}

function writeSettings(settings: UserSettings) {
  const raw = JSON.stringify(settings);
  window.localStorage.setItem(SETTINGS_KEY, raw);
  cachedRaw = raw;
  cachedSettings = settings;
  hasCache = true;
  window.dispatchEvent(new Event("settings-updated"));
}

function subscribe(onChange: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("settings-updated", onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener("settings-updated", onChange);
    window.removeEventListener("storage", onChange);
  };
}

function buildReminderBody(name: string, passage: string, time: string) {
  return `Hai ${name},

Ini pengingat harianmu untuk membaca Alkitab.

Bacaan hari ini: ${passage}.

Jam pengingat: ${time}.

Luangkan waktu singkat untuk Firman — kami mendoakanmu.`;
}

function subscribeNotifPref(onChange: () => void) {
  return subscribeCelebrateNotificationPref(onChange);
}

function readNotifSnapshot() {
  return JSON.stringify({
    enabled: isCelebrateNotificationEnabled(),
    permission: getBrowserNotificationPermission(),
    supported: isBrowserNotificationSupported(),
  });
}

export default function PengaturanPage() {
  const router = useRouter();
  const { logout } = useDemoAuth();
  const [logoutOpen, setLogoutOpen] = useState(false);
  const stored = useSyncExternalStore(subscribe, readSettings, getServerSettings);
  const biodata = useSyncExternalStore(
    subscribeMemberBiodata,
    readMemberBiodata,
    getServerMemberBiodata,
  );
  const notifSnapshot = useSyncExternalStore(
    subscribeNotifPref,
    readNotifSnapshot,
    getServerNotifSnapshot,
  );
  const notifPref = JSON.parse(notifSnapshot) as {
    enabled: boolean;
    permission: string;
    supported: boolean;
  };
  const [draft, setDraft] = useState<UserSettings | null>(null);
  const [testSending, setTestSending] = useState(false);
  const [notifBusy, setNotifBusy] = useState(false);
  const settings = draft ?? stored;
  const reminderEmail = biodata.email.trim();
  const reminderPhone = biodata.phone.trim();
  const waPhone = toWhatsAppPhone(reminderPhone);
  const channel = settings.reminderChannel;

  function update<K extends keyof UserSettings>(key: K, value: UserSettings[K]) {
    setDraft((current) => ({ ...(current ?? stored), [key]: value }));
  }

  async function sendTestReminder() {
    const wantsEmail = channel === "email" || channel === "both";
    const wantsWhatsapp = channel === "whatsapp" || channel === "both";

    if (wantsEmail && !reminderEmail) {
      showToast("Email di biodata belum diisi");
      return;
    }
    if (wantsWhatsapp && !waPhone) {
      showToast("Nomor HP di biodata belum valid untuk WhatsApp");
      return;
    }

    setTestSending(true);
    try {
      const passage = demoTodayReading?.passage ?? "bacaan hari ini";
      const body = buildReminderBody(
        biodata.nickname || biodata.fullName,
        passage,
        settings.reminderTime,
      );
      const subject = `Pengingat baca Alkitab · ${settings.reminderTime}`;
      const sent: string[] = [];

      if (wantsEmail) {
        const result = await sendReminderEmail({
          to: reminderEmail,
          subject,
          body,
          kind: "daily",
        });
        if (!result.ok) {
          showToast(result.error);
          return;
        }
        sent.push(`email ${reminderEmail}`);
      }

      if (wantsWhatsapp) {
        const result = await sendReminderWhatsApp({
          to: reminderPhone,
          body,
          kind: "daily",
        });
        if (!result.ok) {
          showToast(result.error);
          return;
        }
        sent.push(
          result.mode === "deeplink"
            ? `WhatsApp ${formatPhoneDisplay(reminderPhone)} (buka chat)`
            : `WhatsApp ${formatPhoneDisplay(reminderPhone)}`,
        );
        if (result.mode === "deeplink") {
          showToast(
            "WhatsApp terbuka dengan pesan siap kirim. Ketuk Kirim di aplikasi.",
          );
          return;
        }
      }

      showToast(`Pengingat uji terkirim via ${sent.join(" & ")}`);
    } finally {
      setTestSending(false);
    }
  }

  const canTest =
    ((channel === "email" || channel === "both") && Boolean(reminderEmail)) ||
    ((channel === "whatsapp" || channel === "both") && Boolean(waPhone));

  const testLabel =
    channel === "whatsapp"
      ? "Uji kirim WhatsApp"
      : channel === "both"
        ? "Uji kirim"
        : "Uji kirim email";

  return (
    <>
      <PageHeader
        backHref="/profil"
        backLabel="Kembali ke profil"
        title="Pengaturan"
        hint="Atur preferensi baca, bahasa, dan pengingat harian via email atau WhatsApp."
      />

      <div className="space-y-4">
        <Card className="shadow-[var(--shadow-soft)]">
          <CardHeader>
            <CardTitle className="text-base">Alkitab & bahasa</CardTitle>
            <CardDescription>
              Pilih versi Alkitab, ukuran huruf, dan bahasa antarmuka.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Versi Alkitab</Label>
              <Select
                value={settings.bibleVersion}
                onValueChange={(value) => update("bibleVersion", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih versi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TB">TB — Terjemahan Baru</SelectItem>
                  <SelectItem value="BIS">
                    BIS — Bahasa Indonesia Sehari-hari
                  </SelectItem>
                  <SelectItem value="AYT">AYT — Alkitab Yang Terbuka</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Ukuran huruf Alkitab</Label>
              <p className="text-xs text-muted-foreground">
                Perbesar teks supaya lebih nyaman dibaca, termasuk untuk orang
                tua.
              </p>
              <BibleFontSizeControl />
            </div>
            <div className="space-y-2">
              <Label>Bahasa aplikasi</Label>
              <Select
                value={settings.language}
                onValueChange={(value) => update("language", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih bahasa" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="id">Indonesia</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-[var(--shadow-soft)]">
          <CardHeader>
            <CardTitle className="text-base">Unduh Alkitab</CardTitle>
            <CardDescription>
              Simpan beberapa kitab di perangkat supaya baca lebih cepat saat
              jaringan lambat.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DownloadBibleBooks embedded />
          </CardContent>
        </Card>

        <Card className="shadow-[var(--shadow-soft)]">
          <CardHeader>
            <CardTitle className="text-base">Notifikasi selesai baca</CardTitle>
            <CardDescription>
              Saat kamu menandai pasal selesai, browser bisa menampilkan ucapan
              selamat. Izin notifikasi diperlukan sekali.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {!notifPref.supported ? (
              <p className="text-sm text-[var(--m-ink-soft)]">
                Browser ini belum mendukung notifikasi.
              </p>
            ) : (
              <>
                <div className="flex items-center justify-between gap-3 rounded-xl border border-[var(--m-line)] bg-[var(--m-wash)]/55 px-3 py-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[var(--m-ink)]">
                      Ucapan selamat
                    </p>
                    <p className="mt-0.5 text-xs text-[var(--m-ink-soft)]">
                      {notifPref.permission === "granted"
                        ? "Izin sudah aktif"
                        : notifPref.permission === "denied"
                          ? "Izin ditolak — aktifkan lewat pengaturan browser"
                          : "Belum diberi izin"}
                    </p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={notifPref.enabled}
                    disabled={notifPref.permission === "denied"}
                    onClick={() => {
                      const next = !notifPref.enabled;
                      setCelebrateNotificationEnabled(next);
                      showToast(
                        next
                          ? "Notifikasi selesai baca diaktifkan"
                          : "Notifikasi selesai baca dimatikan",
                      );
                    }}
                    className={cn(
                      "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold transition",
                      notifPref.enabled
                        ? "bg-[var(--m-accent)] text-white"
                        : "border border-[var(--m-line)] bg-white text-[var(--m-ink-soft)]",
                      notifPref.permission === "denied" && "opacity-50",
                    )}
                  >
                    {notifPref.enabled ? (
                      <Bell className="size-3.5" />
                    ) : (
                      <BellOff className="size-3.5" />
                    )}
                    {notifPref.enabled ? "Aktif" : "Mati"}
                  </button>
                </div>

                {notifPref.permission !== "granted" &&
                notifPref.permission !== "denied" ? (
                  <Button
                    type="button"
                    variant="outline"
                    className="h-10 w-full rounded-xl font-semibold"
                    disabled={notifBusy}
                    onClick={() => {
                      void (async () => {
                        setNotifBusy(true);
                        try {
                          const result =
                            await requestBrowserNotificationPermission();
                          if (result === "granted") {
                            setCelebrateNotificationEnabled(true);
                            showToast("Izin notifikasi diberikan");
                          } else if (result === "denied") {
                            showToast(
                              "Izin ditolak. Aktifkan lewat pengaturan browser.",
                            );
                          }
                        } finally {
                          setNotifBusy(false);
                        }
                      })();
                    }}
                  >
                    <Bell className="size-4" />
                    {notifBusy ? "Meminta izin…" : "Izinkan notifikasi browser"}
                  </Button>
                ) : null}
              </>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-[var(--shadow-soft)]">
          <CardHeader>
            <CardTitle className="text-base">
              {copy.profile.reminder.title}
            </CardTitle>
            <CardDescription>
              {copy.profile.reminder.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>{copy.profile.reminder.channelLabel}</Label>
              <div className="grid grid-cols-3 gap-1 rounded-xl border border-[var(--m-line)] bg-[var(--m-wash)]/50 p-1">
                {(
                  [
                    ["email", copy.profile.reminder.channelEmail, Mail],
                    ["whatsapp", copy.profile.reminder.channelWhatsapp, MessageCircle],
                    ["both", copy.profile.reminder.channelBoth, null],
                  ] as const
                ).map(([value, label, Icon]) => {
                  const active = channel === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => update("reminderChannel", value)}
                      className={cn(
                        "inline-flex h-9 items-center justify-center gap-1.5 rounded-lg px-1.5 text-[11px] font-semibold transition-colors sm:text-xs",
                        active
                          ? "bg-[var(--m-accent)] text-white"
                          : "text-[var(--m-ink-soft)] hover:bg-white/90 hover:text-[var(--m-ink)]",
                      )}
                    >
                      {Icon ? <Icon className="size-3.5 shrink-0" /> : null}
                      <span className="truncate">{label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {(channel === "email" || channel === "both") && (
              <div className="flex items-start gap-2.5 rounded-xl border border-[var(--m-line)] bg-[var(--m-wash)]/55 px-3 py-2.5">
                <Mail
                  className="mt-0.5 size-3.5 shrink-0 text-[var(--m-accent)]"
                  aria-hidden
                />
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold tracking-wide text-[var(--m-ink-soft)] uppercase">
                    Email tujuan
                  </p>
                  <p className="mt-0.5 truncate text-sm font-medium text-[var(--m-ink)]">
                    {reminderEmail || "Email belum diisi di biodata"}
                  </p>
                </div>
              </div>
            )}

            {(channel === "whatsapp" || channel === "both") && (
              <div className="flex items-start gap-2.5 rounded-xl border border-[var(--m-line)] bg-[var(--m-wash)]/55 px-3 py-2.5">
                <MessageCircle
                  className="mt-0.5 size-3.5 shrink-0 text-[var(--m-accent)]"
                  aria-hidden
                />
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold tracking-wide text-[var(--m-ink-soft)] uppercase">
                    WhatsApp tujuan
                  </p>
                  <p className="mt-0.5 truncate text-sm font-medium text-[var(--m-ink)]">
                    {waPhone
                      ? formatPhoneDisplay(reminderPhone)
                      : "Nomor HP belum valid di biodata"}
                  </p>
                  <p className="mt-1 text-[11px] text-[var(--m-ink-soft)]">
                    Tanpa WhatsApp Business API, uji kirim membuka chat WhatsApp
                    dengan pesan siap dikirim.
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label>{copy.profile.reminder.timeLabel}</Label>
              <Select
                value={settings.reminderTime}
                onValueChange={(value) => update("reminderTime", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih waktu" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="05:30">05:30</SelectItem>
                  <SelectItem value="06:00">06:00</SelectItem>
                  <SelectItem value="07:00">07:00</SelectItem>
                  <SelectItem value="20:00">20:00</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <DemoActionButton
                className="h-11 flex-1 rounded-xl font-semibold"
                successMessage="Pengaturan tersimpan"
                onAction={() => {
                  writeSettings(settings);
                  setDraft(null);
                }}
              >
                {copy.profile.reminder.save} pengaturan
              </DemoActionButton>
              <Button
                type="button"
                variant="outline"
                className="h-11 gap-2 rounded-xl font-semibold sm:flex-none"
                disabled={testSending || !canTest}
                onClick={() => void sendTestReminder()}
              >
                {testSending ? (
                  <>
                    <LoadingSpinner size="sm" />
                    Mengirim…
                  </>
                ) : (
                  <>
                    {channel === "whatsapp" ? (
                      <MessageCircle className="size-4" />
                    ) : (
                      <Mail className="size-4" />
                    )}
                    {testLabel}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-[var(--shadow-soft)]">
          <CardHeader>
            <CardTitle className="text-base">Akun</CardTitle>
            <CardDescription>
              Keluar dari sesi di perangkat ini.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              type="button"
              variant="outline"
              className="h-11 w-full gap-2 rounded-xl border-red-200 font-semibold text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={() => setLogoutOpen(true)}
            >
              <LogOut className="size-4" />
              {copy.profile.access.logout}
            </Button>
          </CardContent>
        </Card>
      </div>

      <LogoutConfirmDialog
        open={logoutOpen}
        onOpenChange={setLogoutOpen}
        onConfirm={() => {
          logout();
          router.push("/login");
        }}
      />
    </>
  );
}
