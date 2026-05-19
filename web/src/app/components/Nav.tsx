"use client";

import { useEffect } from "react";

export default function Nav() {
  useEffect(() => {
    const nav = document.getElementById("nav");
    const onScroll = () => {
      if (!nav) return;
      if (window.scrollY > 50) nav.classList.add("scrolled");
      else nav.classList.remove("scrolled");
    };
    window.addEventListener("scroll", onScroll);

    const toggle = document.querySelector(".nav-toggle");
    const handleToggle = () => {
      const links = document.querySelector(".nav-links") as HTMLElement;
      if (!links) return;
      const isOpen = links.style.display === "flex";
      links.style.display = isOpen ? "none" : "flex";
      if (!isOpen) {
        links.style.flexDirection = "column";
        links.style.position = "absolute";
        links.style.top = "100%";
        links.style.left = "0";
        links.style.right = "0";
        links.style.background = "rgba(8, 13, 38, 0.98)";
        links.style.padding = "24px 32px";
        links.style.gap = "20px";
      }
    };
    toggle?.addEventListener("click", handleToggle);

    const closeMenu = () => {
      if (window.innerWidth < 900) {
        const links = document.querySelector(".nav-links") as HTMLElement;
        if (links) links.style.display = "none";
      }
    };
    document.querySelectorAll(".nav-link, .nav-cta").forEach((link) =>
      link.addEventListener("click", closeMenu)
    );

    return () => {
      window.removeEventListener("scroll", onScroll);
      toggle?.removeEventListener("click", handleToggle);
    };
  }, []);

  return (
    <nav className="nav" id="nav">
      <div className="nav-inner">
        <a href="#top" className="nav-logo">SICE</a>
        <div className="nav-links">
          <a href="#what" className="nav-link">About</a>
          <a href="#vision" className="nav-link">Vision</a>
          <a href="#chapters" className="nav-link">Chapters</a>
          <a href="#membership" className="nav-link">Membership</a>
          <a href="#editorial" className="nav-link">Editorial</a>
          <a href="/apply" className="nav-cta">Apply</a>
          <a href="/login" className="nav-login">Login</a>
        </div>
        <button className="nav-toggle" aria-label="Open menu">&#9776;</button>
      </div>
    </nav>
  );
}
