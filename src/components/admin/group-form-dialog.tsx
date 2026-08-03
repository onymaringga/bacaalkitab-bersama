"use client";

import { useMemo, useState } from "react";

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
import { copy } from "@/lib/copy";
import { demoGroupMembers } from "@/lib/group-members";
import type { Group } from "@/lib/types";
import { cn } from "@/lib/utils";

export type GroupFormValues = {
  name: string;
  leaderId: string;
  description: string;
};

type GroupFormDialogProps = {
  open: boolean;
  mode: "create" | "edit";
  initialGroup?: Group | null;
  existingNames: string[];
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: {
    name: string;
    description: string;
    leaderName: string;
    leaderId: string;
  }) => Promise<void> | void;
};

function findLeaderId(leaderName: string) {
  const match = demoGroupMembers.find(
    (member) => member.name === leaderName && member.role === "leader",
  );
  if (match) return match.id;
  return (
    demoGroupMembers.find((member) => member.name === leaderName)?.id ?? ""
  );
}

export function GroupFormDialog({
  open,
  mode,
  initialGroup,
  existingNames,
  onOpenChange,
  onSubmit,
}: GroupFormDialogProps) {
  const [name, setName] = useState("");
  const [leaderId, setLeaderId] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [hydratedFor, setHydratedFor] = useState<string | null>(null);

  const memberOptions = useMemo(() => {
    const byEmail = new Map<string, (typeof demoGroupMembers)[number]>();
    for (const member of demoGroupMembers) {
      if (!byEmail.has(member.email)) {
        byEmail.set(member.email, member);
      }
    }
    return [...byEmail.values()].sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  const selectedLeader = memberOptions.find((m) => m.id === leaderId);

  // Sync form when dialog opens / target group changes
  const hydrateKey =
    open && mode === "edit" && initialGroup
      ? `edit:${initialGroup.id}:${initialGroup.name}`
      : open && mode === "create"
        ? "create"
        : null;

  if (open && hydrateKey && hydrateKey !== hydratedFor) {
    if (mode === "edit" && initialGroup) {
      setName(initialGroup.name);
      setLeaderId(findLeaderId(initialGroup.leaderName));
      setDescription(initialGroup.description);
    } else {
      setName("");
      setLeaderId("");
      setDescription("");
    }
    setError(null);
    setHydratedFor(hydrateKey);
  }

  if (!open && hydratedFor !== null) {
    setHydratedFor(null);
  }

  function close() {
    onOpenChange(false);
    setError(null);
  }

  async function handleSubmit() {
    const trimmedName = name.trim();
    const leader = memberOptions.find((m) => m.id === leaderId);

    if (!trimmedName) {
      setError("Nama kelompok wajib diisi.");
      return;
    }
    if (!leader) {
      setError("Pilih ketua dari daftar anggota.");
      return;
    }

    const nameTaken = existingNames.some(
      (existing) =>
        existing.toLowerCase() === trimmedName.toLowerCase() &&
        existing.toLowerCase() !== (initialGroup?.name ?? "").toLowerCase(),
    );
    if (nameTaken) {
      setError("Nama kelompok sudah dipakai.");
      return;
    }

    setSaving(true);
    try {
      await onSubmit({
        name: trimmedName,
        description: description.trim(),
        leaderName: leader.name,
        leaderId: leader.id,
      });
      close();
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) close();
        else onOpenChange(true);
      }}
    >
      <DialogContent
        showCloseButton
        className="gap-0 overflow-hidden p-0 sm:max-w-md"
      >
        <DialogHeader className="space-y-1 border-b border-[var(--a-line)] px-5 py-4 pr-12 text-left">
          <DialogTitle className="text-base font-semibold text-[var(--a-ink)]">
            {mode === "create" ? "Tambah kelompok" : "Edit kelompok"}
          </DialogTitle>
          <DialogDescription className="text-sm text-[var(--a-ink-soft)]">
            {mode === "create"
              ? "Isi nama kelompok dan pilih ketua dari daftar anggota."
              : "Perbarui nama, ketua, atau deskripsi kelompok."}
          </DialogDescription>
        </DialogHeader>

        <form
          className="space-y-3.5 px-5 py-4"
          onSubmit={(event) => {
            event.preventDefault();
            void handleSubmit();
          }}
        >
          <div className="space-y-1.5">
            <Label htmlFor="group-form-name">Nama kelompok</Label>
            <Input
              id="group-form-name"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                if (error) setError(null);
              }}
              placeholder={copy.admin.groups.namePlaceholder}
              className="h-10 rounded-xl"
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="group-form-leader">Ketua</Label>
            <Select
              value={leaderId || undefined}
              onValueChange={(value) => {
                setLeaderId(value);
                if (error) setError(null);
              }}
            >
              <SelectTrigger
                id="group-form-leader"
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
            <Label htmlFor="group-form-desc">
              Deskripsi{" "}
              <span className="font-normal text-[var(--a-ink-soft)]">
                (opsional)
              </span>
            </Label>
            <Input
              id="group-form-desc"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
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
              onClick={close}
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
              {saving
                ? "Menyimpan…"
                : mode === "create"
                  ? copy.admin.groups.create
                  : "Simpan perubahan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
