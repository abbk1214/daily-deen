import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center text-center" style={{ padding: "var(--space-6)" }}>
      <p
        className="text-foreground"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(48px, 10vw, 72px)",
          fontWeight: 600,
          letterSpacing: "-0.03em",
          lineHeight: 1,
          marginBottom: "var(--space-4)",
        }}
        aria-hidden="true"
      >
        404
      </p>
      <h1
        className="text-foreground"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "var(--text-h3)",
          fontWeight: 600,
          marginBottom: "var(--space-2)",
        }}
      >
        Page not found
      </h1>
      <p
        className="text-muted-foreground"
        style={{
          fontSize: "var(--text-body-sm)",
          maxWidth: "36ch",
          marginBottom: "var(--space-8)",
        }}
      >
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="rounded-lg bg-dusk-teal px-6 py-3 text-white transition-colors hover:bg-dusk-teal/90"
        style={{ fontSize: "var(--text-body-sm)", fontWeight: 500 }}
      >
        Back to dashboard
      </Link>
    </div>
  );
}
