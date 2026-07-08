export async function requestPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    return 'denied'
  }
  const result = await Notification.requestPermission()
  return result
}

export function scheduleNotification(title: string, options: NotificationOptions, time: Date): void {
  if (!('Notification' in window) || Notification.permission !== 'granted') return

  const now = Date.now()
  const delay = time.getTime() - now
  if (delay <= 0) return

  setTimeout(() => {
    new Notification(title, options)
  }, delay)
}
