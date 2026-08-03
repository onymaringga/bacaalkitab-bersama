"use client";

import { useState, useSyncExternalStore } from "react";
import { Pencil, Save, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { showToast } from "@/components/ui/toast-host";
import {
  getServerMemberBiodata,
  genderLabel,
  readMemberBiodata,
  subscribeMemberBiodata,
  writeMemberBiodata,
  type MemberBiodata,
} from "@/lib/member-biodata";
import { cn } from "@/lib/utils";

type MemberBiodataCardProps = {
  className?: string;
  emailFallback?: string;
  nameFallback?: string;
};

export function MemberBiodataCard({
  className,
  emailFallback,
  nameFallback,
}: MemberBiodataCardProps) {
  const stored = useSyncExternalStore(
    subscribeMemberBiodata,
    readMemberBiodata,
    getServerMemberBiodata,
  );
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<MemberBiodata | null>(null);
  const data =
    draft ??
    ({
      ...stored,
      fullName: stored.fullName || nameFallback || stored.fullName,
      email: stored.email || emailFallback || stored.email,
    } satisfies MemberBiodata);

  function startEdit() {
    setDraft({ ...stored });
    setEditing(true);
  }

  function cancelEdit() {
    setDraft(null);
    setEditing(false);
  }

  function save() {
    if (!draft) return;
    const next: MemberBiodata = {
      ...draft,
      fullName: draft.fullName.trim() || stored.fullName,
      email: draft.email.trim() || stored.email,
    };
    writeMemberBiodata(next);
    setDraft(null);
    setEditing(false);
    showToast("Biodata tersimpan");
  }

  function update<K extends keyof MemberBiodata>(
    key: K,
    value: MemberBiodata[K],
  ) {
    setDraft((current) => ({ ...(current ?? stored), [key]: value }));
  }

  return (
    <section
      className={cn(
        "overflow-hidden rounded-2xl border border-[var(--m-line)] bg-white/90",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3 border-b border-[var(--m-line)] px-4 py-3 sm:px-5">
        <div>
          <h2 className="text-sm font-semibold text-[var(--m-ink)]">Biodata</h2>
          <p className="mt-0.5 text-xs text-[var(--m-ink-soft)]">
            Data diri untuk akun member
          </p>
        </div>
        {!editing ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 rounded-lg"
            onClick={startEdit}
          >
            <Pencil className="size-3.5" />
            Ubah
          </Button>
        ) : (
          <div className="flex items-center gap-1.5">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 gap-1 rounded-lg"
              onClick={cancelEdit}
            >
              <X className="size-3.5" />
              Batal
            </Button>
            <Button
              type="button"
              size="sm"
              className="h-8 gap-1.5 rounded-lg"
              onClick={save}
            >
              <Save className="size-3.5" />
              Simpan
            </Button>
          </div>
        )}
      </div>

      {editing ? (
        <div className="space-y-3.5 p-4 sm:p-5">
          <FieldGrid>
            <Field label="Nama lengkap">
              <Input
                value={data.fullName}
                onChange={(e) => update("fullName", e.target.value)}
                placeholder="Nama lengkap"
              />
            </Field>
            <Field label="Nama panggilan">
              <Input
                value={data.nickname}
                onChange={(e) => update("nickname", e.target.value)}
                placeholder="Nama panggilan"
              />
            </Field>
            <Field label="Email">
              <Input
                type="email"
                value={data.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="email@contoh.com"
              />
            </Field>
            <Field label="No. HP / WhatsApp">
              <Input
                value={data.phone}
                onChange={(e) => update("phone", e.target.value)}
                placeholder="08xx-xxxx-xxxx"
              />
            </Field>
            <Field label="Tanggal lahir">
              <Input
                type="date"
                value={data.birthDate}
                onChange={(e) => update("birthDate", e.target.value)}
              />
            </Field>
            <Field label="Jenis kelamin">
              <Select
                value={data.gender || "unset"}
                onValueChange={(value) =>
                  update(
                    "gender",
                    value === "unset"
                      ? ""
                      : (value as MemberBiodata["gender"]),
                  )
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unset">Belum diisi</SelectItem>
                  <SelectItem value="perempuan">Perempuan</SelectItem>
                  <SelectItem value="laki-laki">Laki-laki</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Kota">
              <Input
                value={data.city}
                onChange={(e) => update("city", e.target.value)}
                placeholder="Kota domisili"
              />
            </Field>
            <Field label="Gereja">
              <Input
                value={data.church}
                onChange={(e) => update("church", e.target.value)}
                placeholder="Nama gereja"
              />
            </Field>
            <Field label="Kelompok baca" className="sm:col-span-2">
              <Input
                value={data.groupName}
                onChange={(e) => update("groupName", e.target.value)}
                placeholder="Nama kelompok"
              />
            </Field>
            <Field label="Tentang saya" className="sm:col-span-2">
              <Textarea
                value={data.bio}
                onChange={(e) => update("bio", e.target.value)}
                placeholder="Cerita singkat tentangmu…"
                rows={3}
                className="resize-none"
              />
            </Field>
          </FieldGrid>
        </div>
      ) : (
        <div className="grid gap-px bg-[var(--m-line)] sm:grid-cols-2">
          <BiodataCell label="Nama lengkap" value={data.fullName} />
          <BiodataCell label="Nama panggilan" value={data.nickname} />
          <BiodataCell label="Email" value={data.email} />
          <BiodataCell label="No. HP / WhatsApp" value={data.phone} />
          <BiodataCell
            label="Tanggal lahir"
            value={formatBirthDate(data.birthDate)}
          />
          <BiodataCell label="Jenis kelamin" value={genderLabel(data.gender)} />
          <BiodataCell label="Kota" value={data.city} />
          <BiodataCell label="Gereja" value={data.church} />
          <BiodataCell label="Kelompok baca" value={data.groupName} />
          <BiodataCell label="Tentang saya" value={data.bio} multiline />
        </div>
      )}
    </section>
  );
}

function FieldGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-3.5 sm:grid-cols-2">{children}</div>;
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label className="text-xs text-[var(--m-ink-soft)]">{label}</Label>
      {children}
    </div>
  );
}

function BiodataCell({
  label,
  value,
  multiline,
}: {
  label: string;
  value: string;
  multiline?: boolean;
}) {
  const empty = !value?.trim();
  return (
    <div className="bg-white px-4 py-3.5 sm:px-5">
      <p className="text-[11px] font-medium tracking-wide text-[var(--m-ink-soft)]">
        {label}
      </p>
      <p
        className={cn(
          "mt-1 text-sm text-[var(--m-ink)]",
          multiline && "leading-relaxed",
          empty && "text-[var(--m-ink-soft)] italic",
        )}
      >
        {empty ? "Belum diisi" : value}
      </p>
    </div>
  );
}

function formatBirthDate(value: string) {
  if (!value) return "";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
