"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { ChevronDown, ChevronUp, RotateCcw, CheckCircle2, Circle } from "lucide-react";
import { getTodaysDhikrProgress, incrementDhikr, resetDhikr } from "@/lib/dhikr/actions";

interface AdhkarItem {
  id: string;
  arabic: string;
  transliteration: string;
  translation: string;
  source: string;
  targetCount: number;
}

const MORNING_ADHKAR: AdhkarItem[] = [
  {
    id: "m1",
    arabic: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَـهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
    transliteration: "Asbahna wa asbahal mulku lillah, walhamdu lillah, la ilaha illallahu wahdahu la shareeka lah, lahul mulku wa lahul hamdu wa huwa ala kulli shay'in qadeer",
    translation: "We have reached the morning and at this very time all sovereignty belongs to Allah. Praise be to Allah. None has the right to be worshipped but Allah, alone, without partner. To Him belongs all sovereignty and praise and He is over all things omnipotent.",
    source: "Abu Dawud, Riyad as-Salihin 1493",
    targetCount: 1,
  },
  {
    id: "m2",
    arabic: "اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ",
    transliteration: "Allahumma bika asbahna, wa bika amsayna, wa bika nahya, wa bika namutu wa ilaykin nushoor",
    translation: "O Allah, by You we have reached the morning, and by You we have reached the evening, by You we live, and by You we die, and to You is the resurrection.",
    source: "Tirmidhi 3391",
    targetCount: 1,
  },
  {
    id: "m3",
    arabic: "اللَّهُمَّ أَنْتَ رَبِّي لاَ إِلَـهَ إِلاَّ أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لاَ يَغْفِرُ الذُّنُوبَ إِلاَّ أَنْتَ",
    transliteration: "Allahumma anta rabbi la ilaha illa anta, khalaqtani wa ana abduka, wa ana ala ahdika wa wa'dika mastata'tu, a'udhu bika min sharri ma sana'tu, abu'u laka bi ni'matika alayya, wa abu'u bi dhanbi faghfir li fa innahu la yaghfirudh dhunuba illa anta",
    translation: "O Allah, You are my Lord, none has the right to be worshipped except You. You created me and I am Your servant, and I abide by Your covenant and promise as best I can. I take refuge in You from the evil of what I have done. I acknowledge Your favour upon me and I acknowledge my sin, so forgive me, for verily none can forgive sin except You.",
    source: "Bukhari 6306",
    targetCount: 1,
  },
  {
    id: "m4",
    arabic: "اللَّهُمَّ إِنِّي أَصْبَحْتُ أُشْهِدُكَ وَأُشْهِدُ حَمَلَةَ عَرْشِكَ، وَمَلاَئِكَتَكَ وَجَمِيعَ خَلْقِكَ، أَنَّكَ أَنْتَ اللَّهُ لاَ إِلَـهَ إِلاَّ أَنْتَ وَحْدَكَ لاَ شَرِيكَ لَكَ، وَأَنَّ مُحَمَّدًا عَبْدُكَ وَرَسُولُكَ",
    transliteration: "Allahumma inni asbahtu ushhiduka wa ushhidu hamalata arshika wa mala'ikataka wa jamee'a khalqika annaka antallahu la ilaha illa anta wahdaka la shareeka laka wa anna muhammadan abduka wa rasooluka",
    translation: "O Allah, I have reached the morning and I call upon You, and the bearers of Your Throne, and all of Your angels, and all of creation, to bear witness that You are Allah, none has the right to be worshipped except You, alone, without partner, and that Muhammad is Your servant and Messenger.",
    source: "Abu Dawud 5095",
    targetCount: 4,
  },
  {
    id: "m5",
    arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ",
    transliteration: "Subhanallahi wa bihamdihi",
    translation: "Glory be to Allah and praise be to Him.",
    source: "Bukhari 6403",
    targetCount: 100,
  },
  {
    id: "m6",
    arabic: "لاَ إِلَـهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، لاَ حَوْلَ وَلاَ قُوَّةَ إِلاَّ بِاللَّهِ، لاَ إِلَـهَ إِلاَّ اللَّهُ وَلاَ نَعْبُدُ إِلاَّ إِيَّاهُ، لَهُ النِّعْمَةُ وَلَهُ الْفَضْلُ وَلَهُ الثَّنَاءُ الْحَسَنُ، لاَ إِلَـهَ إِلاَّ اللَّهُ مُخْلِصِينَ لَهُ الدِّينَ وَلَوْ كَرِهَ الْكَافِرُونَ",
    transliteration: "La ilaha illallahu wahdahu la shareeka lah, lahul mulku wa lahul hamdu wa huwa ala kulli shay'in qadeer, la hawla wa la quwwata illa billah, la ilaha illallahu wa la na'budu illa iyyah, lahun ni'matu wa lahul fadlu wa lahuth thana'ul hasan, la ilaha illallahu mukhliseena lahud deena wa law karihal kafiroon",
    translation: "None has the right to be worshipped but Allah, alone, without partner. To Him belongs all sovereignty and praise, and He is over all things omnipotent. There is no power nor might except with Allah. None has the right to be worshipped but Allah, and we worship none but Him. To Him belongs all bounty, to Him belongs all grace, and to Him belongs all praiseworthy commendation. None has the right to be worshipped but Allah, being sincere to Him in religion, even if the disbelievers dislike it.",
    source: "Muslim 386",
    targetCount: 1,
  },
  {
    id: "m7",
    arabic: "اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لاَ إِلَـهَ إِلاَّ أَنْتَ. اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْكُفْرِ، وَالْفَقْرِ، وَأَعُوذُ بِكَ مِنْ عَذَابِ الْقَبْرِ، لاَ إِلَـهَ إِلاَّ أَنْتَ",
    transliteration: "Allahumma afini fi badani, Allahumma afini fi sam'i, Allahumma afini fi basari, la ilaha illa anta. Allahumma inni a'udhu bika min al kufr, wal faqr, wa a'udhu bika min adhabil qabr, la ilaha illa anta",
    translation: "O Allah, grant me health in my body. O Allah, grant me health in my hearing. O Allah, grant me health in my sight. None has the right to be worshipped except You. O Allah, I take refuge in You from disbelief and poverty, and I take refuge in You from the punishment of the grave. None has the right to be worshipped except You.",
    source: "Abu Dawud 5088",
    targetCount: 3,
  },
];

const EVENING_ADHKAR: AdhkarItem[] = [
  {
    id: "e1",
    arabic: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَـهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
    transliteration: "Amsayna wa amsal mulku lillah, walhamdu lillah, la ilaha illallahu wahdahu la shareeka lah, lahul mulku wa lahul hamdu wa huwa ala kulli shay'in qadeer",
    translation: "We have reached the evening and at this very time all sovereignty belongs to Allah. Praise be to Allah. None has the right to be worshipped but Allah, alone, without partner. To Him belongs all sovereignty and praise and He is over all things omnipotent.",
    source: "Abu Dawud, Riyad as-Salihin 1493",
    targetCount: 1,
  },
  {
    id: "e2",
    arabic: "اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ وَإِلَيْكَ الْمَصِيرُ",
    transliteration: "Allahumma bika amsayna, wa bika asbahna, wa bika nahya, wa bika namutu wa ilaykal maseer",
    translation: "O Allah, by You we have reached the evening, and by You we have reached the morning, by You we live, and by You we die, and to You is our final destination.",
    source: "Tirmidhi 3391",
    targetCount: 1,
  },
  {
    id: "e3",
    arabic: "اللَّهُمَّ أَنْتَ رَبِّي لاَ إِلَـهَ إِلاَّ أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لاَ يَغْفِرُ الذُّنُوبَ إِلاَّ أَنْتَ",
    transliteration: "Allahumma anta rabbi la ilaha illa anta, khalaqtani wa ana abduka, wa ana ala ahdika wa wa'dika mastata'tu, a'udhu bika min sharri ma sana'tu, abu'u laka bi ni'matika alayya, wa abu'u bi dhanbi faghfir li fa innahu la yaghfirudh dhunuba illa anta",
    translation: "O Allah, You are my Lord, none has the right to be worshipped except You. You created me and I am Your servant, and I abide by Your covenant and promise as best I can. I take refuge in You from the evil of what I have done. I acknowledge Your favour upon me and I acknowledge my sin, so forgive me, for verily none can forgive sin except You.",
    source: "Bukhari 6306",
    targetCount: 1,
  },
  {
    id: "e4",
    arabic: "اللَّهُمَّ إِنِّي أَمْسَيْتُ أُشْهِدُكَ وَأُشْهِدُ حَمَلَةَ عَرْشِكَ، وَمَلاَئِكَتَكَ وَجَمِيعَ خَلْقِكَ، أَنَّكَ أَنْتَ اللَّهُ لاَ إِلَـهَ إِلاَّ أَنْتَ وَحْدَكَ لاَ شَرِيكَ لَكَ، وَأَنَّ مُحَمَّدًا عَبْدُكَ وَرَسُولُكَ",
    transliteration: "Allahumma inni amsaytu ushhiduka wa ushhidu hamalata arshika wa mala'ikataka wa jamee'a khalqika annaka antallahu la ilaha illa anta wahdaka la shareeka laka wa anna muhammadan abduka wa rasooluka",
    translation: "O Allah, I have reached the evening and I call upon You, and the bearers of Your Throne, and all of Your angels, and all of creation, to bear witness that You are Allah, none has the right to be worshipped except You, alone, without partner, and that Muhammad is Your servant and Messenger.",
    source: "Abu Dawud 5095",
    targetCount: 4,
  },
];

interface AdhkarProgress {
  [key: string]: number;
}

export function AdhkarTracker() {
  const [isEvening] = useState(() => {
    const hour = new Date().getHours();
    return hour >= 17 || hour < 5;
  });
  const [progress, setProgress] = useState<AdhkarProgress>({});
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getTodaysDhikrProgress()
      .then((logs) => {
        if (cancelled) return;
        const map: AdhkarProgress = {};
        for (const log of logs) {
          if (log.dhikrId && log.current > 0) {
            map[log.dhikrId] = log.current;
          }
        }
        setProgress(map);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const adhkars = isEvening ? EVENING_ADHKAR : MORNING_ADHKAR;

  const totalTarget = useMemo(
    () => adhkars.reduce((sum, a) => sum + a.targetCount, 0),
    [adhkars],
  );
  const totalCurrent = useMemo(
    () => adhkars.reduce((sum, a) => sum + (progress[a.id] || 0), 0),
    [adhkars, progress],
  );
  const completionPercent = Math.round((totalCurrent / totalTarget) * 100);

  const incrementAdhkar = useCallback(
    async (id: string) => {
      const adhkar = adhkars.find((a) => a.id === id);
      if (!adhkar) return;

      const current = progress[id] || 0;
      if (current >= adhkar.targetCount) return;

      setProgress((prev) => ({ ...prev, [id]: current + 1 }));
      await incrementDhikr(id, adhkar.targetCount);
    },
    [adhkars, progress],
  );

  const resetAdhkar = useCallback(async () => {
    setProgress({});
    for (const adhkar of adhkars) {
      await resetDhikr(adhkar.id);
    }
  }, [adhkars]);

  return (
    <div
      className="rounded-2xl border border-border bg-card"
      style={{ padding: "var(--space-4)", boxShadow: "var(--shadow-xs)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between" style={{ marginBottom: "var(--space-3)" }}>
        <div>
          <p className="text-foreground" style={{ fontSize: "var(--text-body-sm)", fontWeight: 500 }}>
            {isEvening ? "Evening" : "Morning"} Adhkar
          </p>
          <p className="text-muted-foreground" style={{ fontSize: "var(--text-caption)", marginTop: "2px" }}>
            {totalCurrent}/{totalTarget}
          </p>
        </div>
        <button
          onClick={resetAdhkar}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted transition-colors"
          aria-label="Reset progress"
        >
          <RotateCcw size={14} />
        </button>
      </div>

      {/* Progress bar — simple, monochrome */}
      <div
        className="rounded-full bg-muted overflow-hidden"
        style={{ height: "4px", marginBottom: "var(--space-4)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${completionPercent}%`,
            background: "var(--dd-dusk-teal)",
          }}
        />
      </div>

      {/* Adhkar list */}
      <div className="flex flex-col" style={{ gap: "var(--space-2)" }}>
        {adhkars.map((adhkar) => {
          const current = progress[adhkar.id] || 0;
          const isComplete = current >= adhkar.targetCount;
          const isExpanded = expandedId === adhkar.id;

          return (
            <div
              key={adhkar.id}
              className="rounded-xl border border-border overflow-hidden transition-colors"
              style={{
                background: isComplete
                  ? "color-mix(in srgb, var(--dd-dusk-teal) 5%, var(--card))"
                  : "var(--card)",
              }}
            >
              {/* Main row */}
              <div className="flex items-center gap-3 p-3">
                <button
                  onClick={() => incrementAdhkar(adhkar.id)}
                  disabled={isComplete}
                  aria-label={`Increment ${adhkar.transliteration} (${current}/${adhkar.targetCount})`}
                  className="flex-shrink-0"
                >
                  {isComplete ? (
                    <CheckCircle2 size={20} className="text-dusk-teal" />
                  ) : (
                    <Circle size={20} className="text-muted-foreground" />
                  )}
                </button>

                <button
                  onClick={() => setExpandedId(isExpanded ? null : adhkar.id)}
                  aria-expanded={isExpanded}
                  aria-label={isExpanded ? "Collapse dhikr details" : "Expand dhikr details"}
                  className="flex-1 text-left"
                >
                  <p
                    className="text-foreground truncate"
                    style={{ fontSize: "var(--text-body-sm)", fontWeight: 500, direction: "rtl", fontFamily: "var(--font-arabic)" }}
                  >
                    {adhkar.arabic.slice(0, 60)}...
                  </p>
                  <p className="text-muted-foreground" style={{ fontSize: "var(--text-caption)" }}>
                    {current}/{adhkar.targetCount}
                  </p>
                </button>

                <button
                  onClick={() => setExpandedId(isExpanded ? null : adhkar.id)}
                  aria-label={isExpanded ? "Collapse" : "Expand"}
                  aria-expanded={isExpanded}
                  className="flex-shrink-0 text-muted-foreground"
                >
                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>

              {/* Expanded content */}
              {isExpanded && (
                <div className="px-3 pb-3 pt-0 border-t border-border">
                  <p
                    className="mt-2 text-foreground"
                    style={{
                      fontSize: "clamp(18px, 3vw, 24px)",
                      lineHeight: 1.6,
                      direction: "rtl",
                      fontFamily: "var(--font-arabic)",
                    }}
                  >
                    {adhkar.arabic}
                  </p>
                  <p className="mt-2 text-muted-foreground italic" style={{ fontSize: "var(--text-body-sm)" }}>
                    {adhkar.transliteration}
                  </p>
                  <p className="mt-1 text-foreground" style={{ fontSize: "var(--text-body-sm)" }}>
                    {adhkar.translation}
                  </p>
                  <p className="mt-1 text-muted-foreground" style={{ fontSize: "var(--text-caption)" }}>
                    {adhkar.source}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
