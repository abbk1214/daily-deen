"use client";

export function LoadingBar({ isLoading }: { isLoading: boolean }) {
  if (!isLoading) return null;

  return (
    <div
      role="progressbar"
      aria-label="Loading"
      className="fixed top-12 left-0 right-0 z-30 overflow-hidden"
      style={{ height: "2px" }}
    >
      <div
        className="h-full"
        style={{
          background: "var(--dd-dusk-teal)",
          animation: "loading-slide 1.5s var(--ease-in-out) infinite",
        }}
      />
      <style>{`
        @keyframes loading-slide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(350%); }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes loading-slide {
            0% { transform: translateX(0); opacity: 0.5; width: 50%; margin: 0 auto; }
            100% { transform: translateX(0); opacity: 0.5; width: 50%; margin: 0 auto; }
          }
        }
      `}</style>
    </div>
  );
}
