// Clique no link de e-mail do menu lateral: copia o endereco para a area de
// transferencia em vez de abrir o cliente de e-mail, com feedback animado
// (crossfade fade+blur, igual ao dos cards em acervo.js) trocando o texto
// para "copiado!" na cor de identidade. Ctrl/cmd/shift/alt-clique e clique
// do meio preservam o mailto: nativo (abrir em nova aba, etc).
const emailLink = document.querySelector('a[href^="mailto:"]');

if (emailLink) {
  const email = emailLink.getAttribute("href").replace(/^mailto:/, "");

  const label = document.createElement("span");
  label.className = "aside-email__label";
  label.setAttribute("aria-live", "polite");
  label.textContent = emailLink.textContent;
  emailLink.textContent = "";
  emailLink.appendChild(label);

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  // Espelha a duracao do transition de .aside-email__label no style.css.
  const FADE_MS = reduceMotion ? 0 : 180;
  const HOLD_MS = 2000;

  let resetTimer = null;

  function swapTextTo(text, copied) {
    label.classList.add("aside-email__label--veiled");

    window.setTimeout(() => {
      label.textContent = text;
      emailLink.classList.toggle("is-copied", copied);
      label.classList.remove("aside-email__label--veiled");
    }, FADE_MS);
  }

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(email);
      return true;
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = email;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      let ok = false;
      try {
        ok = document.execCommand("copy");
      } catch {
        ok = false;
      }
      document.body.removeChild(textarea);
      return ok;
    }
  }

  emailLink.addEventListener("click", (event) => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) {
      return;
    }

    event.preventDefault();

    if (resetTimer) {
      window.clearTimeout(resetTimer);
      resetTimer = null;
    }

    copyEmail().then((ok) => {
      if (!ok) return;

      swapTextTo("Copiado.", true);

      resetTimer = window.setTimeout(() => {
        swapTextTo("Email", false);
        resetTimer = null;
      }, HOLD_MS);
    });
  });
}

