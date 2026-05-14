"use client";
import { useEffect } from "react";

export default function CatalogScript() {
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const button = (event.target as Element).closest(".produto-cor-btn") as HTMLElement | null;
      if (!button) return;
      const card = button.closest(".catalog-product") as HTMLElement | null;
      if (!card) return;
      const color = button.getAttribute("data-color") || "";

      const slides = card.querySelectorAll<HTMLElement>(".produto-slide");
      const hasTaggedPhoto = [...slides].some(
        (s) => (s.getAttribute("data-color") || "") === color
      );

      card.querySelectorAll<HTMLElement>(".produto-cor-btn").forEach((btn) => {
        btn.classList.toggle("is-active", btn === button);
      });

      let shown = 0;
      slides.forEach((slide) => {
        const visible = hasTaggedPhoto
          ? (slide.getAttribute("data-color") || "") === color
          : true;
        slide.style.display = visible ? "flex" : "none";
        if (visible) shown++;
      });

      card.querySelectorAll<HTMLElement>(".produto-dots span").forEach((dot) => {
        const visible = hasTaggedPhoto
          ? (dot.getAttribute("data-color") || "") === color
          : true;
        dot.style.display = visible && shown > 1 ? "block" : "none";
      });

      const carousel = card.querySelector<HTMLElement>(".produto-carousel");
      if (carousel) carousel.scrollTo({ left: 0, behavior: "smooth" });
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
}
