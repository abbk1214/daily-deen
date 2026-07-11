import { describe, it, expect } from "vitest";
import {
  ISLAMIC_HOLIDAYS,
  getHolidayForDate,
  isRamadan,
  getRamadanDates,
  getCurrentHoliday,
  getNextHoliday,
  getHolidayBadge,
} from "../hijri-holidays";

describe("hijri-holidays", () => {
  describe("ISLAMIC_HOLIDAYS", () => {
    it("has at least 8 holidays", () => {
      expect(ISLAMIC_HOLIDAYS.length).toBeGreaterThanOrEqual(8);
    });

    it("all holidays have required fields", () => {
      for (const holiday of ISLAMIC_HOLIDAYS) {
        expect(holiday).toHaveProperty("name");
        expect(holiday).toHaveProperty("month");
        expect(holiday).toHaveProperty("day");
        expect(holiday).toHaveProperty("type");
        expect(holiday).toHaveProperty("description");
        expect(holiday.month).toBeGreaterThanOrEqual(1);
        expect(holiday.month).toBeLessThanOrEqual(12);
        expect(holiday.day).toBeGreaterThanOrEqual(1);
        expect(holiday.day).toBeLessThanOrEqual(30);
      }
    });

    it("includes Eid al-Fitr", () => {
      const names = ISLAMIC_HOLIDAYS.map((h) => h.name);
      expect(names).toContain("Eid al-Fitr");
    });

    it("includes Eid al-Adha", () => {
      const names = ISLAMIC_HOLIDAYS.map((h) => h.name);
      expect(names).toContain("Eid al-Adha");
    });

    it("includes Ramadan Begins", () => {
      const names = ISLAMIC_HOLIDAYS.map((h) => h.name);
      expect(names).toContain("Ramadan Begins");
    });

    it("includes Ashura", () => {
      const names = ISLAMIC_HOLIDAYS.map((h) => h.name);
      expect(names).toContain("Ashura");
    });

    it("includes Laylat al-Qadr", () => {
      const names = ISLAMIC_HOLIDAYS.map((h) => h.name);
      expect(names).toContain("Laylat al-Qadr");
    });
  });

  describe("getHolidayForDate", () => {
    it("returns null for a non-holiday date", () => {
      const result = getHolidayForDate("2026-01-15");
      expect(result).toBeNull();
    });

    it("returns a holiday object with name and description", () => {
      const result = getHolidayForDate("2026-01-15");
      if (result) {
        expect(result).toHaveProperty("name");
        expect(result).toHaveProperty("description");
        expect(result).toHaveProperty("type");
      }
    });
  });

  describe("isRamadan", () => {
    it("returns a boolean", () => {
      expect(typeof isRamadan("2026-03-20")).toBe("boolean");
    });
  });

  describe("getRamadanDates", () => {
    it("returns start and end dates", () => {
      const result = getRamadanDates(1447);
      expect(result).toHaveProperty("start");
      expect(result).toHaveProperty("end");
      expect(result.start).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(result.end).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it("start is before end", () => {
      const result = getRamadanDates(1447);
      expect(new Date(result.start).getTime()).toBeLessThanOrEqual(
        new Date(result.end).getTime(),
      );
    });
  });

  describe("getCurrentHoliday", () => {
    it("returns null or a holiday object", () => {
      const result = getCurrentHoliday();
      if (result) {
        expect(result).toHaveProperty("name");
        expect(result).toHaveProperty("description");
        expect(result).toHaveProperty("type");
      }
    });
  });

  describe("getNextHoliday", () => {
    it("returns null or an object with holiday and daysUntil", () => {
      const result = getNextHoliday();
      if (result) {
        expect(result).toHaveProperty("holiday");
        expect(result).toHaveProperty("daysUntil");
        expect(result.daysUntil).toBeGreaterThan(0);
      }
    });
  });

  describe("getHolidayBadge", () => {
    it("returns null for a non-holiday date", () => {
      const result = getHolidayBadge("2026-01-15");
      expect(result).toBeNull();
    });

    it("returns name and color for a holiday", () => {
      const result = getHolidayBadge("2026-01-15");
      if (result) {
        expect(result).toHaveProperty("name");
        expect(result).toHaveProperty("color");
        expect(typeof result.name).toBe("string");
        expect(typeof result.color).toBe("string");
      }
    });
  });
});
