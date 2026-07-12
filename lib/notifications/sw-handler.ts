export function registerNotificationSW(): () => void {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return () => {}

  let removed = false
  const handler = (event: MessageEvent) => {
    if (event.data?.type === "NOTIFICATION_CLICKED") {
      window.focus()
    }
  }

  navigator.serviceWorker.ready.then((registration) => {
    if (!registration.active || removed) return
    navigator.serviceWorker.addEventListener("message", handler)
  })

  return () => {
    removed = true
    navigator.serviceWorker?.removeEventListener("message", handler)
  }
}
