/*
  Componente interativo da secao Analise (artigo "Evoluir e errar").

  Estado = um unico indice (`cursor`), pois os topicos vivem em ordem fixa:
  tudo antes do cursor vira historico (colapsado, traco clicavel acima do
  paragrafo em foco), o proprio cursor e o topico ativo, e o seguinte fica
  na fila (so 2 paragrafos visiveis por vez, ativo + 1). Clicar num topico
  da fila ou numa linha do historico so move o cursor — o resto se
  recalcula sozinho.

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

    topics.slice(cursor + 1, cursor + 2).forEach((topic) => {
      const li = document.createElement("li");
      li.className = "analise__item analise__item--fila";
      li.appendChild(makeButton(topic, "fila"));
      topicosEl.appendChild(li);
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

  // Troca o DOM sob o veu (blur+opacidade) e revela num unico crossfade de
  // 0.35s — igual ao ritmo do crossFade() dos cards do index (js/acervo.js):
  // o duplo rAF da tempo do navegador pintar o quadro velado antes de
  // remover a classe, senao a transicao de entrada nao dispara.
  function transitionTo(nextCursor) {
    root.classList.add("is-veiled");
    requestAnimationFrame(() => {
      cursor = nextCursor;
      renderLists();
      updateShot();
      requestAnimationFrame(() => root.classList.remove("is-veiled"));
    });
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

  renderLists();
  updateShot();
  root.classList.add("is-ready");
})();
