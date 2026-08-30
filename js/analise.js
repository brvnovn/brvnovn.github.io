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
    startMagnetTravel(nextCursor);
    root.classList.add("is-veiled");

    const swap = () => {
      cursor = nextCursor;
      // zera o fio antes de renderizar: o <li> ativo e recriado a cada
      // render, entao o pseudo novo ja nasce em translateY(0) — sem isso
      // ele apareceria deslocado pela distancia que acabou de percorrer.
      endMagnetTravel();
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

  // Troca de topico via scroll do mouse sobre o componente. "Resistencia":
  // o deltaY acumula ate passar de WHEEL_THRESHOLD antes de disparar uma
  // troca (nao e 1 tick de scroll = 1 topico), e enquanto uma transicao esta
  // em andamento (is-veiled) novos deltas sao ignorados — sem isso um scroll
  // continuo do trackpad dispararia varias trocas em sequencia. Nas bordas
  // (primeiro/ultimo topico) o gesto e liberado (sem preventDefault) para a
  // pagina rolar normalmente, em vez de prender o usuario no componente.
  // Dobrado (era 240): o gesto pede o dobro de scroll para vencer a
  // resistencia e trocar de topico, dando mais curso para a mola esticar.
  const WHEEL_THRESHOLD = 480;
  let wheelAccum = 0;

  // Gesto magnetico: duas variaveis CSS (ver css/style.css) descrevem o
  // estado do fio azul a cada instante.
  //
  //   --magnet-slide / --magnet-stretch  as duas pontas do fio. A da frente
  //                  avanca rumo ao destino, a de tras acompanha so uma
  //                  fracao (TRAIL_FOLLOW) — o fio caminha e estica junto.
  //                  Os dois valores saem do acumulo de scroll passado por
  //                  uma curva de ease-out quadratica (MAGNET_EASE): rapido
  //                  no inicio, cada vez mais lento perto do limiar, como
  //                  uma mola que endurece conforme estica.
  //   --magnet-open  abre a calha lateral onde o fio vai parar, empurrando
  //                  pra direita so o item marcado com .is-magnet-target.
  //                  Sempre positivo: o vao abre pra direita nos dois
  //                  sentidos, e quem muda e o elemento marcado.
  //
  // MAGNET_OPEN casa com o padding-left de .analise__item--ativo (16px): no
  // fim do gesto o proximo paragrafo ja esta na posicao horizontal que vai
  // ocupar como ativo, entao so falta o fio chegar.
  // STRETCH_REACH < 1 e o "quase": a ponta da frente para um pouco antes da
  // extremidade do paragrafo que entra, em vez de encostar nela.
  // TRAIL_FOLLOW < 1 e o que separa as duas pontas: se fosse 1 o fio so
  // deslizaria (sem esticar); se fosse 0 so esticaria (sem sair do lugar).
  const MAGNET_OPEN = 16;
  const MAGNET_IDLE_MS = 150;
  const STRETCH_REACH = 0.92;
  const TRAIL_FOLLOW = 0.35;
  const MAGNET_EASE = (t) => 1 - (1 - t) * (1 - t);
  let magnetResetTimer = null;
  let magnetTargetEl = null;

  function clearMagnetResetTimer() {
    if (magnetResetTimer === null) return;
    window.clearTimeout(magnetResetTimer);
    magnetResetTimer = null;
  }

  // O alvo e o <li> que esta prestes a virar ativo: um item da fila quando o
  // gesto avanca, um traco do historico quando volta. Indexado a partir do
  // cursor, entao vale tanto pro scroll (vizinho imediato) quanto pro clique
  // num item distante da lista.
  function magnetTargetFor(nextCursor) {
    if (nextCursor > cursor) return filaEl.children[nextCursor - cursor - 1] || null;
    if (nextCursor < cursor) return historicoEl.children[nextCursor] || null;
    return null;
  }

  function setMagnetTarget(el) {
    if (magnetTargetEl === el) return;
    if (magnetTargetEl) magnetTargetEl.classList.remove("is-magnet-target");
    magnetTargetEl = el;
    if (magnetTargetEl) magnetTargetEl.classList.add("is-magnet-target");
  }

  // Recolhe a mola com is-dragging ja removida — e isso que faz o CSS trocar
  // pra transicao com bounce (a mola voltando sozinha) quando o scroll para
  // no meio do caminho e o gesto e abandonado.
  function resetMagnet() {
    clearMagnetResetTimer();
    root.classList.remove("is-dragging", "is-magnet-up");
    root.style.setProperty("--magnet-slide", "0px");
    root.style.setProperty("--magnet-stretch", "1");
    root.style.setProperty("--magnet-open", "0px");
    setMagnetTarget(null);
  }

  // Geometria da mola em relacao ao topico de destino, em px:
  //   natural  comprimento do fio em repouso (= altura do <li> ativo);
  //   alcance  ate onde a ponta da frente pode ir — descendo, do topo do
  //            ativo ate a base do alvo; subindo, da base do ativo ate o
  //            topo do alvo — encurtado por STRETCH_REACH para parar antes
  //            de encostar;
  //   arrasto  quanto a ponta de tras pode acompanhar, uma fracao
  //            (TRAIL_FOLLOW) do vao que a separa do alvo.
  function magnetSpringFor(target, forward) {
    const activeLi = topicosEl.querySelector(".analise__item--ativo");
    const natural = activeLi ? activeLi.getBoundingClientRect().height : 0;
    if (!activeLi || !target || natural <= 0) return null;

    const active = activeLi.getBoundingClientRect();
    const alvo = target.getBoundingClientRect();
    const cheio = forward ? alvo.bottom - active.top : active.bottom - alvo.top;
    const vao = forward ? alvo.top - active.top : active.bottom - alvo.bottom;

    return {
      natural,
      alcance: natural + (cheio - natural) * STRETCH_REACH,
      arrasto: Math.max(0, vao) * TRAIL_FOLLOW,
    };
  }

  // Posiciona as duas pontas para um dado avanco do gesto (0 a 1, ja
  // suavizado). O deslize e limitado a "ponta - natural" para a ponta de
  // tras nunca alcancar a da frente: no pior caso a mola fica do tamanho
  // natural deslizando inteira, nunca menor que isso.
  function applyMagnet(target, forward, eased) {
    const mola = magnetSpringFor(target, forward);
    if (!mola) return;

    const ponta = mola.natural + (mola.alcance - mola.natural) * eased;
    const desliza = Math.min(mola.arrasto * eased, Math.max(0, ponta - mola.natural));
    root.style.setProperty("--magnet-slide", desliza.toFixed(2) + "px");
    root.style.setProperty("--magnet-stretch", ((ponta - desliza) / mola.natural).toFixed(4));
    root.style.setProperty("--magnet-open", (eased * MAGNET_OPEN).toFixed(2) + "px");
  }

  function updateMagnet(accum) {
    if (reducedMotion) return;
    const forward = accum > 0;
    const target = magnetTargetFor(cursor + (forward ? 1 : -1));

    root.classList.add("is-dragging");
    root.classList.toggle("is-magnet-up", !forward);
    setMagnetTarget(target);

    applyMagnet(target, forward, MAGNET_EASE(Math.min(1, Math.abs(accum) / WHEEL_THRESHOLD)));

    clearMagnetResetTimer();
    magnetResetTimer = window.setTimeout(resetMagnet, MAGNET_IDLE_MS);
  }

  // Fim do gesto: a mola completa o estiramento ate o alvo enquanto o
  // paragrafo antigo se apaga. Nao volta pra 1 aqui — quem devolve o fio ao
  // tamanho de repouso e a propria troca (endMagnetTravel + renderLists
  // recriam o <li>, e o pseudo novo ja nasce no tamanho do novo paragrafo).
  function startMagnetTravel(nextCursor) {
    if (reducedMotion) return;
    clearMagnetResetTimer();
    root.classList.remove("is-dragging");

    const forward = nextCursor > cursor;
    const target = magnetTargetFor(nextCursor);
    if (!target) return;

    setMagnetTarget(target);
    root.classList.toggle("is-magnet-up", !forward);
    root.classList.add("is-traveling");
    applyMagnet(target, forward, 1);
  }

  function endMagnetTravel() {
    root.classList.remove("is-traveling", "is-magnet-up");
    root.style.setProperty("--magnet-slide", "0px");
    root.style.setProperty("--magnet-stretch", "1");
    root.style.setProperty("--magnet-open", "0px");
    setMagnetTarget(null);
  }

  root.addEventListener("wheel", (event) => {
    const direction = event.deltaY > 0 ? 1 : -1;
    const atStart = cursor === 0 && direction < 0;
    const atEnd = cursor === topics.length - 1 && direction > 0;
    if (atStart || atEnd) {
      wheelAccum = 0;
      resetMagnet();
      return;
    }

    event.preventDefault();
    if (root.classList.contains("is-veiled")) return;

    wheelAccum += event.deltaY;
    updateMagnet(wheelAccum);
    if (Math.abs(wheelAccum) < WHEEL_THRESHOLD) return;

    wheelAccum = 0;
    // sem resetMagnet aqui: transitionTo assume o fio no ponto em que o
    // gesto parou e o leva ate o destino (startMagnetTravel), em vez de
    // devolve-lo a origem antes da viagem.
    transitionTo(cursor + direction);
  }, { passive: false });

  // Clique fora do componente devolve o cursor ao primeiro topico — mesmo
  // padrao do fechamento por clique fora dos cards do Acervo (js/acervo.js).
  document.addEventListener("click", (event) => {
    if (cursor !== 0 && !root.contains(event.target)) transitionTo(0);
  });

  renderLists();
  updateShot();
  root.classList.add("is-ready");
})();
