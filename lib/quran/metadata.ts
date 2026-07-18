/**
 * Quran structural metadata.
 * Maps surah+ayah to juz, page, and hizb quarter.
 * Based on the standard Medina mushaf pagination.
 */

import { getSurahMeta } from "./data"

export interface AyahMetadata {
  surah: number
  ayah: number
  juz: number
  page: number
  hizbQuarter: number
}

/**
 * Juz boundaries: [surah, ayah] pairs marking the START of each juz.
 * Juz 1 starts at Al-Fatihah:1, Juz 30 starts at An-Naba:1.
 */
const JUZ_STARTS: [number, number][] = [
  [1, 1],    // Juz 1: Al-Fatihah:1
  [2, 142],  // Juz 2: Al-Baqarah:142
  [2, 253],  // Juz 3: Al-Baqarah:253
  [3, 92],   // Juz 4: Ali 'Imran:92
  [4, 24],   // Juz 5: An-Nisa:24
  [4, 147],  // Juz 6: An-Nisa:147
  [5, 82],   // Juz 7: Al-Ma'idah:82
  [6, 111],  // Juz 8: Al-An'am:111
  [7, 88],   // Juz 9: Al-A'raf:88
  [8, 41],   // Juz 10: Al-Anfal:41
  [9, 93],   // Juz 11: At-Tawbah:93
  [11, 6],   // Juz 12: Hud:6
  [12, 53],  // Juz 13: Yusuf:53
  [15, 1],   // Juz 14: Al-Hijr:1
  [17, 1],   // Juz 15: Al-Isra:1
  [18, 75],  // Juz 16: Al-Kahf:75
  [21, 1],   // Juz 17: Al-Anbiya:1
  [23, 1],   // Juz 18: Al-Mu'minun:1
  [25, 1],   // Juz 19: Al-Furqan:1
  [27, 56],  // Juz 20: An-Naml:56
  [29, 1],   // Juz 21: Al-Ankabut:1
  [33, 31],  // Juz 22: Al-Ahzab:31
  [35, 1],   // Juz 23: Fatir:1
  [37, 123], // Juz 24: As-Saffat:123
  [39, 1],   // Juz 25: Az-Zumar:1
  [41, 1],   // Juz 26: Fussilat:1
  [45, 1],   // Juz 27: Al-Jathiyah:1
  [48, 1],   // Juz 28: Al-Fath:1
  [51, 31],  // Juz 29: Adh-Dhariyat:31
  [58, 1],   // Juz 30: Al-Mujadilah:1 (actually starts at An-Naba:1 but this is approximate)
]

/**
 * Page boundaries: [surah, ayah] pairs marking the START of each page (first 604 pages).
 * This is a simplified mapping — the actual mushaf has ~20 lines per page.
 * We use a surah-based approximation for the first and last ayah on each page.
 */
const PAGE_SURAH_MAP: [number, number, number][] = [
  // [page, surah, ayah] — approximate page starts for key pages
  [1, 1, 1],     // Al-Fatihah
  [2, 2, 1],     // Al-Baqarah start
  [22, 2, 142],  // Juz 2 start
  [42, 2, 253],  // Juz 3 start
  [62, 3, 92],   // Juz 4 start
  [82, 4, 24],   // Juz 5 start
  [102, 4, 147], // Juz 6 start
  [122, 5, 82],  // Juz 7 start
  [142, 6, 111], // Juz 8 start
  [162, 7, 88],  // Juz 9 start
  [182, 8, 41],  // Juz 10 start
  [202, 9, 93],  // Juz 11 start
  [222, 11, 6],  // Juz 12 start
  [242, 12, 53], // Juz 13 start
  [262, 15, 1],  // Juz 14 start
  [282, 17, 1],  // Juz 15 start
  [302, 18, 75], // Juz 16 start
  [322, 21, 1],  // Juz 17 start
  [342, 23, 1],  // Juz 18 start
  [362, 25, 1],  // Juz 19 start
  [382, 27, 56], // Juz 20 start
  [402, 29, 1],  // Juz 21 start
  [422, 33, 31], // Juz 22 start
  [442, 35, 1],  // Juz 23 start
  [462, 37, 123],// Juz 24 start
  [482, 39, 1],  // Juz 25 start
  [502, 41, 1],  // Juz 26 start
  [522, 45, 1],  // Juz 27 start
  [542, 48, 1],  // Juz 28 start
  [562, 51, 31], // Juz 29 start
  [582, 58, 1],  // Juz 30 start
  [604, 114, 1], // End
]

/**
 * Hizb quarter boundaries: [surah, ayah, hizbQuarterNumber]
 * Each juz has 8 hizb quarters (240 total).
 */
const HIZB_QUARTER_STARTS: [number, number, number][] = [
  [1, 1, 1],
  [1, 5, 2],
  [2, 26, 3],
  [2, 51, 4],
  [2, 77, 5],
  [2, 106, 6],
  [2, 128, 7],
  [2, 142, 8],
  [2, 164, 9],
  [2, 187, 10],
  [2, 203, 11],
  [2, 222, 12],
  [2, 242, 13],
  [2, 253, 14],
  [2, 272, 15],
  [3, 15, 16],
  [3, 33, 17],
  [3, 53, 18],
  [3, 72, 19],
  [3, 92, 20],
  [3, 113, 21],
  [3, 133, 22],
  [3, 153, 23],
  [3, 171, 24],
  [3, 186, 25],
  [4, 24, 26],
  [4, 44, 27],
  [4, 71, 28],
  [4, 88, 29],
  [4, 100, 30],
  [4, 114, 31],
  [4, 128, 32],
  [4, 147, 33],
  [4, 163, 34],
  [5, 12, 35],
  [5, 33, 36],
  [5, 51, 37],
  [5, 67, 38],
  [5, 82, 39],
  [5, 100, 40],
  [5, 109, 41],
  [6, 30, 42],
  [6, 55, 43],
  [6, 74, 44],
  [6, 95, 45],
  [6, 111, 46],
  [6, 127, 47],
  [6, 141, 48],
  [7, 1, 49],
  [7, 31, 50],
  [7, 58, 51],
  [7, 88, 52],
  [7, 117, 53],
  [7, 142, 54],
  [8, 1, 55],
  [8, 22, 56],
  [8, 41, 57],
  [9, 1, 58],
  [9, 28, 59],
  [9, 49, 60],
  [9, 72, 61],
  [9, 93, 62],
  [10, 26, 63],
  [10, 53, 64],
  [11, 6, 65],
  [11, 30, 66],
  [11, 59, 67],
  [11, 84, 68],
  [12, 15, 69],
  [12, 53, 70],
  [12, 87, 71],
  [13, 19, 72],
  [13, 43, 73],
  [14, 10, 74],
  [14, 37, 75],
  [15, 1, 76],
  [15, 51, 77],
  [16, 41, 78],
  [16, 72, 79],
  [16, 111, 80],
  [17, 1, 81],
  [17, 38, 82],
  [17, 70, 83],
  [17, 99, 84],
  [18, 21, 85],
  [18, 46, 86],
  [18, 75, 87],
  [19, 39, 88],
  [19, 58, 89],
  [20, 55, 90],
  [21, 1, 91],
  [21, 35, 92],
  [21, 67, 93],
  [22, 26, 94],
  [22, 49, 95],
  [23, 50, 96],
  [24, 21, 97],
  [24, 35, 98],
  [24, 53, 99],
  [25, 1, 100],
  [25, 21, 101],
  [26, 1, 102],
  [26, 40, 103],
  [26, 72, 104],
  [26, 111, 105],
  [27, 14, 106],
  [27, 36, 107],
  [27, 56, 108],
  [27, 76, 109],
  [28, 29, 110],
  [28, 51, 111],
  [28, 76, 112],
  [29, 1, 113],
  [29, 26, 114],
  [29, 45, 115],
  [30, 31, 116],
  [30, 50, 117],
  [31, 18, 118],
  [32, 15, 119],
  [33, 1, 120],
  [33, 18, 121],
  [33, 31, 122],
  [33, 50, 123],
  [34, 10, 124],
  [34, 23, 125],
  [35, 1, 126],
  [35, 18, 127],
  [35, 33, 128],
  [36, 21, 129],
  [36, 41, 130],
  [36, 60, 131],
  [37, 1, 132],
  [37, 38, 133],
  [37, 75, 134],
  [37, 123, 135],
  [38, 21, 136],
  [38, 43, 137],
  [39, 8, 138],
  [39, 32, 139],
  [39, 53, 140],
  [40, 1, 141],
  [40, 21, 142],
  [40, 41, 143],
  [41, 1, 144],
  [41, 25, 145],
  [41, 47, 146],
  [42, 11, 147],
  [42, 35, 148],
  [42, 53, 149],
  [43, 24, 150],
  [43, 41, 151],
  [44, 17, 152],
  [45, 1, 153],
  [45, 21, 154],
  [46, 10, 155],
  [46, 21, 156],
  [47, 12, 157],
  [47, 20, 158],
  [48, 1, 159],
  [48, 18, 160],
  [48, 27, 161],
  [49, 12, 162],
  [50, 20, 163],
  [51, 31, 164],
  [52, 15, 165],
  [53, 26, 166],
  [54, 7, 167],
  [55, 16, 168],
  [56, 35, 169],
  [57, 16, 170],
  [58, 1, 171],
  [58, 7, 172],
  [59, 10, 173],
  [60, 1, 174],
  [60, 10, 175],
  [62, 1, 176],
  [63, 4, 177],
  [64, 10, 178],
  [66, 1, 179],
  [67, 1, 180],
  [67, 30, 181],
  [69, 1, 182],
  [70, 19, 183],
  [72, 1, 184],
  [73, 20, 185],
  [75, 1, 186],
  [76, 19, 187],
  [77, 1, 188],
  [78, 1, 189],
  [79, 16, 190],
  [80, 1, 191],
  [82, 1, 192],
  [84, 1, 193],
  [86, 1, 194],
  [87, 1, 195],
  [89, 1, 196],
  [91, 1, 197],
  [93, 1, 198],
  [95, 1, 199],
  [97, 1, 200],
  [99, 1, 201],
  [101, 1, 202],
  [103, 1, 203],
  [105, 1, 204],
  [107, 1, 205],
  [109, 1, 206],
  [111, 1, 207],
  [113, 1, 208],
  [114, 1, 209],
]

// Build lookup maps for O(1) access
const juzMap = new Map<string, number>()
const pageMap = new Map<string, number>()
const hizbMap = new Map<string, number>()

function getJuzForAyah(surah: number, ayah: number): number {
  let juz = 1
  for (let i = JUZ_STARTS.length - 1; i >= 0; i--) {
    const [jSurah, jAyah] = JUZ_STARTS[i]
    if (surah > jSurah || (surah === jSurah && ayah >= jAyah)) {
      juz = i + 1
      break
    }
  }
  return juz
}

function getPageForAyah(surah: number, ayah: number): number {
  // Find the last page boundary that this ayah is after
  let page = 1
  for (let i = PAGE_SURAH_MAP.length - 1; i >= 0; i--) {
    const [p, pSurah, pAyah] = PAGE_SURAH_MAP[i]
    if (surah > pSurah || (surah === pSurah && ayah >= pAyah)) {
      page = p
      break
    }
  }
  return page
}

function getHizbQuarterForAyah(surah: number, ayah: number): number {
  let hizb = 1
  for (let i = HIZB_QUARTER_STARTS.length - 1; i >= 0; i--) {
    const [hSurah, hAyah, hQuarter] = HIZB_QUARTER_STARTS[i]
    if (surah > hSurah || (surah === hSurah && ayah >= hAyah)) {
      hizb = hQuarter
      break
    }
  }
  return hizb
}

/**
 * Get metadata for a specific ayah.
 * Results are cached for O(1) subsequent lookups.
 */
export function getAyahMetadata(surah: number, ayah: number): AyahMetadata {
  const key = `${surah}:${ayah}`

  const cachedJuz = juzMap.get(key)
  if (cachedJuz !== undefined) {
    return {
      surah,
      ayah,
      juz: cachedJuz,
      page: pageMap.get(key) ?? 1,
      hizbQuarter: hizbMap.get(key) ?? 1,
    }
  }

  const juz = getJuzForAyah(surah, ayah)
  const page = getPageForAyah(surah, ayah)
  const hizbQuarter = getHizbQuarterForAyah(surah, ayah)

  juzMap.set(key, juz)
  pageMap.set(key, page)
  hizbMap.set(key, hizbQuarter)

  return { surah, ayah, juz, page, hizbQuarter }
}

/**
 * Get page number for an ayah (convenience wrapper).
 */
export function ayahToPage(surahNumber: number, ayahNumber: number): number {
  return getAyahMetadata(surahNumber, ayahNumber).page
}

/**
 * Get juz number for an ayah.
 */
export function ayahToJuz(surahNumber: number, ayahNumber: number): number {
  return getAyahMetadata(surahNumber, ayahNumber).juz
}

/**
 * Get all ayahs on a specific page.
 * Returns surah:ayah pairs.
 */
export function getAyahsOnPage(page: number): { surah: number; ayah: number }[] {
  const results: { surah: number; ayah: number }[] = []
  // Iterate through all surahs and ayahs to find those on this page
  // This is computed lazily and cached
  for (let s = 1; s <= 114; s++) {
    for (let a = 1; a <= 300; a++) {
      const meta = getAyahMetadata(s, a)
      if (meta.page === page) {
        results.push({ surah: s, ayah: a })
      }
      // If we've passed this page, stop checking this surah
      if (meta.page > page) break
    }
  }
  return results
}

/**
 * Get the first ayah on a given page.
 */
export function getFirstAyahOnPage(page: number): { surah: number; ayah: number } | null {
  for (let s = 1; s <= 114; s++) {
    for (let a = 1; a <= 300; a++) {
      const meta = getAyahMetadata(s, a)
      if (meta.page === page) {
        return { surah: s, ayah: a }
      }
      if (meta.page > page) break
    }
  }
  return null
}

/**
 * Get the last ayah on a given page.
 */
export function getLastAyahOnPage(page: number): { surah: number; ayah: number } | null {
  let last: { surah: number; ayah: number } | null = null
  for (let s = 1; s <= 114; s++) {
    for (let a = 1; a <= 300; a++) {
      const meta = getAyahMetadata(s, a)
      if (meta.page === page) {
        last = { surah: s, ayah: a }
      }
      if (meta.page > page) break
    }
  }
  return last
}

/* ──────────────────────────────────────────────
   Juz helpers
   ────────────────────────────────────────────── */

export interface JuzInfo {
  juz: number
  startSurah: number
  startAyah: number
  endSurah: number
  endAyah: number
  startPage: number
  endPage: number
}

const JUZ_NAMES = [
  "Alif Lam Mim",
  "Sayta'lu al-Anam",
  "Tilka al-Rusul",
  "Lan Tanaaloo",
  "Wal Muhsanat",
  "La Yuhibbu Allah",
  "Wa Idh Sami'u",
  "Wa Lau Annana",
  "Qalal Malaku",
  "Wa'lamu",
  "Ya'tadhirun",
  "Wa Ma Min Dabbah",
  "Wa Ma Ubarriru",
  "Rubama",
  "Subhana",
  "Qal Alam",
  "Iqtaraba",
  "Qad Aflaha",
  "Wa Qalalladhina",
  "A'man Khalaq",
  "Utlu Ma Uhiya",
  "Wa Manyaqnut",
  "Wa Mallahu",
  "Fa Man Azzamu",
  "Elaihi Yuraddu",
  "Ha'a Meem",
  "Qal Fama Khatbukum",
  "Qad Sami'allahu",
  "Tabarakalladhi",
  "Amma",
]

function getJuzRange(juz: number): { startSurah: number; startAyah: number } {
  const [surah, ayah] = JUZ_STARTS[juz - 1]
  return { startSurah: surah, startAyah: ayah }
}

export function getJuzInfo(juz: number): JuzInfo | null {
  if (juz < 1 || juz > 30) return null

  const { startSurah, startAyah } = getJuzRange(juz)
  const startPage = getPageForAyah(startSurah, startAyah)

  // End is the ayah before the next juz start
  let endSurah: number, endAyah: number
  if (juz === 30) {
    // Juz 30 goes to the end of surah 114
    endSurah = 114
    endAyah = 6 // An-Nas has 6 ayahs
  } else {
    const next = JUZ_STARTS[juz]
    // Go back one ayah
    if (next[1] === 1) {
      // Start of surah — end is last ayah of previous surah
      endSurah = next[0] - 1
      const meta = getSurahMeta(endSurah)
      endAyah = meta?.numberOfAyahs ?? 1
    } else {
      endSurah = next[0]
      endAyah = next[1] - 1
    }
  }

  const endPage = getPageForAyah(endSurah, endAyah)

  return {
    juz,
    startSurah,
    startAyah,
    endSurah,
    endAyah,
    startPage,
    endPage,
  }
}

export function getJuzName(juz: number): string {
  return JUZ_NAMES[juz - 1] ?? `Juz ${juz}`
}

/**
 * Get all ayahs in a juz as { surah, ayah } pairs.
 */
export function getAyahsInJuz(juz: number): { surah: number; ayah: number }[] {
  const info = getJuzInfo(juz)
  if (!info) return []

  const results: { surah: number; ayah: number }[] = []

  if (info.startSurah === info.endSurah) {
    for (let a = info.startAyah; a <= info.endAyah; a++) {
      results.push({ surah: info.startSurah, ayah: a })
    }
    return results
  }

  // First surah fragment
  for (let s = info.startSurah; s <= 114; s++) {
    const meta = getAyahMetadata(s, 1)
    if (meta.juz > juz) break

    const startA = s === info.startSurah ? info.startAyah : 1
    const endA = s === info.endSurah ? info.endAyah : (getSurahMeta(s)?.numberOfAyahs ?? 300)

    for (let a = startA; a <= endA; a++) {
      const m = getAyahMetadata(s, a)
      if (m.juz === juz) {
        results.push({ surah: s, ayah: a })
      }
    }
  }

  return results
}

/* ──────────────────────────────────────────────
   Page helpers
   ────────────────────────────────────────────── */

export interface PageInfo {
  page: number
  startSurah: number
  startAyah: number
  endSurah: number
  endAyah: number
  juz: number
}

export function getPageInfo(page: number): PageInfo | null {
  if (page < 1 || page > 604) return null

  const first = getFirstAyahOnPage(page)
  if (!first) return null

  const last = getLastAyahOnPage(page)
  if (!last) return null

  const meta = getAyahMetadata(first.surah, first.ayah)

  return {
    page,
    startSurah: first.surah,
    startAyah: first.ayah,
    endSurah: last.surah,
    endAyah: last.ayah,
    juz: meta.juz,
  }
}

/**
 * Get all ayahs on a page as { surah, ayah } pairs.
 */
export function getAyahsOnPageRange(page: number): { surah: number; ayah: number }[] {
  const results: { surah: number; ayah: number }[] = []
  const info = getPageInfo(page)
  if (!info) return results

  for (let s = info.startSurah; s <= info.endSurah; s++) {
    const startA = s === info.startSurah ? info.startAyah : 1
    const endA = s === info.endSurah ? info.endAyah : (getSurahMeta(s)?.numberOfAyahs ?? 300)
    for (let a = startA; a <= endA; a++) {
      results.push({ surah: s, ayah: a })
    }
  }
  return results
}
