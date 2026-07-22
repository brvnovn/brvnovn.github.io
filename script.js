/* ============================================================
   Bruno Vieira — Portfólio
   Carrossel horizontal (scroll do mouse + seta) e overlay.
   ============================================================ */

// --- Dados dos projetos (importados do portfólio antigo → /assets). ---
// `images`: 1+ imagens por projeto. Card mostra a primeira; overlay permite
// navegar entre todas (setas internas), uma após a outra.
const PROJECTS = [
  { id: 1, label: "Cartão NFC | Yellot", title: "Cartão NFC | Yellot", images: ["assets/01-cartao-nfc-yellot.webp"] },
  { id: 2, label: "Social Media | Vicência", title: "Social Media | Vicência", images: ["assets/02a-social-media-vicencia.webp", "assets/02b-social-media-vicencia.webp"] },
  { id: 3, label: "Identidade e Diagramação | Dom Casmurro", title: "Identidade e Diagramação | Dom Casmurro", images: ["assets/03-identidade-e-diagramacao-dom-casmurro.webp"] },
  { id: 4, label: "Identidade | Flor do Caribe Cancún", title: "Identidade | Flor do Caribe Cancún", images: ["assets/04-identidade-flor-do-caribe-cancun.webp"] },
  { id: 5, label: "Lenço | Nelore Tozzatti", title: "Lenço | Nelore Tozzatti", images: ["assets/05-lenco-nelore-tozzatti.webp"] },
  { id: 6, label: "Camiseta Ativação | Portal do Oeste", title: "Camiseta Ativação | Portal do Oeste", images: ["assets/06-camiseta-ativacao-portal-do-oeste.webp"] },
  { id: 7, label: "Uniforme 23 | Yellot", title: "Uniforme 23 | Yellot", images: ["assets/07-uniforme-23-yellot.webp"] },
  { id: 8, label: "Cartão NFC | YellotMob", title: "Cartão NFC | YellotMob", images: ["assets/08-cartao-nfc-yellotmob.webp"] },
  { id: 9, label: "Certificado Formatura | Verbo Dance", title: "Certificado Formatura | Verbo Dance", images: ["assets/09-certificado-formatura-verbo-dance.webp"] },
  { id: 10, label: "Portifólio Digital | Flor do Caribe Cancún", title: "Portifólio Digital | Flor do Caribe Cancún", images: ["assets/10-portifolio-digital-flor-do-caribe-cancun.png"] },
  { id: 11, label: "Plotagem | Yellot", title: "Plotagem | Yellot", images: ["assets/11-plotagem-yellot.png"] },
  { id: 12, label: "Calendário | Gerais Agro", title: "Calendário | Gerais Agro", images: ["assets/12-calendario-gerais-agro.webp"] },
  { id: 13, label: "Cartão de Visitas | Portal do Oeste", title: "Cartão de Visitas | Portal do Oeste", images: ["assets/13-cartao-de-visitas-portal-do-oeste.webp"] },
  { id: 14, label: "Crachá | Yellot", title: "Crachá | Yellot", images: ["assets/14-cracha-yellot.webp"] },
  { id: 15, label: "Impresso Premiação | Aprosoja", title: "Impresso Premiação | Aprosoja", images: ["assets/15-impresso-premiacao-aprosoja.webp"] },
  { id: 16, label: "Agenda | Gerais Agro", title: "Agenda | Gerais Agro", images: ["assets/16-agenda-gerais-agro.webp"] },
  { id: 17, label: "Adesivos | Nelore Tozzatti", title: "Adesivos | Nelore Tozzatti", images: ["assets/17-adesivos-nelore-tozzatti.webp"] },
  { id: 18, label: "Calendário e Placa | Verbo Dance", title: "Calendário e Placa | Verbo Dance", images: ["assets/18-calendario-e-placa-verbo-dance.webp"] },
  { id: 19, label: "Backdrop | Portal do Oeste", title: "Backdrop | Portal do Oeste", images: ["assets/19-backdrop-portal-do-oeste.webp"] },
  { id: 20, label: "Placa | On Solo", title: "Placa | On Solo", images: ["assets/20-placa-on-solo.webp"] },
  { id: 21, label: "Testeira | Nelore Tozzatti", title: "Testeira | Nelore Tozzatti", images: ["assets/21-testeira-nelore-tozzatti.webp"] },
  { id: 22, label: "Camiseta Festeiros 2025", title: "Camiseta Festeiros 2025", images: ["assets/22-camiseta-festeiros-2025.webp"] },
  { id: 23, label: "Papelaria 02 | Produtécnica", title: "Papelaria 02 | Produtécnica", images: ["assets/23-papelaria-02-produtecnica.webp"] },
  { id: 24, label: "Código de Ética | Agrofarm", title: "Código de Ética | Agrofarm", images: ["assets/24-codigo-de-etica-agrofarm.webp"] },
  { id: 25, label: "Ativação | Aprosoja", title: "Ativação | Aprosoja", images: ["assets/25-ativacao-aprosoja.webp"] },
  { id: 26, label: "Backdrop | Dipagro", title: "Backdrop | Dipagro", images: ["assets/26-backdrop-dipagro.webp"] },
  { id: 27, label: "Certificado | Portal do Oeste", title: "Certificado | Portal do Oeste", images: ["assets/27-certificado-portal-do-oeste.webp"] },
  { id: 28, label: "Crachá Espetáculo | Verbo Dance", title: "Crachá Espetáculo | Verbo Dance", images: ["assets/28-cracha-espetaculo-verbo-dance.webp"] },
  { id: 29, label: "Placa I Aprosoja", title: "Placa I Aprosoja", images: ["assets/29-placa-i-aprosoja.webp"] },
  { id: 30, label: "Cartão de Visitas | Produtecnica", title: "Cartão de Visitas | Produtecnica", images: ["assets/30-cartao-de-visitas-produtecnica.webp"] },
  { id: 31, label: "Uniforme | On Solo", title: "Uniforme | On Solo", images: ["assets/31-uniforme-on-solo.webp"] },
  { id: 32, label: "Cartão Boas Festas | Agrofarm", title: "Cartão Boas Festas | Agrofarm", images: ["assets/32-cartao-boas-festas-agrofarm.webp"] },
  { id: 33, label: "Social Media | Yellot", title: "Social Media | Yellot", type: "mosaic", images: [
      "assets/mosaic-sm-yellot/01.webp",
      "assets/mosaic-sm-yellot/02.webp",
      "assets/mosaic-sm-yellot/03.webp",
      "assets/mosaic-sm-yellot/04.webp",
      "assets/mosaic-sm-yellot/05.webp",
      "assets/mosaic-sm-yellot/06.webp",
      "assets/mosaic-sm-yellot/07.webp",
      "assets/mosaic-sm-yellot/08.webp",
      "assets/mosaic-sm-yellot/09.webp",
      "assets/mosaic-sm-yellot/10.webp",
      "assets/mosaic-sm-yellot/11.webp",
      "assets/mosaic-sm-yellot/12.webp",
      "assets/mosaic-sm-yellot/13.webp",
      "assets/mosaic-sm-yellot/14.webp",
      "assets/mosaic-sm-yellot/15.webp",
      "assets/mosaic-sm-yellot/16.webp",
      "assets/mosaic-sm-yellot/17.webp",
      "assets/mosaic-sm-yellot/18.webp",
      "assets/mosaic-sm-yellot/19.webp",
      "assets/mosaic-sm-yellot/20.webp",
      "assets/mosaic-sm-yellot/21.webp",
      "assets/mosaic-sm-yellot/22.webp",
      "assets/mosaic-sm-yellot/23.webp",
      "assets/mosaic-sm-yellot/24.webp",
      "assets/mosaic-sm-yellot/25.webp",
      "assets/mosaic-sm-yellot/26.webp",
      "assets/mosaic-sm-yellot/27.webp",
      "assets/mosaic-sm-yellot/28.webp",
    ] },
  { id: 34, label: "Cartão Natal | Aprosoja", title: "Cartão Natal | Aprosoja", images: ["assets/34-cartao-natal-aprosoja.webp"] },
  { id: 35, label: "Apresentação | YellotMob", title: "Apresentação | YellotMob", images: ["assets/35-apresentacao-yellotmob.webp"] },
  { id: 36, label: "Decoração Escritório | Yellot", title: "Decoração Escritório | Yellot", images: ["assets/36-decoracao-escritorio-yellot.webp"] },
  { id: 37, label: "ID Postos | YellotMob", title: "ID Postos | YellotMob", images: ["assets/37-id-postos-yellotmob.webp"] },
  { id: 38, label: "Uniforme Espetáculo | Verbo Dance", title: "Uniforme Espetáculo | Verbo Dance", images: ["assets/38-uniforme-espetaculo-verbo-dance.webp"] },
  {
    id: 39,
    label: "Social Media | YellotMob",
    title: "Social Media | YellotMob",
    type: "mosaic", // formato novo: abre em mosaico (grade 4 colunas), não no overlay padrão
    images: [
      "assets/mosaic-sm-yellotmob/01-09.webp",
      "assets/mosaic-sm-yellotmob/02-10-1.webp",
      "assets/mosaic-sm-yellotmob/03-10-2.webp",
      "assets/mosaic-sm-yellotmob/04-10-3.webp",
      "assets/mosaic-sm-yellotmob/05-10-4.webp",
      "assets/mosaic-sm-yellotmob/06-arte-1.webp",
      "assets/mosaic-sm-yellotmob/07-arte-2.webp",
      "assets/mosaic-sm-yellotmob/08-post-1.webp",
      "assets/mosaic-sm-yellotmob/09-post-2-v2.webp",
      "assets/mosaic-sm-yellotmob/10-post-4.webp",
      "assets/mosaic-sm-yellotmob/11-post-5.webp",
      "assets/mosaic-sm-yellotmob/12-post-6-v2.webp",
      "assets/mosaic-sm-yellotmob/13-post-6.webp",
      "assets/mosaic-sm-yellotmob/14-post-8.webp",
    ],
  },
  {
    id: 40,
    label: "Social Media | Agrofarm",
    title: "Social Media | Agrofarm",
    type: "mosaic",
    images: [
      "assets/mosaic-sm-agrofarm/01.webp",
      "assets/mosaic-sm-agrofarm/02.webp",
      "assets/mosaic-sm-agrofarm/03.webp",
      "assets/mosaic-sm-agrofarm/04.webp",
      "assets/mosaic-sm-agrofarm/05.webp",
      "assets/mosaic-sm-agrofarm/06.webp",
      "assets/mosaic-sm-agrofarm/07.webp",
      "assets/mosaic-sm-agrofarm/08.webp",
    ],
  },
  {
    id: 41,
    label: "Social Media | Aprosoja",
    title: "Social Media | Aprosoja",
    type: "mosaic",
    images: [
      "assets/mosaic-sm-aprosoja/01.webp",
      "assets/mosaic-sm-aprosoja/02.webp",
      "assets/mosaic-sm-aprosoja/03.webp",
      "assets/mosaic-sm-aprosoja/04.webp",
      "assets/mosaic-sm-aprosoja/05.webp",
      "assets/mosaic-sm-aprosoja/06.webp",
      "assets/mosaic-sm-aprosoja/07.webp",
      "assets/mosaic-sm-aprosoja/08.webp",
      "assets/mosaic-sm-aprosoja/09.webp",
      "assets/mosaic-sm-aprosoja/10.webp",
      "assets/mosaic-sm-aprosoja/11.webp",
      "assets/mosaic-sm-aprosoja/12.webp",
      "assets/mosaic-sm-aprosoja/13.webp",
      "assets/mosaic-sm-aprosoja/14.webp",
      "assets/mosaic-sm-aprosoja/15.webp",
      "assets/mosaic-sm-aprosoja/16.webp",
      "assets/mosaic-sm-aprosoja/17.webp",
      "assets/mosaic-sm-aprosoja/18.webp",
      "assets/mosaic-sm-aprosoja/19.webp",
      "assets/mosaic-sm-aprosoja/20.webp",
      "assets/mosaic-sm-aprosoja/21.webp",
      "assets/mosaic-sm-aprosoja/22.webp",
      "assets/mosaic-sm-aprosoja/23.webp",
      "assets/mosaic-sm-aprosoja/24.webp",
      "assets/mosaic-sm-aprosoja/25.webp",
    ],
  },
  {
    id: 42,
    label: "Social Media | Gerais Agro",
    title: "Social Media | Gerais Agro",
    type: "mosaic",
    images: [
      "assets/mosaic-sm-geraisagro/01.webp",
      "assets/mosaic-sm-geraisagro/02.webp",
      "assets/mosaic-sm-geraisagro/03.webp",
      "assets/mosaic-sm-geraisagro/04.webp",
      "assets/mosaic-sm-geraisagro/05.webp",
      "assets/mosaic-sm-geraisagro/06.webp",
      "assets/mosaic-sm-geraisagro/07.webp",
      "assets/mosaic-sm-geraisagro/08.webp",
      "assets/mosaic-sm-geraisagro/09.webp",
    ],
  },
  {
    id: 43,
    label: "Social Media | Portal do Oeste",
    title: "Social Media | Portal do Oeste",
    type: "mosaic",
    images: [
      "assets/mosaic-sm-portaldooeste/01.webp",
      "assets/mosaic-sm-portaldooeste/02.webp",
      "assets/mosaic-sm-portaldooeste/03.webp",
      "assets/mosaic-sm-portaldooeste/04.webp",
      "assets/mosaic-sm-portaldooeste/05.webp",
      "assets/mosaic-sm-portaldooeste/06.webp",
      "assets/mosaic-sm-portaldooeste/07.webp",
      "assets/mosaic-sm-portaldooeste/08.webp",
      "assets/mosaic-sm-portaldooeste/09.webp",
      "assets/mosaic-sm-portaldooeste/10.webp",
      "assets/mosaic-sm-portaldooeste/11.webp",
      "assets/mosaic-sm-portaldooeste/12.webp",
    ],
  },
  {
    id: 44,
    label: "Social Media | Santa Izabel",
    title: "Social Media | Santa Izabel",
    type: "mosaic",
    active: false, // desativado: não aparece no carrossel (dados/imagens preservados)
    images: [
      "assets/mosaic-sm-santaizabel/01.webp",
      "assets/mosaic-sm-santaizabel/02.webp",
      "assets/mosaic-sm-santaizabel/03.webp",
      "assets/mosaic-sm-santaizabel/04.webp",
      "assets/mosaic-sm-santaizabel/05.webp",
      "assets/mosaic-sm-santaizabel/06.webp",
      "assets/mosaic-sm-santaizabel/07.webp",
      "assets/mosaic-sm-santaizabel/08.webp",
      "assets/mosaic-sm-santaizabel/09.webp",
      "assets/mosaic-sm-santaizabel/10.webp",
      "assets/mosaic-sm-santaizabel/11.webp",
      "assets/mosaic-sm-santaizabel/12.webp",
      "assets/mosaic-sm-santaizabel/13.webp",
      "assets/mosaic-sm-santaizabel/14.webp",
      "assets/mosaic-sm-santaizabel/15.webp",
      "assets/mosaic-sm-santaizabel/16.webp",
      "assets/mosaic-sm-santaizabel/17.webp",
      "assets/mosaic-sm-santaizabel/18.webp",
      "assets/mosaic-sm-santaizabel/19.webp",
      "assets/mosaic-sm-santaizabel/20.webp",
      "assets/mosaic-sm-santaizabel/21.webp",
      "assets/mosaic-sm-santaizabel/22.webp",
      "assets/mosaic-sm-santaizabel/23.webp",
      "assets/mosaic-sm-santaizabel/24.webp",
      "assets/mosaic-sm-santaizabel/25.webp",
      "assets/mosaic-sm-santaizabel/26.webp",
      "assets/mosaic-sm-santaizabel/27.webp",
      "assets/mosaic-sm-santaizabel/28.webp",
      "assets/mosaic-sm-santaizabel/29.webp",
      "assets/mosaic-sm-santaizabel/30.webp",
      "assets/mosaic-sm-santaizabel/31.webp",
      "assets/mosaic-sm-santaizabel/32.webp",
      "assets/mosaic-sm-santaizabel/33.webp",
      "assets/mosaic-sm-santaizabel/34.webp",
      "assets/mosaic-sm-santaizabel/35.webp",
      "assets/mosaic-sm-santaizabel/36.webp",
      "assets/mosaic-sm-santaizabel/37.webp",
      "assets/mosaic-sm-santaizabel/38.webp",
    ],
  },
  {
    id: 45,
    label: "Social Media | Verbo Dance",
    title: "Social Media | Verbo Dance",
    type: "mosaic",
    images: [
      "assets/mosaic-sm-verbodance/01.webp",
      "assets/mosaic-sm-verbodance/02.webp",
      "assets/mosaic-sm-verbodance/03.webp",
      "assets/mosaic-sm-verbodance/04.webp",
      "assets/mosaic-sm-verbodance/05.webp",
      "assets/mosaic-sm-verbodance/06.webp",
      "assets/mosaic-sm-verbodance/07.webp",
      "assets/mosaic-sm-verbodance/08.webp",
      "assets/mosaic-sm-verbodance/09.webp",
      "assets/mosaic-sm-verbodance/10.webp",
      "assets/mosaic-sm-verbodance/11.webp",
      "assets/mosaic-sm-verbodance/12.webp",
      "assets/mosaic-sm-verbodance/13.webp",
      "assets/mosaic-sm-verbodance/14.webp",
      "assets/mosaic-sm-verbodance/15.webp",
      "assets/mosaic-sm-verbodance/16.webp",
      "assets/mosaic-sm-verbodance/17.webp",
      "assets/mosaic-sm-verbodance/18.webp",
      "assets/mosaic-sm-verbodance/19.webp",
      "assets/mosaic-sm-verbodance/20.webp",
      "assets/mosaic-sm-verbodance/21.webp",
      "assets/mosaic-sm-verbodance/22.webp",
      "assets/mosaic-sm-verbodance/23.webp",
      "assets/mosaic-sm-verbodance/24.webp",
      "assets/mosaic-sm-verbodance/25.webp",
      "assets/mosaic-sm-verbodance/26.webp",
      "assets/mosaic-sm-verbodance/27.webp",
      "assets/mosaic-sm-verbodance/28.webp",
      "assets/mosaic-sm-verbodance/29.webp",
      "assets/mosaic-sm-verbodance/30.webp",
      "assets/mosaic-sm-verbodance/31.webp",
      "assets/mosaic-sm-verbodance/32.webp",
      "assets/mosaic-sm-verbodance/33.webp",
      "assets/mosaic-sm-verbodance/34.webp",
      "assets/mosaic-sm-verbodance/35.webp",
      "assets/mosaic-sm-verbodance/36.webp",
      "assets/mosaic-sm-verbodance/37.webp",
      "assets/mosaic-sm-verbodance/38.webp",
      "assets/mosaic-sm-verbodance/39.webp",
      "assets/mosaic-sm-verbodance/40.webp",
      "assets/mosaic-sm-verbodance/41.webp",
    ],
  },
];

// Layout em grade (body.layout-grid): sem carrossel, a página rola na vertical.
const GRID_LAYOUT = document.body.classList.contains("layout-grid");

const track = document.getElementById("track");
const viewport = document.querySelector(".carousel__viewport");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");

const overlay = document.getElementById("overlay");
const overlayMedia = document.getElementById("overlayMedia");
const overlayCaption = document.getElementById("overlayCaption");
const overlayCount = document.getElementById("overlayCount");
const overlayClose = document.getElementById("overlayClose");
const overlayPrev = document.getElementById("overlayPrev");
const overlayNext = document.getElementById("overlayNext");

const overlayMosaic = document.getElementById("overlayMosaic");
const mosaicGrid = document.getElementById("mosaicGrid");
const mosaicClose = document.getElementById("mosaicClose");
const mosaicZoom = document.getElementById("mosaicZoom");
const mosaicZoomMedia = document.getElementById("mosaicZoomMedia");
const mosaicZoomCount = document.getElementById("mosaicZoomCount");
const mosaicZoomPrev = document.getElementById("mosaicZoomPrev");
const mosaicZoomNext = document.getElementById("mosaicZoomNext");
const mosaicZoomClose = document.getElementById("mosaicZoomClose");

/* ---------- Ordem dos cards ----------
   Espalha os cards de social media (type: "mosaic") uniformemente entre
   os projetos normais, em vez de deixá-los agrupados. Mantém a ordem
   relativa de cada grupo; só reordena na renderização (dados intactos). */
function orderedProjects() {
  const active = PROJECTS.filter((p) => p.active !== false);
  const regular = active.filter((p) => p.type !== "mosaic");
  const mosaics = active.filter((p) => p.type === "mosaic");
  if (!mosaics.length) return active.slice();

  const R = regular.length;
  const M = mosaics.length;
  // cada mosaico entra centralizado no seu "balde" de projetos normais,
  // então nenhum fica logo no começo nem no fim da lista.
  const insertAfter = mosaics.map((_, k) => Math.round(((k + 0.5) * R) / M));

  const out = [];
  let mi = 0;
  for (let i = 0; i <= R; i++) {
    while (mi < M && insertAfter[mi] === i) out.push(mosaics[mi++]);
    if (i < R) out.push(regular[i]);
  }
  while (mi < M) out.push(mosaics[mi++]);
  return out;
}

/* ---------- Render dos cards ---------- */
function mediaMarkup(p) {
  // capa de mosaico: preview parcial da grade (primeiras peças, cortado)
  if (p.type === "mosaic") {
    const preview = p.images
      .slice(0, 9)
      .map((src) => `<img src="${src}" alt="" loading="lazy" />`)
      .join("");
    return `<span class="card__mosaic-preview" aria-hidden="true">${preview}</span>`;
  }
  const first = p.images && p.images[0];
  if (first) {
    return `<img src="${first}" alt="${p.title}" loading="lazy" />`;
  }
  return ""; // placeholder cinza (via CSS)
}

orderedProjects().forEach((p) => {
  const li = document.createElement("li");
  li.className = "card";
  li.innerHTML = `
    <span class="card__label">${p.label}</span>
    <button class="card__media" type="button"
            aria-label="Ampliar ${p.title}"
            data-id="${p.id}">
      ${mediaMarkup(p)}
    </button>
  `;
  track.appendChild(li);
});

/* ---------- Estado do carrossel ---------- */
let index = 0;

function stepSize() {
  const first = track.querySelector(".card");
  if (!first) return 0;
  const gap = parseFloat(getComputedStyle(track).gap) || 0;
  return first.getBoundingClientRect().width + gap;
}

function maxIndex() {
  const totalWidth = track.scrollWidth;
  const visible = viewport.clientWidth;
  const step = stepSize() || 1;
  const hidden = Math.max(0, totalWidth - visible);
  return Math.ceil(hidden / step);
}

function update() {
  if (GRID_LAYOUT) return; // grade: nada a deslocar
  const step = stepSize();
  const max = maxIndex();
  index = Math.max(0, Math.min(index, max));

  // não ultrapassar o fim: alinhar a borda direita do último card
  const totalWidth = track.scrollWidth;
  const visible = viewport.clientWidth;
  let offset = index * step;
  offset = Math.min(offset, Math.max(0, totalWidth - visible));

  track.style.transform = `translate3d(${-offset}px, 0, 0)`;
}

function go(delta) {
  index += delta;
  update();
}

/* ---------- Setas ---------- */
nextBtn.addEventListener("click", () => {
  index = index >= maxIndex() ? 0 : index + 1; // volta ao início ao chegar no fim
  update();
});
prevBtn.addEventListener("click", () => {
  index = index <= 0 ? maxIndex() : index - 1; // volta ao fim ao chegar no início
  update();
});

/* ---------- Scroll do mouse desloca à esquerda ---------- */
let wheelLock = false;
viewport.addEventListener(
  "wheel",
  (e) => {
    if (GRID_LAYOUT) return; // grade: deixa a página rolar normalmente
    if (overlay.hasAttribute("hidden") === false) return; // overlay aberto: ignora
    if (overlayMosaic.hasAttribute("hidden") === false) return; // mosaico aberto: ignora
    // usa o eixo dominante do gesto
    const amount = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (amount === 0) return;
    e.preventDefault();
    if (wheelLock) return;
    wheelLock = true;
    go(amount > 0 ? 1 : -1);
    setTimeout(() => (wheelLock = false), 195); // 25% mais rápido (260 → 195ms)
  },
  { passive: false }
);

/* ---------- Overlay ---------- */
let lastFocused = null;
let currentProject = null;
let currentImageIndex = 0;

function renderOverlayImage() {
  if (!currentProject) return;
  const imgs = currentProject.images || [];
  const src = imgs[currentImageIndex];
  overlayMedia.innerHTML = src
    ? `<img src="${src}" alt="${currentProject.title}" />`
    : "";
  overlayCaption.textContent = currentProject.title;

  const multi = imgs.length > 1;
  overlayPrev.hidden = !multi;
  overlayNext.hidden = !multi;
  overlayCount.hidden = !multi;
  if (multi) {
    overlayCount.textContent = `${currentImageIndex + 1} / ${imgs.length}`;
  }
}

function stepOverlayImage(delta) {
  if (!currentProject) return;
  const total = (currentProject.images || []).length;
  if (total <= 1) return;
  currentImageIndex = (currentImageIndex + delta + total) % total;
  renderOverlayImage();
}

function openOverlay(id) {
  const p = PROJECTS.find((x) => x.id === Number(id));
  if (!p) return;
  lastFocused = document.activeElement;
  currentProject = p;
  currentImageIndex = 0;
  renderOverlayImage();

  overlay.removeAttribute("hidden");
  document.body.style.setProperty("overflow", "hidden");
  overlayClose.focus();
  document.addEventListener("keydown", onOverlayKey);
}

function closeOverlay() {
  overlay.setAttribute("hidden", "");
  document.body.style.removeProperty("overflow"); // restaura a rolagem (mobile)
  document.removeEventListener("keydown", onOverlayKey);
  currentProject = null;
  if (lastFocused) lastFocused.focus();
}

function onOverlayKey(e) {
  if (e.key === "Escape") closeOverlay();
  else if (e.key === "ArrowRight") stepOverlayImage(1);
  else if (e.key === "ArrowLeft") stepOverlayImage(-1);
}

track.addEventListener("click", (e) => {
  const btn = e.target.closest(".card__media");
  if (!btn) return;
  const p = PROJECTS.find((x) => x.id === Number(btn.dataset.id));
  if (p && p.type === "mosaic") openMosaicOverlay(p.id);
  else openOverlay(btn.dataset.id);
});

overlayClose.addEventListener("click", closeOverlay);
overlayPrev.addEventListener("click", () => stepOverlayImage(-1));
overlayNext.addEventListener("click", () => stepOverlayImage(1));
overlay.addEventListener("click", (e) => {
  if (e.target === overlay) closeOverlay();
});

/* ---------- Overlay — mosaico ---------- */
let lastFocusedMosaic = null;
let currentMosaicProject = null;
let mosaicZoomIndex = -1; // -1 = grade; >=0 = peça ampliada

function renderMosaicGrid(p) {
  overlayMosaic.setAttribute("aria-label", p.title); // nome do diálogo (a11y), sem título visível
  mosaicGrid.innerHTML = p.images
    .map(
      (src, i) => `
      <li>
        <button class="mosaic__tile" type="button" data-index="${i}" aria-label="Ampliar peça ${i + 1} de ${p.images.length}">
          <img src="${src}" alt="${p.title} — peça ${i + 1}" loading="lazy" />
        </button>
      </li>`
    )
    .join("");
}

function renderMosaicZoom() {
  if (!currentMosaicProject || mosaicZoomIndex < 0) return;
  const imgs = currentMosaicProject.images;
  const src = imgs[mosaicZoomIndex];
  mosaicZoomMedia.innerHTML = `<img src="${src}" alt="${currentMosaicProject.title} — peça ${mosaicZoomIndex + 1}" />`;
  mosaicZoomCount.textContent = `${mosaicZoomIndex + 1} / ${imgs.length}`;
}

function openMosaicZoom(index) {
  mosaicZoomIndex = index;
  renderMosaicZoom();
  mosaicZoom.removeAttribute("hidden");
  mosaicZoomNext.focus();
}

function closeMosaicZoom() {
  mosaicZoom.setAttribute("hidden", "");
  mosaicZoomIndex = -1;
}

function stepMosaicZoom(delta) {
  if (mosaicZoomIndex < 0 || !currentMosaicProject) return;
  const total = currentMosaicProject.images.length;
  mosaicZoomIndex = (mosaicZoomIndex + delta + total) % total;
  renderMosaicZoom();
}

function openMosaicOverlay(id) {
  const p = PROJECTS.find((x) => x.id === Number(id));
  if (!p) return;
  lastFocusedMosaic = document.activeElement;
  currentMosaicProject = p;
  renderMosaicGrid(p);

  overlayMosaic.removeAttribute("hidden");
  document.body.style.setProperty("overflow", "hidden");
  overlayMosaic.focus(); // foca o diálogo, não o botão X (evita anel de foco na borda)
  document.addEventListener("keydown", onMosaicKey);
}

function closeMosaicOverlay() {
  overlayMosaic.setAttribute("hidden", "");
  closeMosaicZoom();
  document.body.style.removeProperty("overflow"); // restaura a rolagem (mobile)
  document.removeEventListener("keydown", onMosaicKey);
  currentMosaicProject = null;
  if (lastFocusedMosaic) lastFocusedMosaic.focus();
}

function onMosaicKey(e) {
  if (e.key === "Escape") {
    if (mosaicZoomIndex >= 0) closeMosaicZoom();
    else closeMosaicOverlay();
  } else if (e.key === "ArrowRight") stepMosaicZoom(1);
  else if (e.key === "ArrowLeft") stepMosaicZoom(-1);
}

mosaicGrid.addEventListener("click", (e) => {
  const tile = e.target.closest(".mosaic__tile");
  if (tile) openMosaicZoom(Number(tile.dataset.index));
});

mosaicClose.addEventListener("click", closeMosaicOverlay);
mosaicZoomPrev.addEventListener("click", () => stepMosaicZoom(-1));
mosaicZoomNext.addEventListener("click", () => stepMosaicZoom(1));
mosaicZoomClose.addEventListener("click", closeMosaicOverlay); // X: sai do mosaico
// clicar fora da imagem (fundo) volta para o mosaico; imagem, setas e X não fecham aqui
mosaicZoom.addEventListener("click", (e) => {
  if (
    e.target.closest(".overlay__nav") ||
    e.target.closest(".overlay__close") ||
    e.target.tagName === "IMG"
  )
    return;
  closeMosaicZoom();
});

/* ---------- Teclado global: setas navegam o carrossel ---------- */
document.addEventListener("keydown", (e) => {
  if (GRID_LAYOUT) return;
  if (!overlay.hasAttribute("hidden") || !overlayMosaic.hasAttribute("hidden")) return;
  if (e.key === "ArrowRight") { go(1); }
  else if (e.key === "ArrowLeft") { go(-1); }
});

const MOBILE_MQ = window.matchMedia("(max-width: 860px)");

/* ---------- Tamanho do logo ----------
   Fica à esquerda do nome (no HTML), com a altura da palavra "BRUNO"
   (1 linha do nome). No mobile o logo é ocultado via CSS. */
function sizeLogo() {
  const name = document.querySelector(".name");
  const logo = document.querySelector(".logo");
  if (!name || !logo || MOBILE_MQ.matches) return;
  const target = name.getBoundingClientRect().height / 2;
  logo.style.height = target + "px";
  logo.style.width = target * (180 / 200) + "px";
}

/* ---------- Recalcula em resize ---------- */
let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    sizeLogo();
    update();
  }, 120);
});

if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(sizeLogo);
}
window.addEventListener("load", sizeLogo);
sizeLogo();
update();
