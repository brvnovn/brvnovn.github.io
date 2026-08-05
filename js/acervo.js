const cards = document.querySelectorAll(".card");

function expand(card) {
  cards.forEach((other) => {
    if (other !== card) collapse(other);
  });

  const iframe = card.querySelector(".card-content__media iframe");
  iframe.src = iframe.dataset.src;

  card.querySelector(".card-trigger").hidden = true;
  card.querySelector(".card-content").hidden = false;
  card.classList.add("card--expanded");
}

function collapse(card) {
  const iframe = card.querySelector(".card-content__media iframe");
  iframe.src = "about:blank";

  card.querySelector(".card-trigger").hidden = false;
  card.querySelector(".card-content").hidden = true;
  card.classList.remove("card--expanded");
}

cards.forEach((card) => {
  card.querySelector(".card-trigger").addEventListener("click", () => expand(card));
  card.querySelector(".card-content__close").addEventListener("click", () => collapse(card));
});
