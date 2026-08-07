"use client";

import { useEffect } from "react";

export default function MotionReveal() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("motion-ready");

    const reveal = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        reveal.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -7% 0px" });

    const revealElements = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    revealElements.forEach((element) => {
      const siblings = element.parentElement
        ? Array.from(element.parentElement.children).filter((child) => child.classList.contains("reveal"))
        : [];
      const siblingIndex = Math.max(0, siblings.indexOf(element));
      element.style.setProperty("--reveal-delay", `${Math.min(siblingIndex * 85, 255)}ms`);
      reveal.observe(element);
    });

    return () => {
      reveal.disconnect();
      root.classList.remove("motion-ready");
    };
  }, []);

  return null;
}
