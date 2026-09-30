"use strict";
const STORAGE_KEY = "orbita.tasks.v1";
const statuses = {
  pending: "Por hacer",
  doing: "En progreso",
  review: "En revisión",
  done: "Completada",
};
const people = ["Ana Torres", "Diego Ruiz", "Lucía Vega", "Miguel"];
const roles = [
  "Diseño de producto",
  "Desarrollo frontend",
  "Experiencia de usuario",
  "Desarrollo frontend",
];
const projects = ["Web corporativa", "App de clientes", "Sistema de diseño"];
const today = new Date();
function relativeDate(days) {
  const date = new Date(today);
  date.setDate(date.getDate() + days);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
const seed = [
  [
    "Definir arquitectura de contenidos",
    "Organizar las secciones y el recorrido del nuevo sitio.",
    0,
    0,
    "pending",
    "Alta",
    2,
  ],
  [
    "Diseñar estados vacíos",
    "Propuesta de mensajes y acciones para las pantallas sin datos.",
    1,
    2,
    "pending",
    "Media",
    4,
  ],
  [
    "Documentar componentes",
    "Guía de uso para botones, formularios y navegación.",
    2,
    3,
    "pending",
    "Baja",
    6,
  ],
  [
    "Construir la página de servicios",
    "Maquetación responsiva de servicios y casos de trabajo.",
    0,
    1,
    "doing",
    "Alta",
    1,
  ],
  [
    "Integrar API de clientes",
    "Conectar el directorio y gestionar carga, errores y reintentos.",
    1,
    3,
    "doing",
    "Alta",
    2,
  ],
  [
    "Ajustar navegación móvil",
    "Revisar jerarquía y áreas táctiles en pantallas pequeñas.",
    1,
    2,
    "doing",
    "Media",
    3,
  ],
  [
    "Validar contraste y foco",
    "Comprobar navegación con teclado en formularios y menús.",
    2,
    0,
    "review",
    "Media",
    1,
  ],
  [
    "Revisar flujo de registro",
    "Validación de campos y mensajes de ayuda del formulario.",
    1,
    1,
    "review",
    "Alta",
    2,
  ],
  [
    "Definir paleta y tipografía",
    "Tokens base y escala tipográfica para el producto.",
    2,
    0,
    "done",
    "Media",
    -2,
  ],
  [
    "Crear estructura del proyecto",
    "Organización de archivos, rutas y convenciones de código.",
    0,
    3,
    "done",
    "Baja",
    -1,
  ],
].map((t, i) => ({
  id: `task-${i + 1}`,
  title: t[0],
  description: t[1],
  project: projects[t[2]],
  owner: people[t[3]],
  status: t[4],
  priority: t[5],
  due: relativeDate(t[6]),
}));
function validTask(t) {
  return (
    t &&
    typeof t.id === "string" &&
    typeof t.title === "string" &&
    typeof t.description === "string" &&
    projects.includes(t.project) &&
    people.includes(t.owner) &&
    Object.hasOwn(statuses, t.status) &&
    ["Alta", "Media", "Baja"].includes(t.priority) &&
    /^\d{4}-\d{2}-\d{2}$/.test(t.due)
  );
}
let storageWarning = false;
let tasks = (() => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return structuredClone(seed);
    const data = JSON.parse(raw);
    if (!Array.isArray(data) || !data.every(validTask)) throw new Error("Invalid data");
    return data;
  } catch {
    storageWarning = true;
    return structuredClone(seed);
  }
})();
let layout = "board",
  search = "",
  project = "",
  priority = "",
  contacts = null,
  apiState = "idle";
const view = document.querySelector("#view"),
  dialog = document.querySelector("#task-dialog"),
  form = document.querySelector("#task-form");
const escapeHtml = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
  );
const icon = (name) => `<i data-lucide="${name}" aria-hidden="true"></i>`;
const initials = (name) =>
  name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2);
const avatar = (name) =>
  `<span class="avatar color-${people.indexOf(name)}" title="${escapeHtml(name)}" aria-label="${escapeHtml(name)}">${initials(name)}</span>`;
const dateLabel = (date) =>
  new Intl.DateTimeFormat("es-MX", { day: "numeric", month: "short" }).format(
    new Date(`${date}T12:00:00`),
  );
function icons() {
  if (window.lucide) window.lucide.createIcons();
}
let toastTimer;
function notify(message) {
  const el = document.querySelector("#toast");
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 4000);
}
function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    return true;
  } catch {
    notify("No se pudo guardar. Los cambios solo durarán esta sesión.");
    return false;
  }
}
function metrics() {
  const done = tasks.filter((t) => t.status === "done").length;
  const progress = tasks.length ? Math.round((done / tasks.length) * 100) : 0;
  return `<section class="metrics" aria-label="Indicadores del proyecto">${[
    ["Tareas totales", tasks.length, "En 3 proyectos", "layers"],
    [
      "En progreso",
      tasks.filter((t) => t.status === "doing").length,
      "Trabajo en movimiento",
      "timer",
    ],
    ["Completadas", done, `${progress}% del total completado`, "circle-check"],
    [
      "Próximas entregas",
      tasks.filter(
        (t) => t.status !== "done" && t.due >= relativeDate(0) && t.due <= relativeDate(7),
      ).length,
      "Durante los próximos 7 días",
      "calendar-days",
    ],
  ]
    .map(
      (m, i) =>
        `<div class="metric"><div class="metric-top">${m[0]}${icon(m[3])}</div><div class="metric-value">${String(m[1]).padStart(2, "0")}</div><div class="metric-foot ${i === 2 ? "positive" : ""}">${m[2]}</div></div>`,
    )
    .join("")}</section>`;
}
function statusSelect(t) {
  return `<select aria-label="Estado de ${escapeHtml(t.title)}" data-status="${escapeHtml(t.id)}">${Object.entries(
    statuses,
  )
    .map(
      ([key, label]) =>
        `<option value="${key}" ${key === t.status ? "selected" : ""}>${label}</option>`,
    )
    .join("")}</select>`;
}
function card(t) {
  return `<article class="task-card"><button class="task-open" data-edit="${escapeHtml(t.id)}" aria-label="Editar ${escapeHtml(t.title)}"><span class="project-label ${t.project === projects[1] ? "app" : t.project === projects[2] ? "design" : ""}">${escapeHtml(t.project)}</span><h3>${escapeHtml(t.title)}</h3><p>${escapeHtml(t.description) || "Sin descripción"}</p><div class="task-meta"><span class="priority ${t.priority.toLowerCase()}">${t.priority === "Alta" ? "↑ " : ""}${t.priority}</span><span class="due">${icon("calendar")}${dateLabel(t.due)}</span></div></button><div class="task-bottom">${avatar(t.owner)}${statusSelect(t)}</div></article>`;
}
function filtered() {
  const query = search.toLocaleLowerCase("es");
  return tasks.filter(
    (t) =>
      (!project || t.project === project) &&
      (!priority || t.priority === priority) &&
      `${t.title} ${t.description} ${t.owner}`.toLocaleLowerCase("es").includes(query),
  );
}
function renderTasks() {
  const target = document.querySelector("#tasks-content");
  if (!target) return;
  const rows = filtered();
  document.querySelector("#result-count").textContent = `${rows.length} de ${tasks.length} tareas`;
  target.innerHTML =
    layout === "board"
      ? `<div class="board">${Object.entries(statuses)
          .map(
            ([key, label]) =>
              `<section class="column ${key}" aria-label="${label}"><h2 class="column-heading"><span class="status-dot"></span>${label}<span class="count">${rows.filter((t) => t.status === key).length}</span><button class="icon-button" data-add="${key}" title="Añadir a ${label}" aria-label="Añadir tarea a ${label}">${icon("plus")}</button></h2>${
                rows
                  .filter((t) => t.status === key)
                  .map(card)
                  .join("") || '<div class="empty">No hay tareas en este estado.</div>'
              }<button class="add-column" data-add="${key}">${icon("plus")}Añadir tarea</button></section>`,
          )
          .join("")}</div>`
      : `<div class="list-wrap"><table class="table"><caption class="visually-hidden">Listado de tareas filtradas</caption><thead><tr><th scope="col">Tarea</th><th scope="col">Responsable</th><th scope="col">Prioridad</th><th scope="col">Entrega</th><th scope="col">Estado</th></tr></thead><tbody>${rows.map((t) => `<tr><td><button data-edit="${escapeHtml(t.id)}">${escapeHtml(t.title)}</button><small class="d-block text-secondary">${t.project}</small></td><td>${escapeHtml(t.owner)}</td><td><span class="priority ${t.priority.toLowerCase()}">${t.priority}</span></td><td>${dateLabel(t.due)}</td><td>${statusSelect(t)}</td></tr>`).join("") || '<tr><td colspan="5" class="empty">No hay tareas que coincidan con los filtros.</td></tr>'}</tbody></table></div>`;
  icons();
}
function boardView() {
  return `${metrics()}<div class="board-head"><div class="view-tabs" role="group" aria-label="Vista de tareas"><button data-layout="board" class="${layout === "board" ? "active" : ""}" aria-pressed="${layout === "board"}">${icon("columns-3")}Tablero</button><button data-layout="list" class="${layout === "list" ? "active" : ""}" aria-pressed="${layout === "list"}">${icon("list")}Lista</button></div><div class="team-stack">${people.slice(0, 3).map(avatar).join("")}<span>4 integrantes</span></div></div><div class="toolbar"><div class="search-box">${icon("search")}<input class="form-control" type="search" id="search" aria-label="Buscar tareas" placeholder="Buscar una tarea..." value="${escapeHtml(search)}"></div><select class="form-select" id="project-filter" aria-label="Filtrar por proyecto"><option value="">Todos los proyectos</option>${projects.map((p) => `<option ${p === project ? "selected" : ""}>${p}</option>`).join("")}</select><select class="form-select" id="priority-filter" aria-label="Filtrar por prioridad"><option value="">Toda prioridad</option>${["Alta", "Media", "Baja"].map((p) => `<option ${p === priority ? "selected" : ""}>${p}</option>`).join("")}</select><span class="filter-count" id="result-count" aria-live="polite"></span></div><div id="tasks-content"></div>`;
}
function summaryView() {
  return `${metrics()}<div class="summary-grid"><section class="summary-section"><h2>Avance por proyecto</h2>${projects
    .map((p) => {
      const all = tasks.filter((t) => t.project === p),
        done = all.filter((t) => t.status === "done").length,
        percentage = all.length ? Math.round((done / all.length) * 100) : 0;
      return `<div class="project-progress"><div class="progress-label"><span>${p}</span><span>${done}/${all.length} tareas · ${percentage}%</span></div><div class="progress" role="progressbar" aria-label="Avance de ${p}" aria-valuenow="${percentage}" aria-valuemin="0" aria-valuemax="100"><div class="progress-bar" style="width:${percentage}%"></div></div></div>`;
    })
    .join("")}</section><section class="summary-section"><h2>Agenda de entregas</h2>${
    tasks
      .filter((t) => t.status !== "done")
      .sort((a, b) => a.due.localeCompare(b.due))
      .slice(0, 5)
      .map(
        (t) =>
          `<div class="deadline-row"><div>${escapeHtml(t.title)}<small>${escapeHtml(t.owner)}</small></div><span class="due">${dateLabel(t.due)}</span></div>`,
      )
      .join("") || "<p>Todo está al día.</p>"
  }</section></div>`;
}
function teamView() {
  return `<div class="team-grid">${people.map((p, i) => `<article class="person">${avatar(p)}<div><h3>${p}</h3><p>${roles[i]}</p><p>${tasks.filter((t) => t.owner === p && t.status !== "done").length} tareas abiertas</p></div></article>`).join("")}</div><section class="api-section"><div class="api-heading"><div><h2>Directorio externo</h2><p>Contactos ficticios de JSONPlaceholder.</p></div><button class="btn btn-outline-dark" id="load-contacts" ${apiState === "loading" ? "disabled" : ""}>${icon("refresh-cw")}${apiState === "loading" ? "Consultando…" : contacts ? "Actualizar contactos" : "Consultar contactos"}</button></div><div id="api-results" aria-live="polite">${apiState === "loading" ? '<p role="status">Cargando contactos…</p>' : apiState === "error" ? '<p class="api-error" role="alert">No pudimos consultar el directorio. Revisa tu conexión e inténtalo de nuevo.</p>' : contacts ? `<div class="contacts">${contacts.map((c) => `<article class="contact"><strong>${escapeHtml(c.name)}</strong><small>${escapeHtml(c.company?.name || "")}</small><small>${escapeHtml(c.email)}</small></article>`).join("") || "<p>No hay contactos disponibles.</p>"}</div>` : ""}</div></section>`;
}
function route() {
  const value = location.hash.slice(1);
  return ["tablero", "resumen", "equipo"].includes(value) ? value : "tablero";
}
function render() {
  const current = route();
  const headings = {
    tablero: [
      "Cada entrega, en su lugar.",
      "Un espacio para darle seguimiento a lo que viene.",
      "Tablero de tareas",
    ],
    resumen: [
      "Una mirada al avance.",
      "El estado de tus proyectos y las próximas entregas.",
      "Resumen",
    ],
    equipo: [
      "El equipo detrás de cada idea.",
      "Responsables, carga de trabajo y contactos.",
      "Equipo",
    ],
  }[current];
  document.querySelector("#page-title").textContent = headings[0];
  document.querySelector("#page-description").textContent = headings[1];
  document.querySelector("#breadcrumb").textContent = headings[2];
  document.title = `${headings[2]} | Órbita`;
  document.querySelector("#nav-count").textContent = tasks.length;
  document.querySelectorAll("[data-route]").forEach((el) => {
    el.classList.toggle("active", el.dataset.route === current);
    if (el.dataset.route === current) el.setAttribute("aria-current", "page");
    else el.removeAttribute("aria-current");
  });
  view.innerHTML =
    current === "tablero" ? boardView() : current === "resumen" ? summaryView() : teamView();
  renderTasks();
  icons();
}
function openTask(id, status = "pending") {
  form.reset();
  const task = tasks.find((t) => t.id === id);
  form.elements.id.value = task?.id || "";
  for (const key of ["title", "description", "project", "owner", "status", "priority", "due"]) {
    if (task) form.elements[key].value = task[key];
  }
  if (!task) {
    form.elements.status.value = status;
    form.elements.due.value = relativeDate(3);
  }
  document.querySelector("#dialog-title").textContent = task ? "Editar tarea" : "Nueva tarea";
  document.querySelector("#delete-task").hidden = !task;
  dialog.showModal();
  form.elements.title.focus();
}
document.querySelector("#new-task").addEventListener("click", () => openTask());
document
  .querySelectorAll("[data-close]")
  .forEach((button) => button.addEventListener("click", () => dialog.close()));
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(form));
  data.title = data.title.trim();
  if (!data.title) {
    form.elements.title.setCustomValidity("Escribe un nombre para la tarea.");
    form.elements.title.reportValidity();
    return;
  }
  const existing = tasks.findIndex((t) => t.id === data.id);
  data.id = data.id || crypto.randomUUID();
  if (existing >= 0) tasks[existing] = data;
  else tasks.push(data);
  const saved = persist();
  dialog.close();
  render();
  document.querySelector("#new-task").focus();
  if (saved) notify(existing >= 0 ? "Tarea actualizada" : "Tarea creada");
});
form.elements.title.addEventListener("input", () => form.elements.title.setCustomValidity(""));
document.querySelector("#delete-task").addEventListener("click", () => {
  if (!confirm("¿Eliminar esta tarea? Esta acción no se puede deshacer.")) return;
  tasks = tasks.filter((t) => t.id !== form.elements.id.value);
  const saved = persist();
  dialog.close();
  render();
  document.querySelector("#new-task").focus();
  if (saved) notify("Tarea eliminada");
});
view.addEventListener("click", (event) => {
  const edit = event.target.closest("[data-edit]"),
    add = event.target.closest("[data-add]"),
    toggle = event.target.closest("[data-layout]");
  if (edit) openTask(edit.dataset.edit);
  if (add) openTask(null, add.dataset.add);
  if (toggle) {
    layout = toggle.dataset.layout;
    render();
    document.querySelector(`[data-layout="${layout}"]`).focus();
  }
  if (event.target.closest("#load-contacts")) loadContacts();
});
view.addEventListener("input", (event) => {
  if (event.target.id === "search") {
    search = event.target.value;
    renderTasks();
  }
});
view.addEventListener("change", (event) => {
  const el = event.target;
  if (el.id === "project-filter") {
    project = el.value;
    renderTasks();
  }
  if (el.id === "priority-filter") {
    priority = el.value;
    renderTasks();
  }
  if (el.dataset.status) {
    const task = tasks.find((t) => t.id === el.dataset.status);
    if (task && Object.hasOwn(statuses, el.value)) {
      task.status = el.value;
      const saved = persist();
      render();
      document.querySelector(`[data-status="${task.id}"]`)?.focus();
      if (saved) notify(`Tarea movida a ${statuses[task.status].toLowerCase()}`);
    }
  }
});
async function loadContacts() {
  if (apiState === "loading") return;
  apiState = "loading";
  render();
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users", {
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    if (
      !Array.isArray(data) ||
      !data.every((c) => typeof c.name === "string" && typeof c.email === "string")
    )
      throw new Error("Invalid response");
    contacts = data;
    apiState = "success";
  } catch {
    apiState = "error";
  }
  if (route() === "equipo") {
    render();
    document.querySelector("#load-contacts").focus();
  }
}
window.addEventListener("hashchange", () => {
  render();
  document.querySelector("#main").focus();
});
render();
if (storageWarning)
  notify("No se pudieron recuperar los datos guardados. Se muestra la demo inicial.");
