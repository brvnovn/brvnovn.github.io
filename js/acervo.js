const cards = document.querySelectorAll(".card");
const TRANSITION_MS = 350;

// Anima a mudanca de tamanho do card (flex-basis + height) do estado atual
// para o estado natural resultante de `applyDomChanges`, travando o valor em
// px antes/depois pra o CSS transition ter algo para interpolar (largura em
// % e altura auto nao animam sozinhas).
function animateResize(card, applyDomChanges, cleanupAfter) {
  const startRect = card.getBoundingClientRect();
  card.style.flexBasis = startRect.width + "px";
  card.style.height = startRect.height + "px";
  card.offsetHeight; // commit antes de mudar o conteudo

  applyDomChanges();

  card.style.flexBasis = "";
  card.style.height = "";
  const targetRect = card.getBoundingClientRect();

  // restaura o tamanho inicial antes do proximo paint, senao o navegador
  // pintaria direto no tamanho final e nao haveria nada pra transicionar
  card.style.flexBasis = startRect.width + "px";
  card.style.height = startRect.height + "px";

  requestAnimationFrame(() => {
    card.style.flexBasis = targetRect.width + "px";
    card.style.height = targetRect.height + "px";
  });

  window.setTimeout(() => {
    card.style.flexBasis = "";
    card.style.height = "";
    if (cleanupAfter) cleanupAfter();
  }, TRANSITION_MS);
}

function expand(card) {
  cards.forEach((other) => {
    if (other !== card && other.classList.contains("card--expanded")) collapse(other);
  });

  animateResize(card, () => {
    const iframe = card.querySelector(".card-content__media iframe");
    // autoplay do YouTube exige o video mudo ao iniciar (politica dos
    // navegadores); o visitante pode ativar o som pelos controles do player.
    // Cards sem data-src ainda (conteudo por vir) simplesmente nao carregam nada.
    if (iframe.dataset.src) {
      iframe.src = `${iframe.dataset.src}?autoplay=1&mute=1`;
    }
    card.querySelector(".card-trigger").hidden = true;
    card.querySelector(".card-content").hidden = false;
    card.classList.add("card--expanded");
  });

  card.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
}

function collapse(card) {
  animateResize(
    card,
    () => {
      card.classList.remove("card--expanded");
      card.querySelector(".card-trigger").hidden = false;
      card.querySelector(".card-content").hidden = true;
    },
    () => {
      card.querySelector(".card-content__media iframe").src = "about:blank";
    }
  );
}

cards.forEach((card) => {
  card.querySelector(".card-trigger").addEventListener("click", () => expand(card));
  card.querySelector(".card-content__close").addEventListener("click", () => collapse(card));
});

// Setas do carrossel: cada par de botoes (prev/next) aponta pra um
// #id de carrossel via data-carousel-target, e desloca a rolagem por
// "um card + gap" a cada clique.
const carouselGap = parseFloat(
  getComputedStyle(document.documentElement).getPropertyValue("--gallery-gutter")
);

document.querySelectorAll("[data-carousel-target]").forEach((btn) => {
  const track = document.getElementById(btn.dataset.carouselTarget);
  const direction = Number(btn.dataset.direction);

  btn.addEventListener("click", () => {
    const cardWidth = track.querySelector(".card").getBoundingClientRect().width;
    track.scrollBy({ left: direction * (cardWidth + carouselGap), behavior: "smooth" });
  });
});

function updateCarouselNav(track) {
  const buttons = document.querySelectorAll(`[data-carousel-target="${track.id}"]`);
  const maxScroll = track.scrollWidth - track.clientWidth;
  buttons.forEach((btn) => {
    const direction = Number(btn.dataset.direction);
    btn.disabled = direction < 0 ? track.scrollLeft <= 0 : track.scrollLeft >= maxScroll - 1;
  });
}

document.querySelectorAll(".gallery-grid[id]").forEach((track) => {
  updateCarouselNav(track);
  track.addEventListener("scroll", () => updateCarouselNav(track));
  window.addEventListener("resize", () => updateCarouselNav(track));
});

// Avanca sozinho a cada 5s, em loop (do ultimo card volta pro primeiro).
// Pausa enquanto algum card estiver expandido, pra nao arrastar o carrossel
// pra longe de um video que o visitante esteja assistindo.
// Desativado por enquanto a pedido — troque para true pra religar.
const AUTO_ADVANCE_ENABLED = false;
const AUTO_ADVANCE_MS = 5000;

if (AUTO_ADVANCE_ENABLED) {
  document.querySelectorAll(".gallery-grid[id]").forEach((track) => {
    window.setInterval(() => {
      if (document.querySelector(".card--expanded")) return;

      const cardWidth = track.querySelector(".card").getBoundingClientRect().width;
      const maxScroll = track.scrollWidth - track.clientWidth;

      if (track.scrollLeft >= maxScroll - 1) {
        track.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        track.scrollBy({ left: cardWidth + carouselGap, behavior: "smooth" });
      }
    }, AUTO_ADVANCE_MS);
  });
}
