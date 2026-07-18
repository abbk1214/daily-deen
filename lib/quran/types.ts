export interface SurahMeta {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: "Meccan" | "Medinan";
  numberOfAyahs: number;
}

export interface Ayah {
  number: number;
  numberInSurah: number;
  text: string;
  juz: number;
  page: number;
  hizbQuarter: number;
  surahNumber: number;
}

export interface AyahTranslation {
  ayahNumber: number;
  surahNumber: number;
  text: string;
  edition: string;
}

export interface AyahTransliteration {
  ayahNumber: number;
  surahNumber: number;
  text: string;
}

export interface Bookmark {
  id?: number;
  surahNumber: number;
  ayahNumber: number;
  surahName: string;
  ayahText: string;
  note?: string;
  createdAt: number;
}

export interface ReadingProgress {
  id?: number;
  surahNumber: number;
  ayahNumber: number;
  lastReadAt: number;
}

export interface ReadingSession {
  id?: number;
  surahNumber: number;
  ayahNumber: number;
  duration: number;
  date: string;
}

export interface QuranSettings {
  selectedTranslation: string;
  selectedReciter: string;
  fontSize: number;
  showTranslation: boolean;
  showTransliteration: boolean;
}

export type Reciter = {
  id: string;
  name: string;
  language: string;
  baseUrl: string;
};

export const RECITERS: Reciter[] = [
  { id: "ar.alafasy", name: "Mishary Rashid Alafasy", language: "ar", baseUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy" },
  { id: "ar.minshawi", name: "Mohamed Siddiq El-Minshawi", language: "ar", baseUrl: "https://cdn.islamic.network/quran/audio/192/ar.minshawi" },
  { id: "ar.husary", name: "Mahmoud Khalil Al-Husary", language: "ar", baseUrl: "https://cdn.islamic.network/quran/audio/128/ar.husary" },
  { id: "ar.ayyoub", name: "Muhammad Ayyoub", language: "ar", baseUrl: "https://cdn.islamic.network/quran/audio/128/ar.ayyoub" },
];

export const TRANSLATIONS = [
  { id: "en.sahih", name: "Sahih International", language: "en" },
  { id: "en.pickthall", name: "Pickthall", language: "en" },
  { id: "en.yusufali", name: "Yusuf Ali", language: "en" },
];

export interface KhatmahGoal {
  id?: number;
  type: "pages_per_day" | "juz_per_week" | "surah_per_month" | "full_quran_per_year";
  target: number;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  createdAt: number;
}

export interface KhatmahProgress {
  id?: number;
  date: string;
  pagesRead: number;
  juzRead: number;
  ayahsRead: number;
  duration: number;
  lastPage: number;
  lastJuz: number;
}

export interface KhatmahStats {
  totalPagesRead: number;
  totalAyahsRead: number;
  totalMinutes: number;
  currentStreak: number;
  longestStreak: number;
  completedKhatmahs: number;
  pagesPerDay: number;
  estimatedDaysToComplete: number;
  percentComplete: number;
}

export interface ReadingSessionLog {
  id?: number;
  date: string;
  startTime: number;
  endTime: number;
  duration: number;
  pagesRead: number;
  ayahsRead: number;
  startPage: number;
  endPage: number;
}
