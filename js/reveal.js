/*
  Revelar-no-hover com trava.
  - Passar o mouse EXPANDE o item e ele PERMANECE aberto.
  - So um CLIQUE sobre a regiao expandida devolve ao estado contraido.
  - Teclado: focar o indicativo expande; Esc contrai.
  - Toque (sem hover): o toque alterna abrir/fechar.

  O estado visual e a classe .is-open (ver css/style.css); aqui so a ligamos
  e desligamos conforme o gesto.
*/
(() => {
  const reveals = document.querySelectorAll(".reveal");
  if (!reveals.length) return;

  const canHover = window.matchMedia("(hover: hover)").matches;

  reveals.forEach((reveal) => {
    // mouse: entrar abre e trava (sair NAO fecha)
    if (canHover) {
      reveal.addEventListener("mouseenter", () => {
        reveal.classList.add("is-open");
      });
    }

    // clique na regiao expandida contrai; em toque, alterna
    reveal.addEventListener("click", () => {
      reveal.classList.toggle("is-open");
    });

    // teclado: foco abre, Esc fecha
    reveal.addEventListener("focusin", () => {
      reveal.classList.add("is-open");
    });
    reveal.addEventListener("keydown", (e) => {
      if (e.key === "Escape") reveal.classList.remove("is-open");
    });
  });
})();
