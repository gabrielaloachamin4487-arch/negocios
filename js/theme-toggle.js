"use strict";

(() => {
  const storageKey = "datos-en-claro-theme";
  const validThemes = new Set(["light", "dark"]);

  function readThemePreference() {
    try {
      const savedTheme = localStorage.getItem(storageKey);
      return validThemes.has(savedTheme) ? savedTheme : "light";
    } catch {
      return "light";
    }
  }

  function setTheme(theme, persist = false) {
    const selectedTheme = validThemes.has(theme) ? theme : "light";
    document.documentElement.setAttribute("data-bs-theme", selectedTheme);

    if (persist) {
      try {
        localStorage.setItem(storageKey, selectedTheme);
      } catch {
        // The theme still works for this page when storage is unavailable.
      }
    }

    document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
      const isDark = selectedTheme === "dark";
      const label = `Activar modo ${isDark ? "claro" : "oscuro"}`;
      const icon = button.querySelector("i");
      if (icon) icon.className = `bi ${isDark ? "bi-sun-fill" : "bi-moon-stars-fill"}`;
      button.setAttribute("aria-label", label);
      button.setAttribute("title", label);
      button.setAttribute("aria-pressed", String(isDark));
      const hiddenLabel = button.querySelector(".visually-hidden");
      if (hiddenLabel) hiddenLabel.textContent = label;
    });

    window.dispatchEvent(new CustomEvent("themechange", { detail: { theme: selectedTheme } }));
  }

  setTheme(readThemePreference());

  function bindThemeButtons() {
    document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
      button.addEventListener("click", () => {
        const nextTheme = document.documentElement.getAttribute("data-bs-theme") === "dark" ? "light" : "dark";
        setTheme(nextTheme, true);
      });
    });
    setTheme(document.documentElement.getAttribute("data-bs-theme"));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bindThemeButtons, { once: true });
  } else {
    bindThemeButtons();
  }
})();