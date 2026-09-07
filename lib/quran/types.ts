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

export type Reciter = {
  id: string;
  name: string;
  language: string;
  baseUrl: string;
};

export const RECITERS: Reciter[] = [
  { id: "ar.alafasy", name: "Mishary Rashid Alafasy", language: "ar", baseUrl: "https://cdn.islamic.network/quran/audio/128/ar.alafasy" },
  { id: "ar.minshawi", name: "Mohamed Siddiq El-Minshawi", language: "ar", baseUrl: "https://cdn.islamic.network/quran/audio/128/ar.minshawi" },
  { id: "ar.husary", name: "Mahmoud Khalil Al-Husary", language: "ar", baseUrl: "https://cdn.islamic.network/quran/audio/128/ar.husary" },
];

export const TRANSLATIONS = [
  { id: "en.sahih", name: "Sahih International", language: "en" },
  { id: "en.pickthall", name: "Pickthall", language: "en" },
  { id: "en.yusufali", name: "Yusuf Ali", language: "en" },
];

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
