export function registerNotificationSW(): void {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return

  navigator.serviceWorker.ready.then((registration) => {
    if (!registration.active) return

    navigator.serviceWorker.addEventListener("message", (event) => {
      if (event.data?.type === "NOTIFICATION_CLICKED") {
        window.focus()
      }
    })
  })
}
