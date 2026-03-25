export function initUi() {
  const navbar = document.getElementById("navbar");
  const navLinks = document.getElementById("navLinks");
  const hamburger = document.getElementById("hamburger");

  function toggleScrolledNavbar() {
    if (!navbar) {
      return;
    }
    navbar.classList.toggle("scrolled", window.scrollY > 40);
  }

  function toggleMobileMenu() {
    if (!navLinks || !hamburger) {
      return;
    }
    const isOpen = navLinks.classList.toggle("open");
    hamburger.setAttribute("aria-expanded", String(isOpen));
  }

  function closeMobileMenu() {
    if (!navLinks || !hamburger) {
      return;
    }
    navLinks.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
  }

  function initRevealObserver() {
    const revealTargets = document.querySelectorAll(".r");
    if (!revealTargets.length) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("vis");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    revealTargets.forEach((element) => observer.observe(element));
  }

  window.addEventListener("scroll", toggleScrolledNavbar);
  toggleScrolledNavbar();
  initRevealObserver();

  if (hamburger) {
    hamburger.setAttribute("aria-expanded", "false");
    hamburger.addEventListener("click", toggleMobileMenu);
  }

  document.querySelectorAll("#navLinks a").forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });
}
