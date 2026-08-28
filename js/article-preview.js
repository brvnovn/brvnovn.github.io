/*
  Miniatura de preview ao pairar o mouse nos links da secao Artigos (index).
  Um unico iframe reaproveitado (nao um por artigo) mostra o topo real da
  pagina do artigo sob o mouse, encolhido para o tamanho do card do Acervo
  (ver .article-preview em css/style.css).

  So ativa em dispositivos com hover de verdade (mouse) — mesmo gate de
  js/reveal.js — para nao deixar um preview "preso" em touch, onde nao existe
  hover para tirar o dedo e escondê-lo de novo.
*/
(() => {
  if (!window.matchMedia("(hover: hover)").matches) return;

  const section = document.querySelector(".section-articles");
  const preview = document.querySelector(".article-preview");
  const frame = preview?.querySelector(".article-preview__frame");
  const links = document.querySelectorAll(".featured-link a");
  if (!section || !preview || !frame || !links.length) return;

  let currentHref = null;
  let hoverTimer = null;

  // Espelham .article-preview (height: 280px) e o respiro entre itens da
  // secao Artigos (.featured-link + .featured-link, margin-top: 24px) — o
  // preview fica encostado acima do titulo do artigo, nunca sobre ele.
  const PREVIEW_HEIGHT = 280;
  const GAP = 16;

  // Meio segundo de hover antes do preview surgir — evita disparar a
  // miniatura so por o mouse ter passado de raspao sobre o link. Nao muda a
  // duracao da propria animacao de entrada (0.35s, em .article-preview).
  const HOVER_DELAY = 500;

  // Mesma origem: da para injetar CSS no documento carregado assim que ele
  // termina de abrir. Sem isso o iframe mostraria o menu lateral (sempre
  // centralizado a distancia fixa do .main) em vez do topo do artigo — o
  // .main so fica colado a esquerda porque forcamos margin:0 aqui. width e
  // padding-inline travados porque o iframe (490px de largura, ver
  // .article-preview__frame) e mais estreito que o breakpoint mobile
  // (640px) do site — sem isso o .main entraria no modo responsivo (fluido,
  // com padding lateral) em vez do layout fixo de 584px que a miniatura
  // precisa capturar, e o recorte horizontal ficaria errado.
  frame.addEventListener("load", () => {
    const doc = frame.contentDocument;
    if (!doc) return;
    const style = doc.createElement("style");
    style.textContent = ".aside-menu{display:none} .main{width:584px!important;margin:0!important;padding-top:24px!important;padding-inline:0!important}";
    doc.head.appendChild(style);
  });

  function show(link) {
    const href = link.getAttribute("href");
    const item = link.closest(".featured-link");
    if (!item) return;

    // posicao calculada uma unica vez, no hover — nao acompanha o mousemove,
    // e isso que mantem a miniatura parada mesmo com o mouse se movendo
    // dentro da area do link. Fica acima do item (nao sobre ele).
    preview.style.top = (item.offsetTop - PREVIEW_HEIGHT - GAP) + "px";

    if (currentHref !== href) {
      frame.src = href;
      currentHref = href;
    }
    preview.classList.add("is-visible");
  }

  function hide() {
    clearTimeout(hoverTimer);
    preview.classList.remove("is-visible");
  }

  links.forEach((link) => {
    link.addEventListener("mouseenter", () => {
      clearTimeout(hoverTimer);
      hoverTimer = window.setTimeout(() => show(link), HOVER_DELAY);
    });
    link.addEventListener("focus", () => show(link));
    link.addEventListener("mouseleave", hide);
    link.addEventListener("blur", hide);
  });
})();
