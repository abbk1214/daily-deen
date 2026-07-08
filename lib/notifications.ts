function isBrowser(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window
}

export function getPermissionStatus(): NotificationPermission {
  if (!isBrowser()) return 'denied'
  return Notification.permission
}

export async function requestPermission(): Promise<NotificationPermission> {
  if (!isBrowser()) return 'denied'
  try {
    return await Notification.requestPermission()
  } catch {
    return 'denied'
  }
}

export function scheduleNotification(
  title: string,
  options: NotificationOptions,
  time: Date,
): () => boolean {
  if (!isBrowser()) return () => false
  if (Notification.permission !== 'granted') return () => false

  const delay = time.getTime() - Date.now()
  if (delay <= 0) return () => false

  let timerId: ReturnType<typeof setTimeout> | undefined
  let cancelled = false

  timerId = setTimeout(() => {
    if (cancelled) return
    try {
      new Notification(title, options)
    } catch {
      // Permission revoked or browser error — fail silently
    }
  }, delay)

  return () => {
    if (cancelled) return false
    cancelled = true
    if (timerId !== undefined) {
      clearTimeout(timerId)
      timerId = undefined
    }
    return true
  }
}

export function showNotification(
  title: string,
  options?: NotificationOptions,
): boolean {
  if (!isBrowser()) return false
  if (Notification.permission !== 'granted') return false
  try {
    new Notification(title, options)
    return true
  } catch {
    return false
  }
}
