"use client";

import { Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customerName: string;
  onConfirm: () => void;
}

export function DeleteDialog({
  open,
  onOpenChange,
  customerName,
  onConfirm,
}: DeleteDialogProps) {
  const [loading, setLoading] = useState(false);

  function handleConfirm() {
    setLoading(true);
    setTimeout(() => {
      onConfirm();
      setLoading(false);
      onOpenChange(false);
    }, 400);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Trash2 className="w-5 h-5 text-red-600" />
            </div>
            <DialogTitle className="text-slate-900">Delete Customer</DialogTitle>
          </div>
          <DialogDescription className="text-slate-500">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-slate-700">{customerName}</span>?
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Deleting...</>
            ) : (
              "Delete"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
