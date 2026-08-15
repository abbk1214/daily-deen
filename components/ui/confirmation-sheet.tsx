"use client"

import { BottomSheet } from "./bottom-sheet"

interface ConfirmationSheetProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: "danger" | "default"
}

export function ConfirmationSheet({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "default",
}: ConfirmationSheetProps) {
  return (
    <BottomSheet open={open} onClose={onClose} title={title}>
      <p className="text-muted-foreground mb-5" style={{ fontSize: "var(--text-body-sm)", lineHeight: 1.6 }}>
        {description}
      </p>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 rounded-xl border border-border bg-background py-3 text-foreground transition-colors hover:bg-secondary"
          style={{ fontSize: "var(--text-body-sm)", fontWeight: 500 }}
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          onClick={() => { onConfirm(); onClose() }}
          className={`flex-1 rounded-xl py-3 text-white transition-colors ${
            variant === "danger"
              ? "bg-red-500 hover:bg-red-600"
              : "bg-dusk-teal hover:opacity-90"
          }`}
          style={{ fontSize: "var(--text-body-sm)", fontWeight: 500 }}
        >
          {confirmLabel}
        </button>
      </div>
    </BottomSheet>
  )
}
