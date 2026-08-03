"use client";

import { LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type LogoutConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

export function LogoutConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
}: LogoutConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="gap-0 overflow-hidden p-0 sm:max-w-sm"
      >
        <DialogHeader className="space-y-1 px-5 pt-5 text-left">
          <DialogTitle className="text-base font-semibold">
            Keluar dari akun?
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Kamu harus masuk lagi untuk melanjutkan.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col-reverse gap-2 px-5 py-4 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            className="h-10 rounded-xl"
            onClick={() => onOpenChange(false)}
          >
            Batal
          </Button>
          <Button
            type="button"
            variant="destructive"
            className="h-10 gap-2 rounded-xl"
            onClick={() => {
              onOpenChange(false);
              onConfirm();
            }}
          >
            <LogOut className="size-4" />
            Keluar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
