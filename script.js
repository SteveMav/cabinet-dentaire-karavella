(function () {
  const root = document.documentElement;
  const storedTheme = localStorage.getItem("karavella-theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initialTheme = storedTheme || (prefersDark ? "dark" : "light");
  root.setAttribute("data-theme", initialTheme);

  const page = document.body.dataset.page;
  document.querySelectorAll("[data-nav]").forEach((link) => {
    if (link.dataset.nav === page) {
      link.setAttribute("aria-current", "page");
    }
  });

  const nav = document.querySelector("[data-nav-links]");
  const navToggle = document.querySelector("[data-nav-toggle]");
  const themeToggle = document.querySelector("[data-theme-toggle]");

  function refreshIcons() {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  function updateThemeButton(theme) {
    if (!themeToggle) return;
    themeToggle.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
    themeToggle.innerHTML = theme === "dark" ? '<i data-lucide="sun"></i>' : '<i data-lucide="moon"></i>';
    refreshIcons();
  }

  updateThemeButton(initialTheme);

  themeToggle?.addEventListener("click", () => {
    const nextTheme = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", nextTheme);
    localStorage.setItem("karavella-theme", nextTheme);
    updateThemeButton(nextTheme);
  });

  navToggle?.addEventListener("click", (event) => {
    event.stopPropagation();
    const isOpen = nav?.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    navToggle.innerHTML = isOpen ? '<i data-lucide="x"></i>' : '<i data-lucide="menu"></i>';
    refreshIcons();
  });

  document.addEventListener("click", (event) => {
    if (!nav || !navToggle) return;
    if (!nav.classList.contains("is-open")) return;
    if (nav.contains(event.target) || navToggle.contains(event.target)) return;
    nav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.innerHTML = '<i data-lucide="menu"></i>';
    refreshIcons();
  });

  const form = document.querySelector("[data-appointment-form]");
  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const lines = [
      "Bonjour Cabinet Dentaire Karavella,",
      "Je souhaite demander un rendez-vous.",
      "",
      `Nom: ${data.get("name") || ""}`,
      `Telephone/WhatsApp: ${data.get("phone") || ""}`,
      `Email: ${data.get("email") || "Non indique"}`,
      `Type de soin: ${data.get("service") || ""}`,
      `Jour souhaite: ${data.get("date") || ""}`,
      `Plage horaire: ${data.get("time") || ""}`,
      `Urgence: ${data.get("urgency") || ""}`,
      `Message: ${data.get("message") || "Aucun message"}`,
      "",
      "Merci de me confirmer la disponibilite."
    ];
    const url = `https://wa.me/243818841554?text=${encodeURIComponent(lines.join("\n"))}`;
    window.open(url, "_blank", "noopener,noreferrer");
  });

  refreshIcons();
})();
