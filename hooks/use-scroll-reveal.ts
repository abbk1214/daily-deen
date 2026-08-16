"use client"

import { useEffect, useRef } from "react"

/**
 * Adds .dd-revealed class to elements with .dd-reveal when they enter the viewport.
 * Respects prefers-reduced-motion by immediately revealing all.
 */
export function useScrollReveal() {
  const containerRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const elements = container.querySelectorAll<HTMLElement>(".dd-reveal")

    if (prefersReduced) {
      elements.forEach((el) => el.classList.add("dd-revealed"))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("dd-revealed")
            observer.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -24px 0px" },
    )

    elements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return containerRef
}
