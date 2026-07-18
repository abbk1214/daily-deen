"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ZakatCalculator } from "@/components/zakat-calculator";

export default function ZakatPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <header
        className="sticky top-0 z-30 flex items-center border-b border-border bg-background"
        style={{
          height: "var(--space-12)",
          padding: "var(--space-3) var(--space-5)",
        }}
      >
        <Link
          href="/"
          aria-label="Back to home"
          className="flex h-11 w-11 items-center justify-center rounded-md text-foreground transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <ArrowLeft size={20} strokeWidth={1.5} />
        </Link>
        <h1
          className="ml-3 text-foreground"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-h4)",
            fontWeight: 600,
          }}
        >
          Zakat Calculator
        </h1>
      </header>

      <main
        className="flex flex-1 flex-col pb-24 lg:pb-8"
        style={{
          padding: "var(--space-5)",
          paddingBottom: "calc(var(--space-14) + env(safe-area-inset-bottom, 0px) + var(--space-5))",
          maxWidth: "var(--content-reading)",
          marginLeft: "auto",
          marginRight: "auto",
          width: "100%",
          gap: "var(--space-5)",
        }}
      >
        <ZakatCalculator />
      </main>
    </div>
  );
}
