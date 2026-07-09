const HIJRI_MONTHS = [
  "Muharram",
  "Safar",
  "Rabi al-Awwal",
  "Rabi al-Thani",
  "Jumada al-Ula",
  "Jumada al-Thani",
  "Rajab",
  "Shaban",
  "Ramadan",
  "Shawwal",
  "Dhul Qi dah",
  "Dhul Hijjah",
];

function gregorianToHijri(isoDate: string): { day: number; month: number; year: number; monthName: string } {
  const [y, m, d] = isoDate.split("-").map(Number);

  // Julian Day Number from Gregorian date
  const jd = gregorianToJD(y, m, d);

  return jdToHijri(jd);
}

function gregorianToJD(year: number, month: number, day: number): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;

  return (
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045
  );
}

function jdToHijri(jd: number): { day: number; month: number; year: number; monthName: string } {
  const l = jd - 1948440 + 10632;
  const n = Math.floor((l - 1) / 10631);
  const remainder = l - 10631 * n + 354;
  const j =
    Math.floor((10985 - remainder) / 5316) *
      Math.floor((50 * remainder) / 17719) +
    Math.floor(remainder / 5670) *
      Math.floor((43 * remainder) / 15238);
  const adjustedRemainder =
    remainder -
    Math.floor((30 - j) / 15) *
      Math.floor((17719 * j) / 50) -
    Math.floor(j / 16) *
      Math.floor((15238 * j) / 43) +
    29;
  const month = Math.floor((24 * adjustedRemainder) / 709);
  const day =
    adjustedRemainder - Math.floor((709 * month) / 24);
  const year = 30 * n + j - 30;

  return {
    day,
    month,
    year,
    monthName: HIJRI_MONTHS[month - 1] ?? "",
  };
}

/**
 * Format a Hijri date for display.
 * Example: "14 Ramadan 1447"
 */
export function formatHijriDate(isoDate: string): string {
  const h = gregorianToHijri(isoDate);
  return `${h.day} ${h.monthName} ${h.year}`;
}


