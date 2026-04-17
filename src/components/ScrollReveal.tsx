"use client";

import { useEffect } from "react";

/**
 * IntersectionObserver — adds `is-visible` to any element with
 * class `reveal` or `reveal-stagger` once it enters the viewport.
 * Respects prefers-reduced-motion: force-reveals immediately.
 */
export default function ScrollReveal() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const selector = ".reveal, .reveal-stagger";
    const nodes = document.querySelectorAll<HTMLElement>(selector);

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      nodes.forEach((n) => n.classList.add("is-visible"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.12 }
    );

    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);

  return null;
}
