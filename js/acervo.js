const cards = document.querySelectorAll(".card");
// Espelha a duracao do transition de .card no style.css — mudar as duas juntas.
const TRANSITION_MS = 450;

// Anima a mudanca de tamanho do card (flex-basis + height) do estado atual
// para o estado natural resultante de `applyDomChanges`, travando o valor em
// px antes/depois pra o CSS transition ter algo para interpolar (largura em
// % e altura auto nao animam sozinhas).
function animateResize(card, applyDomChanges, cleanupAfter) {
  const startRect = card.getBoundingClientRect();

  applyDomChanges();

  // A medicao do tamanho final precisa acontecer com a transicao desligada:
  // com ela ligada, o valor computado de flex-basis logo apos a mudanca ainda
  // e o interpolado no instante 0 — ou seja, o tamanho antigo — e o card
  // acabaria sendo animado de 280px para 280px.
  card.style.transition = "none";
  card.style.flexBasis = "";
  card.style.height = "";
  const targetRect = card.getBoundingClientRect();

  // volta ao tamanho inicial, ainda sem transicao, para a animacao ter de onde
  // partir; so depois de o navegador registrar esse estado e que religamos
  card.style.flexBasis = startRect.width + "px";
  card.style.height = startRect.height + "px";
  card.offsetHeight;
  card.style.transition = "";

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

// --- Video do projeto -------------------------------------------------
// <video> nativo com o arquivo hospedado no proprio repositorio. Os players
// tem preload="none": nada e baixado ate o card ser aberto. O autoplay so e
// permitido mudo, dai o atributo muted no HTML — os controles nativos ficam
// disponiveis para quem quiser ligar o som.
function playCardVideo(card) {
  const video = card.querySelector(".card-content__player");
  if (!video) return; // card sem video ainda

  // play() rejeita se o navegador bloquear o autoplay; sem catch isso vira
  // um erro nao tratado no console
  const started = video.play();
  if (started) started.catch(() => {});
}

function pauseCardVideo(card) {
  const video = card.querySelector(".card-content__player");
  if (video) video.pause();
}

// Alinha a borda esquerda do card com a esquerda do trilho do carrossel, que
// comeca exatamente onde o corpo da pagina (.main) comeca.
function alignCardToTrackStart(card) {
  const track = card.closest(".gallery-grid");
  if (!track) return;

  const delta = card.getBoundingClientRect().left - track.getBoundingClientRect().left;
  if (Math.abs(delta) < 1) return;

  track.scrollTo({ left: track.scrollLeft + delta, behavior: "smooth" });
}

// Enquanto algum card estiver expandido o trilho fica sem scroll-snap (ver o
// porque no style.css).
function syncTrackSnap(track) {
  const hasExpanded = !!track.querySelector(".card--expanded");
  track.classList.toggle("gallery-grid--has-expanded", hasExpanded);
}

// Depois de expandir o card pode ficar mais alto que a janela; traz o rodape
// dele de volta para dentro da tela.
function revealCardBottom(card) {
  const overflow = card.getBoundingClientRect().bottom - window.innerHeight;
  if (overflow > 0) window.scrollBy({ top: overflow + 24, behavior: "smooth" });
}

// Faz o elemento que esta saindo virar overlay (fora do fluxo) e sumir com
// fade + blur; o que entra faz o caminho inverso, revelado no frame seguinte
// para o navegador ter dois estados distintos para interpolar.
function crossFade(leaving, entering) {
  const rect = leaving.getBoundingClientRect();
  leaving.style.width = rect.width + "px";
  leaving.style.height = rect.height + "px";
  leaving.classList.add("card-layer--overlay", "card-layer--veiled");

  entering.hidden = false;
  entering.classList.add("card-layer--veiled");

  requestAnimationFrame(() => {
    requestAnimationFrame(() => entering.classList.remove("card-layer--veiled"));
  });
}

function resetLayers(leaving, entering) {
  leaving.hidden = true;
  leaving.style.width = "";
  leaving.style.height = "";
  leaving.classList.remove("card-layer--overlay", "card-layer--veiled");
  entering.classList.remove("card-layer--veiled");
}

function expand(card) {
  cards.forEach((other) => {
    if (other !== card && other.classList.contains("card--expanded")) collapse(other);
  });

  const trigger = card.querySelector(".card-trigger");
  const content = card.querySelector(".card-content");

  animateResize(
    card,
    () => {
      crossFade(trigger, content);
      card.classList.add("card--expanded");
      syncTrackSnap(card.closest(".gallery-grid"));

      playCardVideo(card);
    },
    () => {
      resetLayers(trigger, content);
      // de novo no fim, um frame depois do layout final: durante a animacao o
      // trilho ainda mudava de largura (o card crescendo, um vizinho talvez
      // encolhendo) e a rolagem pode ter sido limitada pelo scrollWidth antigo
      requestAnimationFrame(() => {
        alignCardToTrackStart(card);
        revealCardBottom(card);
      });
    }
  );

  alignCardToTrackStart(card);
}

function collapse(card) {
  const trigger = card.querySelector(".card-trigger");
  const content = card.querySelector(".card-content");

  animateResize(
    card,
    () => {
      card.classList.remove("card--expanded");
      crossFade(content, trigger);
    },
    () => {
      resetLayers(content, trigger);
      // so no fim, para o snap nao puxar a rolagem durante o encolhimento
      syncTrackSnap(card.closest(".gallery-grid"));
      pauseCardVideo(card);
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
