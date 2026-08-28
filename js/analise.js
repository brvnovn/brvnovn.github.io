/*
  Componente interativo da secao Analise (artigo "Evoluir e errar").

  Estado = um unico indice (`cursor`), pois os topicos vivem em ordem fixa:
  tudo antes do cursor vira historico (colapsado, traco clicavel acima do
  paragrafo em foco), o proprio cursor e o topico ativo (sempre totalmente
  visivel, fora do recorte), e todos os seguintes vao para a fila — o CSS
  (max-height + mask-image, ver .analise__fila) e que decide quantos cabem
  antes do limite da altura da foto, com um degrade apagando o resto.
  Clicar num topico da fila ou numa linha do historico so move o cursor —
  o resto se recalcula sozinho.

  Comeca com cursor = 0: o primeiro topico ja em destaque, sem historico.
*/
(() => {
  const root = document.querySelector("[data-analise]");
  if (!root) return;

  // Espelha PRESS_MS de js/acervo.js: o clique encolhe 3% antes de a troca
  // de estado acontecer, para o feedback aparecer antes da animacao maior.
  const PRESS_MS = 120;

  const topicEls = Array.from(root.querySelectorAll("[data-topico]"));
  const topics = topicEls.map((li, index) => ({
    index,
    text: li.textContent.trim(),
    shot: li.dataset.shot || null,
  }));

  const shots = Array.from(root.querySelectorAll(".analise__shot"));
  const historicoEl = root.querySelector("[data-historico]");
  const topicosEl = root.querySelector("[data-topicos]");
  const filaEl = root.querySelector("[data-fila]");

  let cursor = 0;
  let currentShot = topics.find((topic) => topic.shot)?.shot || null;

  // "historico" e o mesmo traco de 24px, sem texto; so "fila" mostra o texto.
  function makeButton(topic, variant) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "analise__btn analise__btn--" + variant;
    if (variant === "fila") {
      btn.textContent = topic.text;
    } else {
      btn.setAttribute("aria-label", "Reabrir: " + topic.text);
    }
    btn.addEventListener("click", () => selectTopic(topic, btn));
    return btn;
  }

  function renderLists() {
    historicoEl.innerHTML = "";
    topics.slice(0, cursor).forEach((topic) => {
      const li = document.createElement("li");
      li.appendChild(makeButton(topic, "historico"));
      historicoEl.appendChild(li);
    });

    topicosEl.innerHTML = "";
    const active = topics[cursor];
    const activeLi = document.createElement("li");
    activeLi.className = "analise__item analise__item--ativo";
    const p = document.createElement("p");
    p.textContent = active.text;
    activeLi.appendChild(p);
    topicosEl.appendChild(activeLi);

    // Renderiza todos os seguintes — o CSS que recorta e apaga o que passa
    // da altura da foto (.analise__fila).
    filaEl.innerHTML = "";
    topics.slice(cursor + 1).forEach((topic) => {
      const li = document.createElement("li");
      li.className = "analise__item analise__item--fila";
      li.appendChild(makeButton(topic, "fila"));
      filaEl.appendChild(li);
    });
  }

  function updateShot() {
    const active = topics[cursor];
    if (active.shot) currentShot = active.shot;

    shots.forEach((shot) => {
      const id = shot.dataset.shot;
      shot.classList.toggle("is-active", id === currentShot);

      const highlight = shot.querySelector(".analise__highlight");
      if (highlight) {
        highlight.classList.toggle("is-visible", active.shot === id);
      }
    });
  }

  // Espelha a duracao de opacity/filter/transform definida em
  // .analise__historico, .analise__topicos, .analise__fila (css/style.css).
  const TRANSITION_MS = 180;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Cross-fade em duas fases: primeiro o bloco sai (blur+opacidade+deslocamento
  // por 0.18s, ver .analise.is-veiled), so entao o conteudo troca por baixo do
  // veu (ja invisivel, a troca nao pisca) e o bloco novo entra com a mesma
  // transicao invertida. Sem o setTimeout esperando a saida terminar, a troca
  // de conteudo acontecia quase no mesmo frame em que o veu comecava — a
  // animacao mal tinha percorrido o caminho antes de reverter, ficando quase
  // imperceptivel. O duplo rAF antes de remover a classe da o tempo do
  // navegador pintar o quadro velado, senao a transicao de entrada nao dispara
  // (mesmo truque do crossFade() dos cards do index, js/acervo.js).
  function transitionTo(nextCursor) {
    root.classList.add("is-veiled");

    const swap = () => {
      cursor = nextCursor;
      renderLists();
      updateShot();
      requestAnimationFrame(() => {
        requestAnimationFrame(() => root.classList.remove("is-veiled"));
      });
    };

    if (reducedMotion) {
      swap();
    } else {
      window.setTimeout(swap, TRANSITION_MS);
    }
  }

  function selectTopic(topic, btn) {
    btn.classList.add("is-pressed");
    window.setTimeout(() => {
      btn.classList.remove("is-pressed");
      transitionTo(topic.index);
    }, PRESS_MS);
  }

  // Seta cima/baixo navega entre os botoes visiveis do componente.
  root.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    const buttons = Array.from(root.querySelectorAll("button"));
    const current = buttons.indexOf(document.activeElement);
    if (current === -1) return;

    event.preventDefault();
    const next = event.key === "ArrowDown" ? current + 1 : current - 1;
    if (buttons[next]) buttons[next].focus();
  });

  // Magnificacao dos tracos do historico por proximidade do mouse (igual ao
  // dock do macOS): cada traco recebe --proximity (0 a 1) conforme a
  // distancia do seu centro ate o cursor, e o CSS (.analise__historico
  // button) usa essa variavel para alargar e escurecer. historicoEl e o
  // mesmo no, so o innerHTML muda a cada renderLists(), entao os listeners
  // seguem validos sem precisar reanexar.
  const MAGNIFY_RADIUS = 60;

  historicoEl.addEventListener("mousemove", (event) => {
    historicoEl.querySelectorAll("button").forEach((btn) => {
      const rect = btn.getBoundingClientRect();
      const distance = Math.abs(event.clientY - (rect.top + rect.height / 2));
      const proximity = Math.max(0, 1 - distance / MAGNIFY_RADIUS);
      btn.style.setProperty("--proximity", proximity.toFixed(3));
    });
  });

  historicoEl.addEventListener("mouseleave", () => {
    historicoEl.querySelectorAll("button").forEach((btn) => {
      btn.style.removeProperty("--proximity");
    });
  });

  renderLists();
  updateShot();
  root.classList.add("is-ready");
})();
