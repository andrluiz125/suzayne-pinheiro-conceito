"use client";

import { useEffect, useState } from "react";

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);
  const goToDiagnostic = () => {
    document.querySelector("#diagnostico")?.scrollIntoView({ behavior: "smooth" });
    closeMenu();
  };

  return (
    <header className={`site-header ${scrolled ? "scrolled" : ""}`}>
      <a className="brand" href="#top" aria-label="Suzayne Pinheiro — início" onClick={closeMenu}>
        <span className="brand-mark">SP</span><span><b>Suzayne Pinheiro</b><small>Planos de saúde</small></span>
      </a>
      <nav className={menuOpen ? "nav open" : "nav"} aria-label="Navegação principal">
        <a href="#entrega" onClick={closeMenu}>O que você recebe</a>
        <a href="#diagnostico" onClick={closeMenu}>Diagnóstico</a>
        <a href="#acompanhamento" onClick={closeMenu}>Pós-venda</a>
        <a href="#sobre" onClick={closeMenu}>Quem sou eu</a>
        <button className="nav-cta" onClick={goToDiagnostic}>Falar comigo <span>↗</span></button>
      </nav>
      <button className="menu-button" aria-label="Abrir menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><span /><span /></button>
    </header>
  );
}
