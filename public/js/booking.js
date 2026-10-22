
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const bookingForm = document.getElementById("bookingForm");

  if (!bookingForm) return;

  // TROQUE PELO WHATSAPP REAL DA CLÍNICA.
  // Formato: 55 + DDD + número, somente dígitos.
  const WHATSAPP_NUMBER = "5592994118878";

  bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!bookingForm.reportValidity()) return;

    const clientName = document
      .getElementById("clientName")
      ?.value.trim();

    const clientPhone = document
      .getElementById("clientPhone")
      ?.value.trim();

    const service = document
      .getElementById("service")
      ?.value;

    const preferredDate = document
      .getElementById("preferredDate")
      ?.value;

    if (!clientName || !clientPhone || !service || !preferredDate) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    // Validação básica para evitar dados evidentemente inválidos.
    const digitsOnlyPhone = clientPhone.replace(/\D/g, "");

    if (digitsOnlyPhone.length < 10 || digitsOnlyPhone.length > 13) {
      alert("Informe um telefone válido com DDD.");
      return;
    }

    if (!/^\d{12,13}$/.test(WHATSAPP_NUMBER)) {
      alert("O WhatsApp da clínica ainda não foi configurado.");
      return;
    }

    const [year, month, day] = preferredDate.split("-");
    const formattedDate = `${day}/${month}/${year}`;

    const message = [
      "Olá! Gostaria de solicitar um agendamento.",
      "",
      `Nome: ${clientName}`,
      `Telefone: ${clientPhone}`,
      `Atendimento: ${service}`,
      `Data desejada: ${formattedDate}`,
      "",
      "Gostaria de confirmar a disponibilidade."
    ].join("\n");

    const whatsappURL =
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    // Abre o WhatsApp. Isso não confirma automaticamente a consulta.
    const whatsappWindow = window.open(
      whatsappURL,
      "_blank",
      "noopener,noreferrer"
    );

    if (!whatsappWindow) {
      window.location.href = whatsappURL;
    }
  });
});
