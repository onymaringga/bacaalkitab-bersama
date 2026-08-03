"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ChevronRight, Plus, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { showToast } from "@/components/ui/toast-host";
import { copy } from "@/lib/copy";
import { demoGroups } from "@/lib/demo-data";
import { demoGroupMembers } from "@/lib/group-members";
import { registerCreatedGroup } from "@/lib/group-registry";
import type { Group } from "@/lib/types";
import { cn } from "@/lib/utils";

type GroupForm = {
  name: string;
  leaderId: string;
  description: string;
};

const emptyForm: GroupForm = {
  name: "",
  leaderId: "",
  description: "",
};

export function AdminGroupsPanel() {
  const [open, setOpen] = useState(false);
  const [groups, setGroups] = useState<Group[]>(() => [...demoGroups]);
  const [form, setForm] = useState<GroupForm>(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const memberOptions = useMemo(() => {
    const byEmail = new Map<string, (typeof demoGroupMembers)[number]>();
    for (const member of demoGroupMembers) {
      if (!byEmail.has(member.email)) {
        byEmail.set(member.email, member);
      }
    }
    return [...byEmail.values()].sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  const selectedLeader = memberOptions.find((m) => m.id === form.leaderId);

  function closeModal() {
    setOpen(false);
    setForm(emptyForm);
    setError(null);
  }

  function updateField<K extends keyof GroupForm>(key: K, value: GroupForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (error) setError(null);
  }

  async function handleCreate() {
    const name = form.name.trim();
    const leader = memberOptions.find((m) => m.id === form.leaderId);

    if (!name) {
      setError("Nama kelompok wajib diisi.");
      return;
    }
    if (!leader) {
      setError("Pilih ketua dari daftar anggota.");
      return;
    }
    if (groups.some((g) => g.name.toLowerCase() === name.toLowerCase())) {
      setError("Nama kelompok sudah dipakai.");
      return;
    }

    setSaving(true);
    await new Promise((resolve) => window.setTimeout(resolve, 350));

    const next: Group = {
      id: `group-${Date.now()}`,
      name,
      description:
        form.description.trim() ||
        "Kelompok baru dalam program baca Alkitab bersama.",
      memberCount: 1,
      leaderName: leader.name,
    };

    setGroups((prev) => [...prev, next]);
    registerCreatedGroup(next);
    setSaving(false);
    showToast("Kelompok berhasil dibuat");
    closeModal();
  }

  return (
    <div className="space-y-4">
      <section className="overflow-hidden rounded-2xl border border-[var(--a-line)] bg-white/90">
        <div className="flex flex-col gap-3 border-b border-[var(--a-line)] bg-[var(--a-wash)]/60 px-4 py-4 sm:flex-row sm:items-center sm:justify-between lg:px-5">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-[var(--a-accent)]">
              <Users className="size-5" />
            </div>
            <div>
              <h3 className="admin-display text-xl text-[var(--a-ink)]">
                {copy.admin.groups.title}
              </h3>
              <p className="mt-0.5 text-sm text-[var(--a-ink-soft)]">
                {groups.length} kelompok aktif di program ini
              </p>
            </div>
          </div>
          <Button
            type="button"
            className="h-10 gap-2 rounded-xl bg-[var(--a-accent)] font-semibold text-white hover:bg-[#2563eb]"
            onClick={() => setOpen(true)}
          >
            <Plus className="size-4" />
            Tambah kelompok
          </Button>
        </div>

        <ul className="divide-y divide-[var(--a-line)]">
          {groups.map((group, index) => (
            <li key={group.id}>
              <Link
                href={`/admin/kelompok/${group.id}`}
                className="flex items-start gap-3 px-4 py-4 transition-colors hover:bg-[var(--a-wash)]/50 lg:px-5"
              >
                <span className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-[var(--a-wash)] font-mono text-xs font-semibold text-[var(--a-accent)]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-[var(--a-ink)]">
                    {group.name}
                  </p>
                  <p className="mt-0.5 text-xs text-[var(--a-ink-soft)]">
                    Ketua: {group.leaderName} · {group.memberCount} anggota
                  </p>
                  {group.description ? (
                    <p className="mt-1.5 text-sm leading-relaxed text-[var(--a-ink-soft)]">
                      {group.description}
                    </p>
                  ) : null}
                </div>
                <ChevronRight className="mt-1.5 size-4 shrink-0 text-[var(--a-ink-soft)]/60" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <Dialog
        open={open}
        onOpenChange={(next) => {
          if (!next) closeModal();
          else setOpen(true);
        }}
      >
        <DialogContent
          showCloseButton
          className="gap-0 overflow-hidden p-0 sm:max-w-md"
        >
          <DialogHeader className="space-y-1 border-b border-[var(--a-line)] px-5 py-4 pr-12 text-left">
            <DialogTitle className="text-base font-semibold text-[var(--a-ink)]">
              Tambah kelompok
            </DialogTitle>
            <DialogDescription className="text-sm text-[var(--a-ink-soft)]">
              Isi nama kelompok dan pilih ketua dari daftar anggota.
            </DialogDescription>
          </DialogHeader>

          <form
            className="space-y-3.5 px-5 py-4"
            onSubmit={(event) => {
              event.preventDefault();
              void handleCreate();
            }}
          >
            <div className="space-y-1.5">
              <Label htmlFor="modal-group-name">Nama kelompok</Label>
              <Input
                id="modal-group-name"
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
                placeholder={copy.admin.groups.namePlaceholder}
                className="h-10 rounded-xl"
                autoFocus
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="modal-leader">Ketua</Label>
              <Select
                value={form.leaderId || undefined}
                onValueChange={(value) => updateField("leaderId", value)}
              >
                <SelectTrigger
                  id="modal-leader"
                  className="h-10 w-full rounded-xl border-[var(--a-line)]"
                >
                  <SelectValue placeholder="Pilih dari daftar anggota" />
                </SelectTrigger>
                <SelectContent position="popper" className="max-h-64">
                  {memberOptions.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedLeader ? (
                <p className="text-xs text-[var(--a-ink-soft)]">
                  Email: {selectedLeader.email}
                </p>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="modal-group-desc">
                Deskripsi{" "}
                <span className="font-normal text-[var(--a-ink-soft)]">
                  (opsional)
                </span>
              </Label>
              <Input
                id="modal-group-desc"
                value={form.description}
                onChange={(event) =>
                  updateField("description", event.target.value)
                }
                placeholder="Tujuan singkat kelompok…"
                className="h-10 rounded-xl"
              />
            </div>

            {error ? (
              <p
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
              >
                {error}
              </p>
            ) : null}

            <div className="flex flex-col-reverse gap-2 border-t border-[var(--a-line)] pt-4 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                className="h-10 rounded-xl"
                onClick={closeModal}
                disabled={saving}
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className={cn(
                  "h-10 rounded-xl bg-[var(--a-accent)] font-semibold text-white hover:bg-[#2563eb]",
                  saving && "opacity-80",
                )}
              >
                {saving ? "Menyimpan…" : copy.admin.groups.create}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
