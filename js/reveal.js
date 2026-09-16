/*
  Dois modos de reveal:
  - Padrao (curriculo): hover abre e trava; clique alterna; foco abre; Esc fecha.
  - .reveal--text (bio "Saiba mais"): so clique alterna; Esc fecha.
*/
(() => {
  const reveals = document.querySelectorAll(".reveal");
  if (!reveals.length) return;

  const canHover = window.matchMedia("(hover: hover)").matches;

  reveals.forEach((reveal) => {
    const clickOnly = reveal.classList.contains("reveal--text");

    if (!clickOnly && canHover) {
      reveal.addEventListener("mouseenter", () => {
        reveal.classList.add("is-open");
      });
    }

    reveal.addEventListener("click", () => {
      reveal.classList.toggle("is-open");
    });

    if (!clickOnly) {
      reveal.addEventListener("focusin", () => {
        reveal.classList.add("is-open");
      });
    }

    reveal.addEventListener("keydown", (e) => {
      if (e.key === "Escape") reveal.classList.remove("is-open");
    });
  });
})();
