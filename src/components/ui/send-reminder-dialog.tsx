"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Bell, Mail, MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/ui/loading-screen";
import { Textarea } from "@/components/ui/textarea";
import { showToast } from "@/components/ui/toast-host";
import { demoTodayReading } from "@/lib/demo-data";
import { formatPhoneDisplay, toWhatsAppPhone } from "@/lib/phone";
import {
  formatReminderRecipientsLabel,
  sendReminderEmail,
} from "@/lib/reminder-email";
import { sendReminderWhatsApp } from "@/lib/reminder-whatsapp";
import { cn } from "@/lib/utils";

export function defaultReminderMessage(recipientName: string) {
  const passage = demoTodayReading?.passage ?? "bacaan hari ini";
  return `Hai ${recipientName}, ada pengingat lembut dari kelompokmu.

Bacaan hari ini: ${passage}.

Luangkan waktu singkat untuk Firman — kami mendoakanmu.`;
}

export function defaultGroupReminderMessage(groupName?: string) {
  const passage = demoTodayReading?.passage ?? "bacaan hari ini";
  const where = groupName ? `kelompok ${groupName}` : "kelompok";
  return `Hai teman-teman ${where},

Pengingat lembut untuk bacaan hari ini: ${passage}.

Mari luangkan waktu singkat bersama Firman — saling menguatkan.`;
}

type ReminderSendChannel = "email" | "whatsapp";

type SendReminderDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipientName: string;
  recipientLabel?: string;
  recipientEmail?: string | string[];
  recipientPhone?: string | string[];
  defaultMessage?: string;
  successMessage?: string;
};

export function SendReminderDialog({
  open,
  onOpenChange,
  recipientName,
  recipientLabel,
  recipientEmail,
  recipientPhone,
  defaultMessage,
  successMessage,
}: SendReminderDialogProps) {
  const preset = defaultMessage ?? defaultReminderMessage(recipientName);
  const [message, setMessage] = useState(preset);
  const [sending, setSending] = useState(false);
  const [channel, setChannel] = useState<ReminderSendChannel>("email");

  const emails = useMemo(() => {
    const list = (
      Array.isArray(recipientEmail)
        ? recipientEmail
        : recipientEmail
          ? [recipientEmail]
          : []
    )
      .map((item) => item.trim())
      .filter(Boolean);
    return [...new Set(list)];
  }, [recipientEmail]);

  const phones = useMemo(() => {
    const list = (
      Array.isArray(recipientPhone)
        ? recipientPhone
        : recipientPhone
          ? [recipientPhone]
          : []
    )
      .map((item) => item.trim())
      .filter((item) => Boolean(toWhatsAppPhone(item)));
    return [...new Set(list)];
  }, [recipientPhone]);

  const emailLabel = formatReminderRecipientsLabel(emails);
  const phoneLabel =
    phones.length === 0
      ? ""
      : phones.length === 1
        ? formatPhoneDisplay(phones[0]!)
        : `${formatPhoneDisplay(phones[0]!)} (+${phones.length - 1} lainnya)`;

  const canEmail = emails.length > 0;
  const canWhatsapp = phones.length > 0;

  useEffect(() => {
    if (open) {
      setMessage(defaultMessage ?? defaultReminderMessage(recipientName));
      if (canWhatsapp && !canEmail) setChannel("whatsapp");
      else setChannel("email");
    }
  }, [open, recipientName, defaultMessage, canEmail, canWhatsapp]);

  async function handleSend() {
    const trimmed = message.trim();
    if (!trimmed) return;

    if (channel === "email") {
      if (!canEmail) {
        showToast("Email penerima tidak tersedia");
        return;
      }
      setSending(true);
      const result = await sendReminderEmail({
        to: emails,
        subject: `Pengingat baca Alkitab · ${recipientLabel ?? recipientName}`,
        body: trimmed,
        kind: "manual",
      });
      setSending(false);
      if (!result.ok) {
        showToast(result.error);
        return;
      }
      onOpenChange(false);
      showToast(
        successMessage ??
          `Pengingat terkirim via email ke ${formatReminderRecipientsLabel(result.recipients)}`,
      );
      return;
    }

    if (!canWhatsapp) {
      showToast("Nomor WhatsApp penerima tidak tersedia");
      return;
    }

    setSending(true);
    const result = await sendReminderWhatsApp({
      to: phones,
      body: trimmed,
      kind: "manual",
    });
    setSending(false);
    if (!result.ok) {
      showToast(result.error);
      return;
    }

    onOpenChange(false);
    if (result.mode === "deeplink") {
      showToast(
        successMessage ??
          "WhatsApp terbuka dengan pesan siap kirim. Ketuk Kirim di aplikasi.",
      );
      return;
    }
    showToast(
      successMessage ??
        `Pengingat terkirim via WhatsApp ke ${phoneLabel}`,
    );
  }

  const canSend =
    channel === "email" ? canEmail : canWhatsapp;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="gap-0 overflow-hidden p-0 sm:max-w-md"
        showCloseButton
      >
        <DialogHeader className="space-y-1 border-b border-border px-5 py-4 pr-12 text-left">
          <DialogTitle className="text-base font-semibold">
            Kirim pengingat
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Untuk {recipientLabel ?? recipientName}. Pesan default siap dipakai
            — bisa kamu sesuaikan.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 px-5 py-4">
          {canEmail || canWhatsapp ? (
            <div className="grid grid-cols-2 gap-1 rounded-xl border border-[var(--m-line)] bg-[var(--m-wash)]/50 p-1">
              <button
                type="button"
                disabled={!canEmail}
                onClick={() => setChannel("email")}
                className={cn(
                  "inline-flex h-8 items-center justify-center gap-1.5 rounded-lg text-xs font-semibold transition-colors",
                  channel === "email"
                    ? "bg-[var(--m-accent)] text-white"
                    : "text-[var(--m-ink-soft)] hover:bg-white/90 hover:text-[var(--m-ink)]",
                  !canEmail && "opacity-40",
                )}
              >
                <Mail className="size-3.5" />
                Email
              </button>
              <button
                type="button"
                disabled={!canWhatsapp}
                onClick={() => setChannel("whatsapp")}
                className={cn(
                  "inline-flex h-8 items-center justify-center gap-1.5 rounded-lg text-xs font-semibold transition-colors",
                  channel === "whatsapp"
                    ? "bg-[var(--m-accent)] text-white"
                    : "text-[var(--m-ink-soft)] hover:bg-white/90 hover:text-[var(--m-ink)]",
                  !canWhatsapp && "opacity-40",
                )}
              >
                <MessageCircle className="size-3.5" />
                WhatsApp
              </button>
            </div>
          ) : null}

          <div className="flex items-start gap-2.5 rounded-xl border border-[var(--m-line)] bg-[var(--m-wash)]/55 px-3 py-2.5">
            {channel === "whatsapp" ? (
              <MessageCircle
                className="mt-0.5 size-3.5 shrink-0 text-[var(--m-accent)]"
                aria-hidden
              />
            ) : (
              <Mail
                className="mt-0.5 size-3.5 shrink-0 text-[var(--m-accent)]"
                aria-hidden
              />
            )}
            <div className="min-w-0">
              <p className="text-[11px] font-semibold tracking-wide text-[var(--m-ink-soft)] uppercase">
                {channel === "whatsapp" ? "Dikirim ke WhatsApp" : "Dikirim ke email"}
              </p>
              <p className="mt-0.5 truncate text-sm font-medium text-[var(--m-ink)]">
                {channel === "whatsapp"
                  ? phoneLabel || "Nomor belum tersedia"
                  : emailLabel || "Email belum tersedia"}
              </p>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <Label htmlFor="reminder-message">Pesan</Label>
              <button
                type="button"
                className="text-xs font-semibold text-primary hover:underline"
                onClick={() =>
                  setMessage(
                    defaultMessage ?? defaultReminderMessage(recipientName),
                  )
                }
              >
                Pakai default
              </button>
            </div>
            <Textarea
              id="reminder-message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              rows={6}
              className="min-h-[9rem] resize-y rounded-xl text-sm leading-relaxed"
              placeholder="Tulis pesan pengingat…"
            />
            <p className="text-[11px] text-muted-foreground">
              Nada lembut, bukan teguran.
              {channel === "whatsapp"
                ? " Tanpa WhatsApp Business API, chat akan dibuka dengan pesan siap kirim."
                : " Pengingat dikirim lewat email."}
            </p>
          </div>

          <div className="flex flex-col-reverse gap-2 border-t border-border pt-4 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              className="h-10 rounded-xl"
              onClick={() => onOpenChange(false)}
              disabled={sending}
            >
              Batal
            </Button>
            <Button
              type="button"
              disabled={sending || !message.trim() || !canSend}
              className={cn(
                "h-10 gap-2 rounded-xl font-semibold",
                sending && "opacity-80",
              )}
              onClick={() => void handleSend()}
            >
              {sending ? (
                <>
                  <LoadingSpinner size="sm" />
                  Mengirim…
                </>
              ) : channel === "whatsapp" ? (
                <>
                  <MessageCircle className="size-4" />
                  Kirim via WhatsApp
                </>
              ) : (
                <>
                  <Mail className="size-4" />
                  Kirim via email
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

type SendReminderButtonProps = {
  recipientName: string;
  recipientLabel?: string;
  recipientEmail?: string | string[];
  recipientPhone?: string | string[];
  defaultMessage?: string;
  successMessage?: string;
  className?: string;
  variant?: "default" | "outline" | "secondary" | "ghost" | "destructive" | "link";
  size?: "default" | "sm" | "lg" | "icon" | "icon-sm";
  children?: ReactNode;
};

/** Tombol yang membuka dialog pengingat dapat dikustomisasi. */
export function SendReminderButton({
  recipientName,
  recipientLabel,
  recipientEmail,
  recipientPhone,
  defaultMessage,
  successMessage,
  className,
  variant = "default",
  size = "default",
  children,
}: SendReminderButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        variant={variant}
        size={size}
        className={cn("gap-2", className)}
        onClick={() => setOpen(true)}
      >
        {children ?? (
          <>
            <Bell className="size-4" />
            Kirim pengingat
          </>
        )}
      </Button>
      <SendReminderDialog
        open={open}
        onOpenChange={setOpen}
        recipientName={recipientName}
        recipientLabel={recipientLabel}
        recipientEmail={recipientEmail}
        recipientPhone={recipientPhone}
        defaultMessage={defaultMessage}
        successMessage={successMessage}
      />
    </>
  );
}
