"use client";

export default function OfflinePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <div className="flex flex-col items-center gap-6 text-center max-w-md px-8">
        <h1 className="text-4xl font-bold text-black dark:text-zinc-50">
          You&apos;re Offline
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          The Daily Deen app is not available in your current network connection. 
          Please check your internet connection and try again.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-zinc-900 text-white rounded-full hover:bg-zinc-800 transition-colors"
        >
          Retry Connection
        </button>
      </div>
    </div>
  );
}