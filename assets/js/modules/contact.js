export function createContactController({ contactEmail }) {
  const contactName = document.getElementById("contactName");
  const contactEmailInput = document.getElementById("contactEmail");
  const contactSubject = document.getElementById("contactSubject");
  const contactMessage = document.getElementById("contactMessage");

  function sendForm(btn) {
    if (!btn) {
      return;
    }

    const name = contactName ? contactName.value.trim() : "";
    const email = contactEmailInput ? contactEmailInput.value.trim() : "";
    const subjectValue = contactSubject ? contactSubject.value.trim() : "";
    const message = contactMessage ? contactMessage.value.trim() : "";

    if (!name || !email || !message) {
      alert("Preencha nome, e-mail e mensagem antes de enviar.");
      return;
    }

    const subject = subjectValue || "Contato pela landing page";
    const body = `Nome: ${name}\nE-mail: ${email}\n\nMensagem:\n${message}`;
    const mailto = `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.location.href = mailto;

    const originalText = btn.textContent;
    btn.textContent = "Abrindo e-mail...";
    setTimeout(() => {
      btn.textContent = originalText;
    }, 2500);
  }

  return { sendForm };
}
