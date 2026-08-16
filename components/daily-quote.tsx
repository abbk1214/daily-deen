"use client";

import { useState, useEffect } from "react";
import { getToday } from "@/lib/utils";

const FALLBACK_QUOTES = [
  { text: "The best of people are those that bring most benefit to the rest of mankind.", author: "Prophet Muhammad \uFDFA" },
  { text: "The most beloved of deeds to Allah are those that are most consistent, even if they are small.", author: "Prophet Muhammad \uFDFA" },
  { text: "A kind word is charity.", author: "Prophet Muhammad \uFDFA" },
  { text: "Be in this world as though you were a stranger or a traveler.", author: "Prophet Muhammad \uFDFA" },
  { text: "The strong man is not the one who can wrestle, but the one who controls himself when he is angry.", author: "Prophet Muhammad \uFDFA" },
  { text: "He who sleeps on a full stomach while his neighbor is hungry is not a believer.", author: "Prophet Muhammad \uFDFA" },
  { text: "Trust in Allah, but tie your camel.", author: "Prophet Muhammad \uFDFA" },
  { text: "Seek knowledge even if you have to go as far as China.", author: "Prophet Muhammad \uFDFA" },
  { text: "The world is a prison for the believer and a paradise for the disbeliever.", author: "Prophet Muhammad \uFDFA" },
  { text: "Whoever believes in Allah and the Last Day, let him speak good or remain silent.", author: "Prophet Muhammad \uFDFA" },
  { text: "It is better to sit alone than to sit with a bad person. It is better to sit with a good person than to sit alone. It is better to pray than to sit idle.", author: "Prophet Muhammad \uFDFA" },
  { text: "Make things easy and do not make them difficult, and give glad tidings and do not drive people away.", author: "Prophet Muhammad \uFDFA" },
  { text: "The Muslim is the one from whose tongue and hands the Muslims are safe.", author: "Prophet Muhammad \uFDFA" },
  { text: "None of you truly believes until he loves for his brother what he loves for himself.", author: "Prophet Muhammad \uFDFA" },
  { text: "Whoever takes a path in search of knowledge, Allah will make easy for him a path to Paradise.", author: "Prophet Muhammad \uFDFA" },
  { text: "The generous one is close to Allah, close to people, close to Paradise, and far from Hell.", author: "Prophet Muhammad \uFDFA" },
  { text: "Fear Allah wherever you are, follow up a bad deed with a good one, and it will wipe it out, and behave well towards people.", author: "Prophet Muhammad \uFDFA" },
  { text: "Your body has a right over you, your eyes have a right over you.", author: "Prophet Muhammad \uFDFA" },
  { text: "The example of the one who remembers his Lord and the one who does not is like the living and the dead.", author: "Prophet Muhammad \uFDFA" },
  { text: "Do not be people without minds of your own, saying that if others treat you well you will treat them well, and if they do wrong you will do wrong. Instead, accustom yourselves to do good if people do good, and to not do wrong if they do evil.", author: "Prophet Muhammad \uFDFA" },
  { text: "Verily, with every difficulty there is relief.", author: "Quran 94:6" },
  { text: "So remember Me; I will remember you.", author: "Quran 2:152" },
  { text: "And whoever puts their trust in Allah, He is sufficient for them.", author: "Quran 65:3" },
  { text: "And He found you lost and guided you.", author: "Quran 93:7" },
  { text: "Indeed, with hardship comes ease.", author: "Quran 94:6" },
];

function getDayOfYear(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  return Math.floor((now.getTime() - start.getTime()) / 86400000);
}

export function DailyQuote() {
  const [quote, setQuote] = useState(FALLBACK_QUOTES[0]);

  useEffect(() => {
    async function loadQuote() {
      const today = getToday();
      const cached = localStorage.getItem(`quote-${today}`);
      if (cached) {
        setQuote(JSON.parse(cached));
        return;
      }

      const fallback = FALLBACK_QUOTES[getDayOfYear() % FALLBACK_QUOTES.length];
      setQuote(fallback);
      localStorage.setItem(`quote-${today}`, JSON.stringify(fallback));
    }

    loadQuote();
  }, []);

  return (
    <div
      className="rounded-2xl border border-border bg-card"
      style={{ padding: "var(--space-5)" }}
    >
      <div
        style={{
          borderLeft: "2px solid var(--dd-dusk-teal)",
          paddingLeft: "var(--space-5)",
        }}
      >
        <blockquote
          className="text-foreground"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(16px, 2.5vw, 20px)",
            fontWeight: 500,
            fontStyle: "italic",
            lineHeight: 1.55,
            letterSpacing: "-0.01em",
          }}
        >
          &ldquo;{quote.text}&rdquo;
        </blockquote>
        <p
          className="text-muted-foreground"
          style={{
            fontSize: "var(--text-caption)",
            marginTop: "var(--space-3)",
            letterSpacing: "var(--tracking-wide)",
          }}
        >
          — {quote.author}
        </p>
      </div>
    </div>
  );
}
