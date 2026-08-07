"use client";

import { useEffect, useState } from "react";

export default function FloatingContact() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > document.documentElement.scrollHeight * .4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button className={`floating-contact ${visible ? "visible" : ""}`} onClick={() => document.querySelector("#contato")?.scrollIntoView({ behavior: "smooth" })}>
      <span>✦</span> Tirar uma dúvida
    </button>
  );
}
