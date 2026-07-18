"use client";

import Link from "next/link";
import { BookOpen, Moon, Target, Sparkles } from "lucide-react";

interface EmptyStateProps {
  type: "prayers" | "quran" | "habits" | "journal" | "adhkar" | "general";
  title: string;
  description: string;
  action?: {
    label: string;
    href: string;
  };
}

const ICONS = {
  prayers: Moon,
  quran: BookOpen,
  habits: Target,
  journal: Sparkles,
  adhkar: Sparkles,
  general: Sparkles,
};

export function EmptyState({ type, title, description, action }: EmptyStateProps) {
  const Icon = ICONS[type];

  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <div
        className="flex h-16 w-16 items-center justify-center rounded-2xl mb-4"
        style={{
          background: "color-mix(in srgb, var(--dusk-teal) 10%, var(--muted))",
        }}
      >
        <Icon size={28} className="text-dusk-teal" strokeWidth={1.5} />
      </div>
      <h3
        className="text-foreground mb-1"
        style={{ fontSize: "var(--text-body)", fontWeight: 600 }}
      >
        {title}
      </h3>
      <p
        className="text-muted-foreground mb-4 max-w-xs"
        style={{ fontSize: "var(--text-body-sm)" }}
      >
        {description}
      </p>
      {action && (
        <Link
          href={action.href}
          className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors"
          style={{
            background: "var(--dusk-teal)",
            color: "white",
          }}
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}

// Inline empty state for smaller spaces
export function InlineEmptyState({
  icon: Icon,
  message,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  message: string;
}) {
  return (
    <div className="flex items-center gap-3 py-6 px-4 text-center justify-center">
      <Icon size={16} className="text-muted-foreground" />
      <p className="text-muted-foreground" style={{ fontSize: "var(--text-body-sm)" }}>
        {message}
      </p>
    </div>
  );
}
