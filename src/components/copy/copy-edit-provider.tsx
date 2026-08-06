"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Check,
  Loader2,
  PencilLine,
  RotateCcw,
  Save,
  X,
} from "lucide-react";

import { useDemoAuth } from "@/components/auth/demo-auth-provider";
import { showToast } from "@/components/ui/toast-host";
import { copy } from "@/lib/copy";
import {
  applyCopyOverrides,
  buildCopyTextIndex,
  flattenCopyStrings,
  getCopyByPath,
  readCopyOverridesFromStorage,
  restoreDefaultCopyStrings,
  setCopyByPath,
  writeCopyOverridesToStorage,
  type CopyOverrides,
} from "@/lib/copy-overrides";
import { cn } from "@/lib/utils";

type CopyEditContextValue = {
  editMode: boolean;
  setEditMode: (value: boolean) => void;
  dirtyCount: number;
  isSaving: boolean;
  saveEdits: () => Promise<void>;
  discardEdits: () => void;
  resetAllOverrides: () => Promise<void>;
};

const CopyEditContext = createContext<CopyEditContextValue | null>(null);

const EDITABLE_SELECTOR =
  "h1,h2,h3,h4,h5,h6,p,span,button,a,label,li,td,th,blockquote,figcaption,small,strong,em";

const SKIP_SELECTOR =
  "[data-copy-edit-skip], [data-copy-edit-toolbar], [aria-hidden='true'], script, style, svg, input, textarea, select, option";

function isEditableLeaf(element: HTMLElement) {
  if (element.closest(SKIP_SELECTOR)) return false;
  if (element.closest("[data-copy-edit-toolbar]")) return false;
  if (element.isContentEditable) return false;

  const text = element.innerText.replace(/\s+/g, " ").trim();
  if (text.length < 2) return false;
  if (/^\d+$/.test(text)) return false;

  const childElements = [...element.children].filter(
    (child) => !child.matches("svg, [aria-hidden='true']"),
  );
  if (childElements.length > 2) return false;

  return true;
}

function findCopyRoot() {
  return document.querySelector("[data-copy-root]") as HTMLElement | null;
}

function attachEditableElements(
  root: HTMLElement,
  textIndex: Map<string, string[]>,
  pendingEdits: CopyOverrides,
  onEdit: (path: string, value: string) => void,
) {
  const attached: Array<{ element: HTMLElement; handler: () => void }> = [];

  root.querySelectorAll(EDITABLE_SELECTOR).forEach((node) => {
    const element = node as HTMLElement;
    if (!isEditableLeaf(element)) return;

    const text = element.innerText.replace(/\s+/g, " ").trim();
    const paths = textIndex.get(text);
    if (!paths || paths.length !== 1) return;

    const path = paths[0]!;
    const currentValue = pendingEdits[path] ?? getCopyByPath(path) ?? text;

    element.dataset.copyPath = path;
    element.dataset.copyOriginal = currentValue;
    element.contentEditable = "true";
    element.spellcheck = false;
    element.classList.add("copy-edit-target");
    element.setAttribute("suppressContentEditableWarning", "true");

    const handler = () => {
      const next = element.innerText.replace(/\s+/g, " ").trim();
      onEdit(path, next);
    };

    element.addEventListener("input", handler);
    attached.push({ element, handler });
  });

  return () => {
    attached.forEach(({ element, handler }) => {
      element.contentEditable = "false";
      element.classList.remove("copy-edit-target");
      element.removeAttribute("data-copy-path");
      element.removeAttribute("data-copy-original");
      element.removeEventListener("input", handler);
    });
  };
}

export function CopyEditProvider({ children }: { children: React.ReactNode }) {
  const { isAdmin, session } = useDemoAuth();
  const [ready, setReady] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [dirtyCount, setDirtyCount] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const pendingEditsRef = useRef<CopyOverrides>({});
  const storedOverridesRef = useRef<CopyOverrides>({});

  const loadOverrides = useCallback(async () => {
    let overrides = readCopyOverridesFromStorage();

    try {
      const response = await fetch("/api/admin/copy", { cache: "no-store" });
      if (response.ok) {
        const data = (await response.json()) as { overrides?: CopyOverrides };
        if (data.overrides && typeof data.overrides === "object") {
          overrides = data.overrides;
          writeCopyOverridesToStorage(overrides);
        }
      }
    } catch {
      // Gunakan localStorage jika API tidak tersedia.
    }

    storedOverridesRef.current = overrides;
    applyCopyOverrides(overrides);
    setRefreshKey((value) => value + 1);
    setReady(true);
  }, []);

  useEffect(() => {
    void loadOverrides();
  }, [loadOverrides]);

  const handleEdit = useCallback((path: string, value: string) => {
    pendingEditsRef.current[path] = value;
    setDirtyCount(Object.keys(pendingEditsRef.current).length);
  }, []);

  useEffect(() => {
    if (!editMode || !isAdmin) return;

    const root = findCopyRoot();
    if (!root) return;

    const textIndex = buildCopyTextIndex(flattenCopyStrings(copy));
    const cleanup = attachEditableElements(
      root,
      textIndex,
      { ...storedOverridesRef.current, ...pendingEditsRef.current },
      handleEdit,
    );

    return cleanup;
  }, [editMode, isAdmin, handleEdit, refreshKey]);

  const discardEdits = useCallback(() => {
    pendingEditsRef.current = {};
    setDirtyCount(0);
    setEditMode(false);
    setRefreshKey((value) => value + 1);
  }, []);

  const saveEdits = useCallback(async () => {
    if (!session || session.role !== "admin") return;

    const merged = {
      ...storedOverridesRef.current,
      ...pendingEditsRef.current,
    };

    setIsSaving(true);
    try {
      for (const [path, value] of Object.entries(pendingEditsRef.current)) {
        setCopyByPath(path, value);
      }

      writeCopyOverridesToStorage(merged);

      const response = await fetch("/api/admin/copy", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session, overrides: merged }),
      });

      if (!response.ok) {
        throw new Error("save failed");
      }

      storedOverridesRef.current = merged;
      pendingEditsRef.current = {};
      setDirtyCount(0);
      setEditMode(false);
      setRefreshKey((value) => value + 1);
      showToast(copy.adminCopy.saved);
    } catch {
      showToast(copy.adminCopy.saveFailed);
    } finally {
      setIsSaving(false);
    }
  }, [session]);

  const resetAllOverrides = useCallback(async () => {
    if (!session || session.role !== "admin") return;

    setIsSaving(true);
    try {
      restoreDefaultCopyStrings();

      pendingEditsRef.current = {};
      storedOverridesRef.current = {};
      writeCopyOverridesToStorage({});

      await fetch("/api/admin/copy", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session }),
      });

      setDirtyCount(0);
      setEditMode(false);
      setRefreshKey((value) => value + 1);
      showToast(copy.adminCopy.resetDone);
    } catch {
      showToast(copy.adminCopy.resetFailed);
    } finally {
      setIsSaving(false);
    }
  }, [session]);

  const value = useMemo(
    () => ({
      editMode,
      setEditMode,
      dirtyCount,
      isSaving,
      saveEdits,
      discardEdits,
      resetAllOverrides,
    }),
    [
      editMode,
      dirtyCount,
      isSaving,
      saveEdits,
      discardEdits,
      resetAllOverrides,
    ],
  );

  return (
    <CopyEditContext.Provider value={value}>
      <div key={refreshKey} className="contents">
        {children}
      </div>
      {isAdmin && ready ? <AdminCopyToolbar /> : null}
    </CopyEditContext.Provider>
  );
}

export function useCopyEdit() {
  const context = useContext(CopyEditContext);
  if (!context) {
    return {
      editMode: false,
      setEditMode: () => {},
      dirtyCount: 0,
      isSaving: false,
      saveEdits: async () => {},
      discardEdits: () => {},
      resetAllOverrides: async () => {},
    };
  }
  return context;
}

function AdminCopyToolbar() {
  const {
    editMode,
    setEditMode,
    dirtyCount,
    isSaving,
    saveEdits,
    discardEdits,
    resetAllOverrides,
  } = useCopyEdit();

  return (
    <div
      data-copy-edit-toolbar
      data-copy-edit-skip
      className={cn(
        "fixed inset-x-0 bottom-0 z-[200] border-t border-[var(--m-line)] bg-white/95 px-4 py-3 shadow-[0_-8px_32px_rgba(15,23,42,0.12)] backdrop-blur-md",
        "sm:left-auto sm:right-4 sm:bottom-4 sm:w-[min(100vw-2rem,26rem)] sm:rounded-2xl sm:border",
      )}
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-[var(--m-accent)]/10 text-[var(--m-accent)]">
          <PencilLine className="size-4.5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-[var(--m-ink)]">
            {copy.adminCopy.toolbarTitle}
          </p>
          <p className="mt-0.5 text-xs leading-relaxed text-[var(--m-ink-soft)]">
            {editMode
              ? copy.adminCopy.toolbarEditing
              : copy.adminCopy.toolbarHint}
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {!editMode ? (
          <button
            type="button"
            onClick={() => setEditMode(true)}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[var(--m-accent)] px-3 py-2 text-xs font-semibold text-white transition hover:opacity-95"
          >
            <PencilLine className="size-3.5" />
            {copy.adminCopy.startEditing}
          </button>
        ) : (
          <>
            <button
              type="button"
              disabled={isSaving || dirtyCount === 0}
              onClick={() => void saveEdits()}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[var(--m-accent)] px-3 py-2 text-xs font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-45"
            >
              {isSaving ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Save className="size-3.5" />
              )}
              {copy.adminCopy.save}
              {dirtyCount > 0 ? ` (${dirtyCount})` : ""}
            </button>
            <button
              type="button"
              disabled={isSaving}
              onClick={discardEdits}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[var(--m-line)] px-3 py-2 text-xs font-semibold text-[var(--m-ink-soft)] transition hover:bg-[var(--m-wash)]"
            >
              <X className="size-3.5" />
              {copy.adminCopy.cancel}
            </button>
          </>
        )}
        <button
          type="button"
          disabled={isSaving}
          onClick={() => {
            if (window.confirm(copy.adminCopy.resetConfirm)) {
              void resetAllOverrides();
            }
          }}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[var(--m-line)] px-3 py-2 text-xs font-semibold text-[var(--m-ink-soft)] transition hover:bg-[var(--m-wash)]"
        >
          <RotateCcw className="size-3.5" />
          {copy.adminCopy.reset}
        </button>
      </div>

      {editMode ? (
        <p className="mt-2 flex items-center gap-1.5 text-[11px] text-[var(--m-accent)]">
          <Check className="size-3.5" />
          {copy.adminCopy.editingActive}
        </p>
      ) : null}
    </div>
  );
}
