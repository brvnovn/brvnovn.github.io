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

// --- YouTube IFrame Player API ---------------------------------------
// Usamos a API (em vez de <iframe src="..."> estatico) so pra poder pedir
// qualidade 1080p via setPlaybackQuality(). Aviso: o YouTube descontinuou
// o respeito a esse pedido ha alguns anos — o player escolhe a resolucao
// sozinho (tamanho do player + banda do visitante) e pode ignorar; isso e
// so um "melhor esforco", nao uma garantia.
const players = new Map(); // card -> YT.Player
let youtubeApiReady = false;
const pendingPlayerInits = [];

window.onYouTubeIframeAPIReady = () => {
  youtubeApiReady = true;
  pendingPlayerInits.splice(0).forEach((init) => init());
};

const ytApiScript = document.createElement("script");
ytApiScript.src = "https://www.youtube.com/iframe_api";
document.head.appendChild(ytApiScript);

function forceHighQuality(player) {
  player.setPlaybackQuality("hd1080");
}

function ensurePlayer(card, onReady) {
  if (players.has(card)) {
    onReady(players.get(card));
    return;
  }

  const target = card.querySelector(".card-content__player");
  const videoId = target?.dataset.videoId;
  if (!videoId) return; // card sem video ainda

  const init = () => {
    const player = new YT.Player(target, {
      videoId,
      width: "1280",
      height: "720",
      playerVars: { autoplay: 1, mute: 1, playsinline: 1 },
      events: {
        onReady: (e) => {
          forceHighQuality(e.target);
          onReady(e.target);
        },
        onPlaybackQualityChange: (e) => forceHighQuality(e.target),
      },
    });
    players.set(card, player);
  };

  if (youtubeApiReady) init();
  else pendingPlayerInits.push(init);
}

function expand(card) {
  cards.forEach((other) => {
    if (other !== card && other.classList.contains("card--expanded")) collapse(other);
  });

  animateResize(card, () => {
    card.querySelector(".card-trigger").hidden = true;
    card.querySelector(".card-content").hidden = false;
    card.classList.add("card--expanded");

    ensurePlayer(card, (player) => {
      player.playVideo();
      forceHighQuality(player);
    });
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
      const player = players.get(card);
      if (player && typeof player.pauseVideo === "function") player.pauseVideo();
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
