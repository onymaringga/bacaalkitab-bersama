"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowDown,
  ArrowUp,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { demoGroups } from "@/lib/demo-data";
import { demoGroupMembers, getInitials } from "@/lib/group-members";
import type { MemberTodayStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

type SortKey = "name" | "group" | "completion" | "streak" | "status";

type FilterOption = {
  value: string;
  label: string;
};

const PAGE_SIZE_OPTIONS = [5, 10, 15] as const;

const todayStatusLabel: Record<MemberTodayStatus, string> = {
  completed: "Sudah baca",
  pending: "Belum baca",
  missed: "Terlewat",
};

const ROLE_OPTIONS: FilterOption[] = [
  { value: "leader", label: "Ketua" },
  { value: "member", label: "Anggota" },
];

const STATUS_OPTIONS: FilterOption[] = [
  { value: "completed", label: "Sudah baca" },
  { value: "pending", label: "Belum baca" },
  { value: "missed", label: "Terlewat" },
];

export function AdminUsersPanel() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [groupFilter, setGroupFilter] = useState<string[]>([]);
  const [roleFilter, setRoleFilter] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<(typeof PAGE_SIZE_OPTIONS)[number]>(5);

  const groupOptions = useMemo(
    () => demoGroups.map((g) => ({ value: g.id, label: g.name })),
    [],
  );

  const groupNameById = useMemo(
    () => Object.fromEntries(demoGroups.map((g) => [g.id, g.name])),
    [],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    let list = demoGroupMembers.filter((user) => {
      if (groupFilter.length > 0 && !groupFilter.includes(user.groupId)) {
        return false;
      }
      if (roleFilter.length > 0 && !roleFilter.includes(user.role)) {
        return false;
      }
      if (
        statusFilter.length > 0 &&
        !statusFilter.includes(user.todayStatus)
      ) {
        return false;
      }
      if (!q) return true;

      const roleLabel = user.role === "leader" ? "ketua" : "anggota";
      const statusLabel = todayStatusLabel[user.todayStatus].toLowerCase();
      const haystack = [
        user.name,
        user.email,
        groupNameById[user.groupId] ?? "",
        roleLabel,
        statusLabel,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(q);
    });

    const statusRank: Record<MemberTodayStatus, number> = {
      completed: 0,
      pending: 1,
      missed: 2,
    };

    list = [...list].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "name") {
        cmp = a.name.localeCompare(b.name, "id");
      } else if (sortKey === "group") {
        cmp = (groupNameById[a.groupId] ?? "").localeCompare(
          groupNameById[b.groupId] ?? "",
          "id",
        );
      } else if (sortKey === "completion") {
        cmp = a.completionRate - b.completionRate;
      } else if (sortKey === "streak") {
        cmp = a.streakDays - b.streakDays;
      } else {
        cmp = statusRank[a.todayStatus] - statusRank[b.todayStatus];
      }
      return sortAsc ? cmp : -cmp;
    });

    return list;
  }, [
    query,
    groupFilter,
    roleFilter,
    statusFilter,
    sortKey,
    sortAsc,
    groupNameById,
  ]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);

  useEffect(() => {
    setPage(1);
  }, [query, groupFilter, roleFilter, statusFilter, sortKey, sortAsc, pageSize]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const pageItems = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, safePage, pageSize]);

  const rangeStart = filtered.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const rangeEnd = Math.min(safePage * pageSize, filtered.length);

  const hasActiveFilters =
    query.trim() !== "" ||
    groupFilter.length > 0 ||
    roleFilter.length > 0 ||
    statusFilter.length > 0;

  function resetFilters() {
    setQuery("");
    setGroupFilter([]);
    setRoleFilter([]);
    setStatusFilter([]);
    setSortKey("name");
    setSortAsc(true);
    setPage(1);
  }

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortAsc((prev) => !prev);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  }

  function removeChip(
    kind: "group" | "role" | "status",
    value: string,
  ) {
    if (kind === "group") {
      setGroupFilter((prev) => prev.filter((v) => v !== value));
    } else if (kind === "role") {
      setRoleFilter((prev) => prev.filter((v) => v !== value));
    } else {
      setStatusFilter((prev) => prev.filter((v) => v !== value));
    }
  }

  const activeChips = [
    ...groupFilter.map((value) => ({
      kind: "group" as const,
      value,
      label: groupNameById[value] ?? value,
    })),
    ...roleFilter.map((value) => ({
      kind: "role" as const,
      value,
      label: value === "leader" ? "Ketua" : "Anggota",
    })),
    ...statusFilter.map((value) => ({
      kind: "status" as const,
      value,
      label: todayStatusLabel[value as MemberTodayStatus] ?? value,
    })),
  ];

  return (
    <Card className="overflow-hidden shadow-[var(--shadow-soft)]">
      <CardHeader className="gap-4 border-b border-border bg-card pb-4">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <CardTitle className="text-base lg:hidden">Daftar Peserta</CardTitle>
            <CardDescription className="mt-0.5">
              Kelola dan pantau peserta program
            </CardDescription>
          </div>
          <p className="text-xs font-medium text-muted-foreground">
            {filtered.length} hasil
            {hasActiveFilters
              ? ` dari ${demoGroupMembers.length}`
              : ` · ${demoGroupMembers.length} total`}
          </p>
        </div>

        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari nama, email, kelompok, peran, atau status…"
            className="h-10 rounded-lg bg-background pl-9 pr-9"
            aria-label="Cari peserta"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Hapus pencarian"
            >
              <X className="size-3.5" />
            </button>
          ) : null}
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <MultiSearchSelect
            label="Kelompok"
            placeholder="Pilih kelompok"
            searchPlaceholder="Cari kelompok…"
            options={groupOptions}
            values={groupFilter}
            onChange={setGroupFilter}
          />
          <MultiSearchSelect
            label="Peran"
            placeholder="Pilih peran"
            searchPlaceholder="Cari peran…"
            options={ROLE_OPTIONS}
            values={roleFilter}
            onChange={setRoleFilter}
          />
          <MultiSearchSelect
            label="Status"
            placeholder="Pilih status"
            searchPlaceholder="Cari status…"
            options={STATUS_OPTIONS}
            values={statusFilter}
            onChange={setStatusFilter}
          />
        </div>

        {activeChips.length > 0 ? (
          <div className="flex flex-wrap items-center gap-1.5">
            {activeChips.map((chip) => (
              <button
                key={`${chip.kind}-${chip.value}`}
                type="button"
                onClick={() => removeChip(chip.kind, chip.value)}
                className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary transition-colors hover:bg-primary/15"
              >
                {chip.label}
                <X className="size-3" />
              </button>
            ))}
            <button
              type="button"
              onClick={resetFilters}
              className="ml-1 text-xs font-semibold text-muted-foreground hover:text-foreground hover:underline"
            >
              Reset semua
            </button>
          </div>
        ) : null}
      </CardHeader>

      <CardContent className="p-0">
        {filtered.length === 0 ? (
          <div className="px-4 py-14 text-center">
            <p className="text-sm font-medium text-foreground">
              Tidak ada peserta ditemukan
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Coba ubah kata kunci atau filter.
            </p>
            {hasActiveFilters ? (
              <Button
                variant="outline"
                size="sm"
                className="mt-4 rounded-lg"
                onClick={resetFilters}
              >
                Reset filter
              </Button>
            ) : null}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <SortTh
                    label="Nama"
                    active={sortKey === "name"}
                    asc={sortAsc}
                    onClick={() => toggleSort("name")}
                    className="pl-4 lg:pl-5"
                  />
                  <SortTh
                    label="Kelompok"
                    active={sortKey === "group"}
                    asc={sortAsc}
                    onClick={() => toggleSort("group")}
                  />
                  <SortTh
                    label="Progress"
                    active={sortKey === "completion"}
                    asc={sortAsc}
                    onClick={() => toggleSort("completion")}
                  />
                  <SortTh
                    label="Streak"
                    active={sortKey === "streak"}
                    asc={sortAsc}
                    onClick={() => toggleSort("streak")}
                  />
                  <SortTh
                    label="Status"
                    active={sortKey === "status"}
                    asc={sortAsc}
                    onClick={() => toggleSort("status")}
                  />
                  <th className="w-10 pr-4 lg:pr-5" />
                </tr>
              </thead>
              <tbody>
                {pageItems.map((user) => (
                  <tr
                    key={user.id}
                    className="cursor-pointer border-b border-border last:border-b-0 transition-colors hover:bg-muted/35"
                    onClick={() => router.push(`/admin/users/${user.id}`)}
                  >
                    <td className="py-3 pl-4 lg:pl-5">
                      <div className="flex items-center gap-3">
                        <Avatar className="size-9 shrink-0">
                          <AvatarFallback className="bg-primary/10 text-[11px] font-semibold text-primary">
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="truncate font-semibold text-foreground">
                              {user.name}
                            </p>
                            <Badge
                              variant="secondary"
                              className="shrink-0 text-[10px] font-medium"
                            >
                              {user.role === "leader" ? "Ketua" : "Anggota"}
                            </Badge>
                          </div>
                          <p className="truncate text-xs text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 pr-3">
                      <p className="truncate text-sm text-foreground">
                        {groupNameById[user.groupId] ?? "—"}
                      </p>
                    </td>
                    <td className="py-3 pr-3">
                      <div className="w-28">
                        <div className="mb-1 flex justify-between text-xs">
                          <span className="font-semibold text-foreground">
                            {user.completionRate}%
                          </span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-primary"
                            style={{ width: `${user.completionRate}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 pr-3">
                      <span className="text-sm font-medium text-foreground">
                        {user.streakDays} hari
                      </span>
                    </td>
                    <td className="py-3 pr-3">
                      <StatusBadge status={user.todayStatus} />
                    </td>
                    <td className="py-3 pr-4 lg:pr-5">
                      <ChevronRight className="size-4 text-muted-foreground" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>

      {filtered.length > 0 ? (
        <CardFooter className="flex flex-col gap-3 border-t border-border bg-muted/20 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>
              Menampilkan {rangeStart}–{rangeEnd} dari {filtered.length}
            </span>
            <span className="text-border">·</span>
            <label className="inline-flex items-center gap-1.5">
              Per halaman
              <select
                className="h-8 rounded-md border border-input bg-background px-2 text-xs outline-none"
                value={pageSize}
                onChange={(e) =>
                  setPageSize(
                    Number(e.target.value) as (typeof PAGE_SIZE_OPTIONS)[number],
                  )
                }
              >
                {PAGE_SIZE_OPTIONS.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 rounded-lg px-2"
              disabled={safePage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="size-4" />
              Prev
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => {
                  if (totalPages <= 5) return true;
                  return (
                    p === 1 ||
                    p === totalPages ||
                    Math.abs(p - safePage) <= 1
                  );
                })
                .reduce<(number | "ellipsis")[]>((acc, p, idx, arr) => {
                  if (idx > 0 && p - (arr[idx - 1] as number) > 1) {
                    acc.push("ellipsis");
                  }
                  acc.push(p);
                  return acc;
                }, [])
                .map((item, idx) =>
                  item === "ellipsis" ? (
                    <span
                      key={`e-${idx}`}
                      className="px-1 text-xs text-muted-foreground"
                    >
                      …
                    </span>
                  ) : (
                    <Button
                      key={item}
                      type="button"
                      variant={item === safePage ? "default" : "outline"}
                      size="sm"
                      className="size-8 rounded-lg p-0 text-xs"
                      onClick={() => setPage(item)}
                    >
                      {item}
                    </Button>
                  ),
                )}
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 rounded-lg px-2"
              disabled={safePage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </CardFooter>
      ) : null}
    </Card>
  );
}

function MultiSearchSelect({
  label,
  placeholder,
  searchPlaceholder,
  options,
  values,
  onChange,
}: {
  label: string;
  placeholder: string;
  searchPlaceholder: string;
  options: FilterOption[];
  values: string[];
  onChange: (next: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      window.setTimeout(() => searchRef.current?.focus(), 0);
    }
  }, [open]);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(search.trim().toLowerCase()),
  );

  function toggle(value: string) {
    if (values.includes(value)) {
      onChange(values.filter((v) => v !== value));
    } else {
      onChange([...values, value]);
    }
  }

  const summary =
    values.length === 0
      ? placeholder
      : values.length === 1
        ? (options.find((o) => o.value === values[0])?.label ?? "1 dipilih")
        : `${values.length} dipilih`;

  return (
    <div ref={rootRef} className="relative space-y-1">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "flex h-10 w-full items-center justify-between gap-2 rounded-lg border border-input bg-background px-3 text-left text-sm outline-none transition-colors",
          "hover:bg-muted/40 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
          values.length > 0 && "border-primary/40",
        )}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span
          className={cn(
            "truncate",
            values.length === 0 ? "text-muted-foreground" : "text-foreground",
          )}
        >
          {summary}
        </span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {open ? (
        <div className="absolute z-40 mt-1 w-full overflow-hidden rounded-xl border border-border bg-card shadow-lg">
          <div className="border-b border-border p-2">
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                ref={searchRef}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={searchPlaceholder}
                className="h-8 w-full rounded-md border border-input bg-background pr-2 pl-8 text-sm outline-none focus-visible:border-ring"
              />
            </div>
          </div>
          <ul
            className="max-h-48 overflow-y-auto p-1"
            role="listbox"
            aria-multiselectable
          >
            {filteredOptions.length === 0 ? (
              <li className="px-3 py-4 text-center text-xs text-muted-foreground">
                Tidak ada opsi
              </li>
            ) : (
              filteredOptions.map((option) => {
                const checked = values.includes(option.value);
                return (
                  <li key={option.value}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={checked}
                      onClick={() => toggle(option.value)}
                      className={cn(
                        "flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm transition-colors",
                        checked
                          ? "bg-primary/10 text-foreground"
                          : "hover:bg-muted/60",
                      )}
                    >
                      <span
                        className={cn(
                          "flex size-4 shrink-0 items-center justify-center rounded border",
                          checked
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-input bg-background",
                        )}
                      >
                        {checked ? <Check className="size-3" /> : null}
                      </span>
                      <span className="truncate">{option.label}</span>
                    </button>
                  </li>
                );
              })
            )}
          </ul>
          {values.length > 0 ? (
            <div className="border-t border-border p-1.5">
              <button
                type="button"
                onClick={() => onChange([])}
                className="w-full rounded-lg px-2.5 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                Hapus pilihan
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function SortTh({
  label,
  active,
  asc,
  onClick,
  className,
}: {
  label: string;
  active: boolean;
  asc: boolean;
  onClick: () => void;
  className?: string;
}) {
  return (
    <th className={cn("py-2.5 pr-3 font-semibold", className)}>
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "inline-flex items-center gap-1 transition-colors hover:text-foreground",
          active ? "text-foreground" : "text-muted-foreground",
        )}
      >
        {label}
        {active ? (
          asc ? (
            <ArrowUp className="size-3" />
          ) : (
            <ArrowDown className="size-3" />
          )
        ) : null}
      </button>
    </th>
  );
}

function StatusBadge({ status }: { status: MemberTodayStatus }) {
  return (
    <Badge
      variant="secondary"
      className={cn(
        "text-[10px] font-medium",
        status === "completed" &&
          "bg-[var(--status-success-bg)] text-[var(--status-success-text)]",
        status === "missed" &&
          "bg-[var(--status-danger-bg)] text-[var(--status-danger-text)]",
        status === "pending" && "bg-primary/10 text-primary",
      )}
    >
      {todayStatusLabel[status]}
    </Badge>
  );
}
