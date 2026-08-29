/*
  Switch de texto grande (acessibilidade, tarefa 29). A classe "text-large"
  no <html> troca os 5 tokens de css/tokens.css por um degrau maior na
  mesma escala de 4px do site (ver comentario la). A preferencia fica salva
  no localStorage e vale em todas as paginas.

  O <html class="text-large"> em si ja e aplicado por um script inline no
  <head> de cada pagina (antes deste arquivo, e sem defer) — sem isso o
  texto nasceria pequeno e so cresceria depois do JS carregar, um flash
  perceptivel demais para quem depende dessa opcao. Este arquivo so cuida
  do botao: sincroniza o estado visual dele e liga o clique.
*/
(() => {
  const STORAGE_KEY = "text-scale-large";
  const root = document.documentElement;
  const toggle = document.querySelector("[data-text-scale-toggle]");
  if (!toggle) return;

  function apply(isLarge) {
    root.classList.toggle("text-large", isLarge);
    toggle.setAttribute("aria-pressed", String(isLarge));
    toggle.setAttribute(
      "aria-label",
      isLarge ? "Voltar ao tamanho normal do texto" : "Aumentar o tamanho do texto"
    );
  }

  apply(root.classList.contains("text-large"));

  toggle.addEventListener("click", () => {
    const isLarge = !root.classList.contains("text-large");
    localStorage.setItem(STORAGE_KEY, isLarge ? "1" : "0");
    apply(isLarge);
  });
})();
