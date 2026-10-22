
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const intro = document.getElementById("intro");
  const site = document.getElementById("site");
  const terminal = document.querySelector(".terminal");
  const introLogo = document.querySelector(".intro-logo");
  const menuToggle = document.getElementById("menuToggle");
  const nav = document.getElementById("nav");

  // ANIMAÇÃO DE ENTRADA
  if (intro && site) {
    site.style.visibility = "hidden";
    site.style.opacity = "0";
    site.style.transition = "opacity .8s ease";

    document.body.classList.add("locked");

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const logoDelay = reduceMotion ? 0 : 2500;
    const siteDelay = reduceMotion ? 1000 : 5000;

    window.setTimeout(() => {
      if (terminal) {
        terminal.style.opacity = "0";
        terminal.style.transform = "translateY(-10px)";
      }

      if (introLogo) {
        introLogo.classList.add("visible");
      }
    }, logoDelay);

    window.setTimeout(() => {
      intro.classList.add("finished");
      site.style.visibility = "visible";

      requestAnimationFrame(() => {
        site.style.opacity = "1";
      });

      document.body.classList.remove("locked");

      window.setTimeout(() => {
        intro.remove();
      }, 900);
    }, siteDelay);
  }

  // MENU RESPONSIVO
  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");

      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Fechar menu" : "Abrir menu"
      );

      menuToggle.textContent = isOpen ? "✕" : "☰";
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Abrir menu");
        menuToggle.textContent = "☰";
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        nav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Abrir menu");
        menuToggle.textContent = "☰";
      }
    });
  }

  // ANO AUTOMÁTICO NO RODAPÉ
  const currentYear = document.getElementById("currentYear");

  if (currentYear) {
    currentYear.textContent = String(new Date().getFullYear());
  }

  // PREENCHIMENTO DO TRATAMENTO PELOS CARDS
  document.querySelectorAll("[data-service]").forEach((link) => {
    link.addEventListener("click", () => {
      const serviceSelect = document.getElementById("service");

      if (serviceSelect) {
        serviceSelect.value = link.dataset.service;
      }
    });
  });

  // DATA MÍNIMA PARA AGENDAMENTO
  const dateInput = document.getElementById("preferredDate");

  if (dateInput) {
    const today = new Date();
    const localDate = [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, "0"),
      String(today.getDate()).padStart(2, "0")
    ].join("-");

    dateInput.min = localDate;
  }
});
