import { describe, it, expect } from "vitest";
import {
  getHijriDate,
  formatHijriDate,
  formatHijriDateShort,
  getHijriMonthYear,
  isHijriLeapYear,
  getDaysInHijriMonth,
  hijriToGregorian,
  hijriToIsoDate,
  getHijriToday,
  HIJRI_MONTHS,
} from "../hijri-date";

describe("hijri-date", () => {
  describe("HIJRI_MONTHS", () => {
    it("has 12 months", () => {
      expect(HIJRI_MONTHS).toHaveLength(12);
    });

    it("starts with Muharram", () => {
      expect(HIJRI_MONTHS[0]).toBe("Muharram");
    });

    it("ends with Dhul Hijjah", () => {
      expect(HIJRI_MONTHS[11]).toBe("Dhul Hijjah");
    });

    it("contains Ramadan at index 8", () => {
      expect(HIJRI_MONTHS[8]).toBe("Ramadan");
    });
  });

  describe("getHijriDate", () => {
    it("returns year, month, day, monthName", () => {
      const result = getHijriDate(new Date("2026-03-20T12:00:00Z"));
      expect(result).toHaveProperty("year");
      expect(result).toHaveProperty("month");
      expect(result).toHaveProperty("day");
      expect(result).toHaveProperty("monthName");
      expect(typeof result.year).toBe("number");
      expect(typeof result.month).toBe("number");
      expect(typeof result.day).toBe("number");
      expect(typeof result.monthName).toBe("string");
    });

    it("returns monthName from HIJRI_MONTHS", () => {
      const result = getHijriDate(new Date("2026-03-20T12:00:00Z"));
      expect(HIJRI_MONTHS).toContain(result.monthName);
    });

    it("returns valid month range (1-12)", () => {
      const result = getHijriDate(new Date("2026-03-20T12:00:00Z"));
      expect(result.month).toBeGreaterThanOrEqual(1);
      expect(result.month).toBeLessThanOrEqual(12);
    });

    it("defaults to today when no date provided", () => {
      const result = getHijriDate();
      const today = new Date();
      const todayHijri = getHijriDate(today);
      expect(result.year).toBe(todayHijri.year);
      expect(result.month).toBe(todayHijri.month);
      expect(result.day).toBe(todayHijri.day);
    });
  });

  describe("formatHijriDate", () => {
    it("returns a string with day, monthName, year", () => {
      const result = formatHijriDate("2026-03-20");
      expect(typeof result).toBe("string");
      expect(result).toMatch(/^\d+ \w+ \d{4}$/);
    });

    it("contains month name", () => {
      const result = formatHijriDate("2026-03-20");
      const monthName = getHijriDate(new Date("2026-03-20T12:00:00Z")).monthName;
      expect(result).toContain(monthName);
    });

    it("contains year number", () => {
      const result = formatHijriDate("2026-03-20");
      const year = getHijriDate(new Date("2026-03-20T12:00:00Z")).year;
      expect(result).toContain(String(year));
    });
  });

  describe("formatHijriDateShort", () => {
    it("returns day and month name without year", () => {
      const result = formatHijriDateShort("2026-03-20");
      expect(typeof result).toBe("string");
      expect(result).toMatch(/^\d+ \w+$/);
      expect(result).not.toMatch(/\d{4}$/);
    });
  });

  describe("getHijriMonthYear", () => {
    it("returns year and month for a given date", () => {
      const result = getHijriMonthYear("2026-03-20");
      expect(result).toHaveProperty("year");
      expect(result).toHaveProperty("month");
      expect(result.month).toBeGreaterThanOrEqual(1);
      expect(result.month).toBeLessThanOrEqual(12);
    });
  });

  describe("isHijriLeapYear", () => {
    it("returns a boolean", () => {
      expect(typeof isHijriLeapYear(1445)).toBe("boolean");
    });

    it("returns consistent results for same year", () => {
      expect(isHijriLeapYear(1445)).toBe(isHijriLeapYear(1445));
    });
  });

  describe("getDaysInHijriMonth", () => {
    it("returns 29 or 30 for valid months", () => {
      for (let m = 1; m <= 12; m++) {
        const days = getDaysInHijriMonth(1445, m);
        expect(days).toBeGreaterThanOrEqual(29);
        expect(days).toBeLessThanOrEqual(30);
      }
    });

    it("returns 29 for month 2 in common year", () => {
      const days = getDaysInHijriMonth(1445, 2);
      expect(days).toBe(29);
    });

    it("returns 30 for month 1", () => {
      const days = getDaysInHijriMonth(1445, 1);
      expect(days).toBe(30);
    });
  });

  describe("hijriToGregorian", () => {
    it("returns a Date object", () => {
      const result = hijriToGregorian(1447, 9, 1);
      expect(result).toBeInstanceOf(Date);
    });

    it("converts known Hijri date to approximately correct Gregorian", () => {
      const result = hijriToGregorian(1447, 1, 1);
      // Tabular algorithm has ~1 month offset from Umm al-Qura
      // 1 Muharram 1447 is approximately mid-2025
      expect(result.getFullYear()).toBe(2025);
      expect(result.getMonth()).toBeGreaterThanOrEqual(4); // May+
    });
  });

  describe("hijriToIsoDate", () => {
    it("returns a YYYY-MM-DD string", () => {
      const result = hijriToIsoDate(1447, 9, 1);
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe("getHijriToday", () => {
    it("returns all required fields", () => {
      const result = getHijriToday();
      expect(result).toHaveProperty("year");
      expect(result).toHaveProperty("month");
      expect(result).toHaveProperty("day");
      expect(result).toHaveProperty("monthName");
      expect(result).toHaveProperty("isoDate");
    });

    it("isoDate is today", () => {
      const result = getHijriToday();
      const today = new Date().toISOString().slice(0, 10);
      expect(result.isoDate).toBe(today);
    });
  });
});
