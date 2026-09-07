import type { Ayah, AyahTranslation } from "./types";
import { getAyahMetadata } from "./metadata";
import { SURAH_LIST } from "./data";

const ARABIC_URL = "https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions/ara-quranuthmanienc.min.json";
const ENGLISH_URL = "https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions/eng-mustafakhattaba.min.json";

const CACHE_PREFIX = "quran-v3";
const CACHE_TTL = 30 * 24 * 60 * 60 * 1000; // 30 days

// Precompute cumulative ayah counts for correct global ayah numbering
const CUMULATIVE_AYAHS: number[] = [];
{
  let total = 0;
  for (const surah of SURAH_LIST) {
    CUMULATIVE_AYAHS.push(total);
    total += surah.numberOfAyahs;
  }
}

/** Get the global ayah number (1-6236) for a given surah and ayah-in-surah. */
export function getGlobalAyahNumber(surahNumber: number, ayahNumber: number): number {
  return (CUMULATIVE_AYAHS[surahNumber - 1] ?? 0) + ayahNumber;
}

interface RawAyah {
  chapter: number;
  verse: number;
  text: string;
}

interface RawEdition {
  quran: RawAyah[];
}

function cacheKey(type: string, id: string): string {
  return `${CACHE_PREFIX}:${type}:${id}`;
}

function getCached<T>(key: string): T | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw);
    if (Date.now() - ts > CACHE_TTL) {
      localStorage.removeItem(key);
      return null;
    }
    return data as T;
  } catch {
    return null;
  }
}

function setCache<T>(key: string, data: T): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(key, JSON.stringify({ data, ts: Date.now() }));
  } catch {
    // Storage full — silently fail
  }
}

const arabicCache: Map<number, Ayah[]> = new Map();
const englishCache: Map<number, AyahTranslation[]> = new Map();
let allArabicLoaded = false;
let allEnglishLoaded = false;
let arabicPromise: Promise<void> | null = null;
let englishPromise: Promise<void> | null = null;

async function loadFullEdition(url: string, label: string): Promise<RawAyah[]> {
  const cacheKey_ = cacheKey("full", label);
  const cached = getCached<RawAyah[]>(cacheKey_);
  if (cached) return cached;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load ${label}: ${res.status}`);
  const json: RawEdition = await res.json();
  if (!json.quran?.length) throw new Error(`Invalid ${label} data`);
  setCache(cacheKey_, json.quran);
  return json.quran;
}

async function ensureArabic(): Promise<void> {
  if (allArabicLoaded) return;
  if (arabicPromise) return arabicPromise;
  arabicPromise = (async () => {
    const data = await loadFullEdition(ARABIC_URL, "arabic");
    const seen = new Map<number, Set<number>>();
    for (const a of data) {
      const chapterSeen = seen.get(a.chapter) || new Set<number>();
      if (chapterSeen.has(a.verse)) continue;
      chapterSeen.add(a.verse);
      seen.set(a.chapter, chapterSeen);
      const meta = getAyahMetadata(a.chapter, a.verse);
      const existing = arabicCache.get(a.chapter) || [];
      existing.push({
        number: getGlobalAyahNumber(a.chapter, a.verse),
        numberInSurah: a.verse,
        text: a.text,
        juz: meta.juz,
        page: meta.page,
        hizbQuarter: meta.hizbQuarter,
        surahNumber: a.chapter,
      });
      arabicCache.set(a.chapter, existing);
    }
    allArabicLoaded = true;
  })().catch((err) => {
    arabicPromise = null;
    throw err;
  });
  await arabicPromise;
}

async function ensureEnglish(): Promise<void> {
  if (allEnglishLoaded) return;
  if (englishPromise) return englishPromise;
  englishPromise = (async () => {
    const data = await loadFullEdition(ENGLISH_URL, "english");
    const seen = new Map<number, Set<number>>();
    for (const a of data) {
      const chapterSeen = seen.get(a.chapter) || new Set<number>();
      if (chapterSeen.has(a.verse)) continue;
      chapterSeen.add(a.verse);
      seen.set(a.chapter, chapterSeen);
      const existing = englishCache.get(a.chapter) || [];
      existing.push({
        ayahNumber: a.verse,
        surahNumber: a.chapter,
        text: a.text,
        edition: "eng-mustafakhattaba",
      });
      englishCache.set(a.chapter, existing);
    }
    allEnglishLoaded = true;
  })().catch((err) => {
    englishPromise = null;
    throw err;
  });
  await englishPromise;
}

export async function fetchAyahs(surahNumber: number): Promise<Ayah[]> {
  const key = cacheKey("ayahs", String(surahNumber));
  const cached = getCached<Ayah[]>(key);
  if (cached) {
    const seen = new Set<number>();
    return cached.filter((a) => {
      if (seen.has(a.numberInSurah)) return false;
      seen.add(a.numberInSurah);
      return true;
    });
  }

  try {
    await ensureArabic();
  } catch (err) {
    throw new Error(`Failed to load Quran text: ${(err as Error).message}`);
  }

  const raw = arabicCache.get(surahNumber) || [];
  if (raw.length === 0) {
    throw new Error(`Surah ${surahNumber} not found`);
  }

  const seen = new Set<number>();
  const ayahs = raw.filter((a) => {
    if (seen.has(a.numberInSurah)) return false;
    seen.add(a.numberInSurah);
    return true;
  });

  setCache(key, ayahs);
  return ayahs;
}

export async function fetchTranslation(
  surahNumber: number,
  _edition: string = "en.sahih",
): Promise<AyahTranslation[]> {
  const key = cacheKey("trans", String(surahNumber));
  const cached = getCached<AyahTranslation[]>(key);
  if (cached) {
    const seen = new Set<number>();
    return cached.filter((t) => {
      if (seen.has(t.ayahNumber)) return false;
      seen.add(t.ayahNumber);
      return true;
    });
  }

  try {
    await ensureEnglish();
  } catch (err) {
    throw new Error(`Failed to load translation: ${(err as Error).message}`);
  }

  const raw = englishCache.get(surahNumber) || [];
  if (raw.length === 0) {
    throw new Error(`Translation for surah ${surahNumber} not found`);
  }

  const seenT = new Set<number>();
  const translations = raw.filter((t) => {
    if (seenT.has(t.ayahNumber)) return false;
    seenT.add(t.ayahNumber);
    return true;
  });

  setCache(key, translations);
  return translations;
}

export function getTotalPages(): number {
  return 604;
}

export { ayahToPage } from "./metadata";

/* ──────────────────────────────────────────────
   Word-by-word API (api.islamic.app)
   ────────────────────────────────────────────── */

export interface WordData {
  position: number;
  text_uthmani: string;
  translation: string;
  transliteration: string;
  char_type: string;
  audio_url: string;
}

export interface AyahWords {
  surah_number: number;
  ayah_number: number;
  words: WordData[];
}

const WORDS_CACHE_PREFIX = "quran-words";
const WORDS_CACHE_TTL = 30 * 24 * 60 * 60 * 1000; // 30 days

export async function fetchAyahWords(surahNumber: number, ayahNumber: number): Promise<WordData[]> {
  const key = `${WORDS_CACHE_PREFIX}:${surahNumber}:${ayahNumber}`;

  // Check localStorage cache
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const { data, ts } = JSON.parse(raw);
      if (Date.now() - ts < WORDS_CACHE_TTL) return data as WordData[];
      localStorage.removeItem(key);
    }
  } catch { /* ignore */ }

  try {
    const res = await fetch(`https://api.islamic.app/v1/words/${surahNumber}/${ayahNumber}`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    const words: WordData[] = (json.data?.words || []).filter(
      (w: WordData) => w.char_type === "word",
    );

    // Cache in localStorage
    try {
      localStorage.setItem(key, JSON.stringify({ data: words, ts: Date.now() }));
    } catch { /* ignore */ }

    return words;
  } catch (err) {
    console.warn("Failed to fetch word-by-word data:", err);
    return [];
  }
}
