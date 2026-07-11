import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import {
  getPrayerReminderPayload,
  getPrayerStartPayload,
  minutesToMs,
  getMsUntilMidnight,
  buildNotificationTag,
} from "../notifications/helpers"
import {
  isNotificationSupported,
  getPermissionStatus,
  canNotify,
} from "../notifications/permission"
import {
  getScheduledCount,
  cancelAllNotifications,
  setRescheduleCallback,
  clearRescheduleCallback,
} from "../notifications/scheduler"

describe("notification helpers", () => {
  describe("getPrayerReminderPayload", () => {
    it("returns correct payload for Fajr", () => {
      const payload = getPrayerReminderPayload("fajr", 10)
      expect(payload.title).toBe("Fajr Prayer")
      expect(payload.body).toContain("10 minutes")
      expect(payload.tag).toContain("fajr")
      expect(payload.requireInteraction).toBe(true)
    })

    it("uses singular for 1 minute", () => {
      const payload = getPrayerReminderPayload("dhuhr", 1)
      expect(payload.body).toContain("1 minute")
      expect(payload.body).not.toContain("minutes")
    })

    it("uses plural for multiple minutes", () => {
      const payload = getPrayerReminderPayload("asr", 5)
      expect(payload.body).toContain("5 minutes")
    })

    it("returns correct payload for each prayer", () => {
      const prayers = ["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha"] as const
      for (const prayer of prayers) {
        const payload = getPrayerReminderPayload(prayer, 15)
        expect(payload.title).toBeTruthy()
        expect(payload.body).toBeTruthy()
        expect(payload.tag).toContain(prayer)
      }
    })
  })

  describe("getPrayerStartPayload", () => {
    it("returns correct payload for Maghrib", () => {
      const payload = getPrayerStartPayload("maghrib")
      expect(payload.title).toBe("Maghrib Prayer")
      expect(payload.body).toContain("Maghrib")
      expect(payload.tag).toContain("maghrib")
      expect(payload.requireInteraction).toBe(true)
    })

    it("returns prayer start message", () => {
      const payload = getPrayerStartPayload("isha")
      expect(payload.body).toContain("time for")
    })
  })

  describe("minutesToMs", () => {
    it("converts 0 minutes to 0 ms", () => {
      expect(minutesToMs(0)).toBe(0)
    })

    it("converts 1 minute to 60000 ms", () => {
      expect(minutesToMs(1)).toBe(60000)
    })

    it("converts 10 minutes to 600000 ms", () => {
      expect(minutesToMs(10)).toBe(600000)
    })

    it("converts 30 minutes to 1800000 ms", () => {
      expect(minutesToMs(30)).toBe(1800000)
    })
  })

  describe("getMsUntilMidnight", () => {
    it("returns a positive number", () => {
      const ms = getMsUntilMidnight()
      expect(ms).toBeGreaterThan(0)
    })

    it("returns at most 24 hours in ms", () => {
      const ms = getMsUntilMidnight()
      expect(ms).toBeLessThanOrEqual(24 * 60 * 60 * 1000)
    })
  })

  describe("buildNotificationTag", () => {
    it("builds reminder tag", () => {
      expect(buildNotificationTag("fajr", "reminder")).toBe("daily-deen-reminder-fajr")
    })

    it("builds prayer tag", () => {
      expect(buildNotificationTag("isha", "prayer")).toBe("daily-deen-prayer-isha")
    })
  })
})

describe("notification permission", () => {
  describe("isNotificationSupported", () => {
    it("returns a boolean", () => {
      expect(typeof isNotificationSupported()).toBe("boolean")
    })
  })

  describe("getPermissionStatus", () => {
    it("returns a valid permission status", () => {
      const status = getPermissionStatus()
      expect(["granted", "denied", "prompt", "unsupported"]).toContain(status)
    })
  })

  describe("canNotify", () => {
    it("returns a boolean", () => {
      expect(typeof canNotify()).toBe("boolean")
    })
  })
})

describe("notification scheduler", () => {
  beforeEach(() => {
    cancelAllNotifications()
  })

  afterEach(() => {
    cancelAllNotifications()
    clearRescheduleCallback()
  })

  describe("getScheduledCount", () => {
    it("returns 0 after cancel", () => {
      cancelAllNotifications()
      expect(getScheduledCount()).toBe(0)
    })
  })

  describe("setRescheduleCallback", () => {
    it("sets and clears callback without error", () => {
      const callback = vi.fn()
      setRescheduleCallback(callback)
      clearRescheduleCallback()
    })
  })
})
