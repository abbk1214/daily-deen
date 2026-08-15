"use client"

import { useEffect, useCallback, useRef } from "react"
import { X } from "lucide-react"

interface BottomSheetProps {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}

const FOCUSABLE_SELECTORS = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function BottomSheet({ open, onClose, title, children }: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose()
      return
    }

    if (e.key === "Tab" && sheetRef.current) {
      const focusable = sheetRef.current.querySelectorAll(FOCUSABLE_SELECTORS)
      if (focusable.length === 0) return

      const first = focusable[0] as HTMLElement
      const last = focusable[focusable.length - 1] as HTMLElement

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
  }, [onClose])

  useEffect(() => {
    if (open) {
      previousFocusRef.current = document.activeElement as HTMLElement
      document.addEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "hidden"

      // Focus the first focusable element after render
      requestAnimationFrame(() => {
        if (!sheetRef.current) return
        const firstFocusable = sheetRef.current.querySelector(FOCUSABLE_SELECTORS) as HTMLElement
        if (firstFocusable) {
          firstFocusable.focus()
        }
      })
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = ""
      // Return focus to the element that triggered the dialog
      previousFocusRef.current?.focus()
    }
  }, [open, handleKeyDown])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label={title || "Dialog"}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" aria-hidden="true" />
      <div
        ref={sheetRef}
        className="relative w-full max-w-lg rounded-t-2xl bg-card border border-border shadow-lg sm:rounded-2xl animate-slide-up"
        style={{ maxHeight: "85vh", overflow: "auto" }}
      >
        {title && (
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2
              className="text-foreground"
              style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-h6)", fontWeight: 600 }}
            >
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary"
            >
              <X size={16} strokeWidth={1.5} />
            </button>
          </div>
        )}
        <div className="p-5">
          {children}
        </div>
      </div>
    </div>
  )
}
