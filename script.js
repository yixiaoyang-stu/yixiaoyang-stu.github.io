const root = document.documentElement;
const header = document.querySelector("[data-header]");
const nav = document.querySelector(".site-nav");
const navToggle = document.querySelector(".nav-toggle");
const themeToggle = document.querySelector(".theme-toggle");
const navLinks = [...document.querySelectorAll(".site-nav a")];
const sections = [...document.querySelectorAll("main section[id]")];

const storedTheme = localStorage.getItem("resume-theme");
const preferredDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
root.dataset.theme = storedTheme || (preferredDark ? "dark" : "light");

themeToggle.addEventListener("click", () => {
  const next = root.dataset.theme === "dark" ? "light" : "dark";
  root.dataset.theme = next;
  localStorage.setItem("resume-theme", next);
});

const setNavOpen = (open) => {
  nav.classList.toggle("is-open", open);
  navToggle.setAttribute("aria-expanded", String(open));
};

navToggle.addEventListener("click", () => {
  setNavOpen(!nav.classList.contains("is-open"));
});

navLinks.forEach((link) => link.addEventListener("click", () => setNavOpen(false)));

document.addEventListener("click", (event) => {
  if (!nav.contains(event.target) && !navToggle.contains(event.target)) setNavOpen(false);
});

const updateHeader = () => header.classList.toggle("is-scrolled", window.scrollY > 24);
updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((item) => revealObserver.observe(item));

const sectionObserver = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    navLinks.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${visible.target.id}`);
    });
  },
  { rootMargin: "-25% 0px -60%", threshold: [0.05, 0.2, 0.5] }
);

sections.forEach((section) => sectionObserver.observe(section));
