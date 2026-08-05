const PROJECTS = {
  "1": {
    title: "Projeto 1",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    // TODO: colar aqui o link embed do YouTube (https://www.youtube.com/embed/...)
    embedUrl: "",
  },
  "2": {
    title: "Projeto 2",
    description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    // TODO: colar aqui o link embed do YouTube (https://www.youtube.com/embed/...)
    embedUrl: "",
  },
};

const modal = document.getElementById("project-modal");
const videoSlot = modal.querySelector("[data-video-slot]");
const titleEl = modal.querySelector(".project-modal__title");
const descriptionEl = modal.querySelector(".project-modal__description");

function openProject(id) {
  const project = PROJECTS[id];
  if (!project) return;

  titleEl.textContent = project.title;
  descriptionEl.textContent = project.description;
  videoSlot.innerHTML = project.embedUrl
    ? `<iframe src="${project.embedUrl}" title="${project.title}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
    : "";

  modal.hidden = false;
  document.body.style.overflow = "hidden";
}

function closeProject() {
  modal.hidden = true;
  videoSlot.innerHTML = "";
  document.body.style.overflow = "";
}

document.querySelectorAll(".card").forEach((card) => {
  card.addEventListener("click", () => openProject(card.dataset.project));
});

modal.querySelectorAll("[data-close]").forEach((el) => {
  el.addEventListener("click", closeProject);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !modal.hidden) closeProject();
});
