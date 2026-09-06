export interface IslamicLifeCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export interface IslamicLifeHabit {
  id: string;
  name: string;
  categoryId: string;
  defaultTarget: number;
  unit: string;
  description: string;
}

export const ISLAMIC_LIFE_CATEGORIES: IslamicLifeCategory[] = [
  {
    id: "prayer",
    name: "Prayer",
    description: "Daily salah and worship",
    icon: "🕌",
    color: "var(--dusk-teal)",
  },
  {
    id: "quran",
    name: "Quran",
    description: "Recitation and memorization",
    icon: "📖",
    color: "var(--dusk-mauve)",
  },
  {
    id: "dhikr",
    name: "Dhikr",
    description: "Remembrance of Allah",
    icon: "📿",
    color: "var(--warm-sand)",
  },
  {
    id: "charity",
    name: "Charity",
    description: "Sadaqah and giving",
    icon: "💰",
    color: "var(--quiet-sage)",
  },
  {
    id: "fasting",
    name: "Fasting",
    description: "Voluntary and obligatory fasts",
    icon: "🌙",
    color: "var(--dusk-mauve)",
  },
  {
    id: "knowledge",
    name: "Knowledge",
    description: "Islamic learning and study",
    icon: "📚",
    color: "var(--warm-sand)",
  },
];

export const ISLAMIC_LIFE_HABITS: IslamicLifeHabit[] = [
  {
    id: "fajr",
    name: "Fajr Prayer",
    categoryId: "prayer",
    defaultTarget: 1,
    unit: "prayer",
    description: "Obligatory morning prayer",
  },
  {
    id: "dhuhr",
    name: "Dhuhr Prayer",
    categoryId: "prayer",
    defaultTarget: 1,
    unit: "prayer",
    description: "Obligatory midday prayer",
  },
  {
    id: "asr",
    name: "Asr Prayer",
    categoryId: "prayer",
    defaultTarget: 1,
    unit: "prayer",
    description: "Obligatory afternoon prayer",
  },
  {
    id: "maghrib",
    name: "Maghrib Prayer",
    categoryId: "prayer",
    defaultTarget: 1,
    unit: "prayer",
    description: "Obligatory sunset prayer",
  },
  {
    id: "isha",
    name: "Isha Prayer",
    categoryId: "prayer",
    defaultTarget: 1,
    unit: "prayer",
    description: "Obligatory night prayer",
  },
  {
    id: "tahajjud",
    name: "Tahajjud",
    categoryId: "prayer",
    defaultTarget: 2,
    unit: "rak'ah",
    description: "Night prayer (voluntary)",
  },
  {
    id: "quran_pages",
    name: "Quran Reading",
    categoryId: "quran",
    defaultTarget: 5,
    unit: "pages",
    description: "Daily Quran recitation",
  },
  {
    id: "quran_memo",
    name: "Quran Memorization",
    categoryId: "quran",
    defaultTarget: 1,
    unit: "ayah",
    description: "Daily memorization practice",
  },
  {
    id: "quran_review",
    name: "Quran Review",
    categoryId: "quran",
    defaultTarget: 1,
    unit: "juz",
    description: "Review previously memorized portions",
  },
  {
    id: "morning_dhikr",
    name: "Morning Adhkar",
    categoryId: "dhikr",
    defaultTarget: 1,
    unit: "session",
    description: "Complete morning remembrance",
  },
  {
    id: "evening_dhikr",
    name: "Evening Adhkar",
    categoryId: "dhikr",
    defaultTarget: 1,
    unit: "session",
    description: "Complete evening remembrance",
  },
  {
    id: "tasbeeh",
    name: "Tasbeeh",
    categoryId: "dhikr",
    defaultTarget: 100,
    unit: "count",
    description: "SubhanAllah, Alhamdulillah, Allahu Akbar",
  },
  {
    id: "salawat",
    name: "Salawat",
    categoryId: "dhikr",
    defaultTarget: 100,
    unit: "count",
    description: "Blessings upon the Prophet ﷺ",
  },
  {
    id: "sadaqah",
    name: "Sadaqah",
    categoryId: "charity",
    defaultTarget: 1,
    unit: "act",
    description: "Voluntary charity",
  },
  {
    id: "monday_thursday_fast",
    name: "Monday/Thursday Fast",
    categoryId: "fasting",
    defaultTarget: 1,
    unit: "day",
    description: "Voluntary fast on Monday or Thursday",
  },
  {
    id: "ashura_fast",
    name: "Ashura Fast",
    categoryId: "fasting",
    defaultTarget: 1,
    unit: "day",
    description: "Fast on the day of Ashura",
  },
  {
    id: "six_days_shawwal",
    name: "Six Days of Shawwal",
    categoryId: "fasting",
    defaultTarget: 6,
    unit: "days",
    description: "Six fasts after Ramadan",
  },
  {
    id: "islamic_book",
    name: "Islamic Book Study",
    categoryId: "knowledge",
    defaultTarget: 30,
    unit: "minutes",
    description: "Reading Islamic书籍",
  },
  {
    id: "hadith_study",
    name: "Hadith Study",
    categoryId: "knowledge",
    defaultTarget: 1,
    unit: "hadith",
    description: "Study one hadith daily",
  },
  {
    id: "tafsir",
    name: "Tafsir Study",
    categoryId: "knowledge",
    defaultTarget: 1,
    unit: "ayah",
    description: "Study tafsir of Quran",
  },
];

export function getHabitsByCategory(categoryId: string): IslamicLifeHabit[] {
  return ISLAMIC_LIFE_HABITS.filter((h) => h.categoryId === categoryId);
}

export function getCategoryById(id: string): IslamicLifeCategory | undefined {
  return ISLAMIC_LIFE_CATEGORIES.find((c) => c.id === id);
}
