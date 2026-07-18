export interface Dhikr {
  id: string;
  arabic: string;
  transliteration: string;
  translation: string;
  reference: string;
  count: number;
  virtuous?: string;
}

export interface DhikrCategory {
  id: string;
  name: string;
  description: string;
  dhikrs: Dhikr[];
}

export interface TasbeehCount {
  id?: number;
  dhikrId: string;
  target: number;
  current: number;
  date: string;
}

export interface CustomDhikr {
  id?: number;
  arabic: string;
  transliteration: string;
  translation: string;
  target: number;
  createdAt: number;
}

export const MORNING_ADHKAR: DhikrCategory = {
  id: "morning",
  name: "Morning Adhkar",
  description: "Remembrance recited after Fajr prayer until sunrise",
  dhikrs: [
    {
      id: "morning-1",
      arabic: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَٰهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
      transliteration: "Asbahna wa asbahal-mulku lillah, walhamdu lillah, la ilaha illallahu wahdahu la shareeka lah, lahul-mulku walahul-hamd wahuwa AAala kulli shay'in qadeer",
      translation: "We have reached the morning and at this very time all sovereignty belongs to Allah. Praise be to Allah. None has the right to be worshipped but Allah, the One, having no partner. To Him belongs sovereignty and praise and He is over all things wholly capable.",
      reference: "Sahih Muslim 591",
      count: 1,
    },
    {
      id: "morning-2",
      arabic: "اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ",
      transliteration: "Allahumma bika asbahna, wabika amsayna, wabika nahya, wabika namootu, wa-ilaykan-nushoor",
      translation: "O Allah, by You we have reached the morning, and by You we have reached the evening. By You we live and by You we die, and to You is the resurrection.",
      reference: "Sunan At-Tirmidhi 55",
      count: 1,
    },
    {
      id: "morning-3",
      arabic: "اللَّهُمَّ أَنْتَ رَبِّي لاَ إِلَٰهَ إِلاَّ أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لاَ يَغْفِرُ الذُّنُوبَ إِلاَّ أَنْتَ",
      transliteration: "Allahumma anta rabbee la ilaha illa anta, khalaqtanee wa-ana AAabduka, wana AAala AAahdika wawaAAdika mastataAAtu, aAAoo thubika min sharri ma sanaAAtu, aboo-o laka biAAanAAamati AAalayya, waboo-o bi-thanbee faghfir lee fa-innahu la yaghfiruth-thunooba illa anta",
      translation: "O Allah, You are my Lord, none has the right to be worshipped except You. You created me and I am Your servant, and I abide by Your covenant and promise as best I can. I take refuge in You from the evil of what I have done. I acknowledge Your favour upon me and I acknowledge my sin, so forgive me, for verily none can forgive sins except You.",
      reference: "Sahih Al-Bukhari 6306",
      count: 1,
      virtuous: "Whoever recites this in the morning and evening, and dies on that day or night, will enter Paradise.",
    },
    {
      id: "morning-4",
      arabic: "اللَّهُمَّ إِنِّي أَصْبَحْتُ أُشْهِدُكَ وَأُشْهِدُ حَمَلَةَ عَرْشِكَ، وَمَلاَئِكَتَكَ وَجَمِيعَ خَلْقِكَ، أَنَّكَ أَنْتَ اللَّهُ لاَ إِلَٰهَ إِلاَّ أَنْتَ وَحْدَكَ لاَ شَرِيكَ لَكَ، وَأَنَّ مُحَمَّدًا عَبْدُكَ وَرَسُولُكَ",
      transliteration: "Allahumma innee asbahtu oshhideka wa osh-hidu hamalata AAarshika wamalaa-ikataka wajameeAAa khalqika annaka antal-lAAahu laa ilaaha illaa anta wahdaka laa shareeka lak, wana Muhammadan AAabduka warasooluka",
      translation: "O Allah, I have reached the morning and call upon You and upon the bearers of Your Throne, upon Your angels and all of Your creation, to bear witness that You are Allah, none has the right to be worshipped except You, alone, without partner, and that Muhammad is Your servant and Messenger.",
      reference: "Sunan Abi Dawud 5088",
      count: 4,
    },
    {
      id: "morning-5",
      arabic: "اللَّهُمَّ مَا أَصْبَحَ بِي مِنْ نِعْمَةٍ أَوْ بِأَحَدٍ مِنْ خَلْقِكَ فَمِنْكَ وَحْدَكَ لاَ شَرِيكَ لَكَ، فَلَكَ الْحَمْدُ وَلَكَ الشُّكْرُ",
      transliteration: "Allahumma ma as-haba bee min niAAmatin aw bi-ahadin min khalqika faminka wahdaka la shareeka lak, falakal-hamdu walakash-shukr",
      translation: "O Allah, every blessing that I have reached in the morning or any of Your creation has, it is from You alone, having no partner. To You belongs all praise and all thanks.",
      reference: "Sunan Abi Dawud 5089",
      count: 1,
    },
    {
      id: "morning-6",
      arabic: "اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لاَ إِلَٰهَ إِلاَّ أَنْتَ",
      transliteration: "Allahumma AAafinee fee badanee, allahumma AAafinee fee samAAee, allahumma AAafinee fee basaree, la ilaha illaa anta",
      translation: "O Allah, grant me health in my body. O Allah, grant me health in my hearing. O Allah, grant me health in my sight. None has the right to be worshipped except You.",
      reference: "Sunan Abi Dawud 5089",
      count: 3,
    },
    {
      id: "morning-7",
      arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْكُفْرِ، وَالْفَقْرِ، وَعَذَابِ الْقَبْرِ، لاَ إِلَٰهَ إِلاَّ أَنْتَ",
      transliteration: "Allahumma innee aAAoothubika minal-kufri, walfaqri, waAAathabil-qabri, la ilaha illaa anta",
      translation: "O Allah, I seek refuge in You from disbelief, poverty, and the punishment of the grave. None has the right to be worshipped except You.",
      reference: "Sunan Abi Dawud 5088",
      count: 3,
    },
  ],
};

export const EVENING_ADHKAR: DhikrCategory = {
  id: "evening",
  name: "Evening Adhkar",
  description: "Remembrance recited after Asr prayer until night",
  dhikrs: [
    {
      id: "evening-1",
      arabic: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَٰهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
      transliteration: "Amsayna wa amsal-mulku lillah, walhamdu lillah, la ilaha illallahu wahdahu la shareeka lah, lahul-mulku walahul-hamd wahuwa AAala kulli shay'in qadeer",
      translation: "We have reached the evening and at this very time all sovereignty belongs to Allah. Praise be to Allah. None has the right to be worshipped but Allah, the One, having no partner. To Him belongs sovereignty and praise and He is over all things wholly capable.",
      reference: "Sahih Muslim 592",
      count: 1,
    },
    {
      id: "evening-2",
      arabic: "اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ الْمَصِيرُ",
      transliteration: "Allahumma bika amsayna, wabika asbahna, wabika nahya, wabika namootu, wa-ilaykal-maseer",
      translation: "O Allah, by You we have reached the evening, and by You we have reached the morning. By You we live and by You we die, and to You is our final destination.",
      reference: "Sahih Al-Bukhari 6314",
      count: 1,
    },
    {
      id: "evening-3",
      arabic: "اللَّهُمَّ أَنْتَ رَبِّي لاَ إِلَٰهَ إِلاَّ أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لاَ يَغْفِرُ الذُّنُوبَ إِلاَّ أَنْتَ",
      transliteration: "Allahumma anta rabbee la ilaha illa anta, khalaqtanee wa-ana AAabduka, wana AAala AAahdika wawaAAdika mastataAAtu, aAAoo thubika min sharri ma sanaAAtu, aboo-o laka biAAanAAamati AAalayya, waboo-o bi-thanbee faghfir lee fa-innahu la yaghfiruth-thunooba illa anta",
      translation: "O Allah, You are my Lord, none has the right to be worshipped except You. You created me and I am Your servant, and I abide by Your covenant and promise as best I can. I take refuge in You from the evil of what I have done. I acknowledge Your favour upon me and I acknowledge my sin, so forgive me, for verily none can forgive sins except You.",
      reference: "Sahih Al-Bukhari 6306",
      count: 1,
      virtuous: "Whoever recites this in the morning and evening, and dies on that day or night, will enter Paradise.",
    },
    {
      id: "evening-4",
      arabic: "اللَّهُمَّ إِنِّي أَمْسَيْتُ أُشْهِدُكَ وَأُشْهِدُ حَمَلَةَ عَرْشِكَ، وَمَلاَئِكَتَكَ وَجَمِيعَ خَلْقِكَ، أَنَّكَ أَنْتَ اللَّهُ لاَ إِلَٰهَ إِلاَّ أَنْتَ وَحْدَكَ لاَ شَرِيكَ لَكَ، وَأَنَّ مُحَمَّدًا عَبْدُكَ وَرَسُولُكَ",
      transliteration: "Allahumma innee amsaytu oshhideka wa osh-hidu hamalata AAarshika wamalaa-ikataka wajameeAAa khalqika annaka antal-lAAahu laa ilaaha illaa anta wahdaka laa shareeka lak, wana Muhammadan AAabduka warasooluka",
      translation: "O Allah, I have reached the evening and call upon You and upon the bearers of Your Throne, upon Your angels and all of Your creation, to bear witness that You are Allah, none has the right to be worshipped except You, alone, without partner, and that Muhammad is Your servant and Messenger.",
      reference: "Sunan Abi Dawud 5088",
      count: 4,
    },
  ],
};

export const ALL_ADHKAR_CATEGORIES = [MORNING_ADHKAR, EVENING_ADHKAR];
