
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const banner = document.getElementById("cookieBanner");
  const acceptButton = document.getElementById("acceptCookies");
  const rejectButton = document.getElementById("rejectCookies");
  const settingsButton = document.getElementById("cookieSettings");

  if (!banner) return;

  const STORAGE_KEY = "clinica_cookie_consent_v1";

  function getConsent() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  }

  function saveConsent(value) {
    try {
      localStorage.setItem(STORAGE_KEY, value);
      banner.hidden = true;
    } catch {
      // Se o armazenamento estiver bloqueado, não quebra o site.
      banner.hidden = false;
    }
  }

  function showBanner() {
    banner.hidden = false;
  }

  function hideBanner() {
    banner.hidden = true;
  }

  const consent = getConsent();

  if (consent === "accepted" || consent === "rejected") {
    hideBanner();
  } else {
    showBanner();
  }

  if (acceptButton) {
    acceptButton.addEventListener("click", () => {
      saveConsent("accepted");
    });
  }

  if (rejectButton) {
    rejectButton.addEventListener("click", () => {
      saveConsent("rejected");
    });
  }

  if (settingsButton) {
    settingsButton.addEventListener("click", () => {
      const currentConsent = getConsent();

      const allowOptionalCookies = window.confirm(
        "Preferências de cookies\n\n" +
        "Os cookies essenciais são necessários para o funcionamento do site. " +
        "Cookies opcionais de análise ou publicidade só devem ser ativados " +
        "com consentimento.\n\n" +
        "Clique em OK para aceitar cookies opcionais ou em Cancelar para rejeitá-los."
      );

      saveConsent(
        allowOptionalCookies ? "accepted" : "rejected"
      );
    });
  }
});
