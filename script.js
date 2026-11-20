import { inject } from "@vercel/analytics";

try {
  const storedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initialTheme = storedTheme || (prefersDark ? "dark" : "light");
  document.documentElement.setAttribute("data-theme", initialTheme);
} catch (e) {}

document.documentElement.classList.add("js");

inject();

const themeToggle = document.querySelector("#themeToggle");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const navItems = document.querySelectorAll(".nav-links a");
const backToTop = document.querySelector(".back-to-top");
const revealItems = document.querySelectorAll(".reveal");
const sections = document.querySelectorAll("main section[id]");
const contactForm = document.querySelector("#contactForm");
const typewriter = document.querySelector(".typewriter");
const scrollProgressBar = document.querySelector("#scrollProgressBar");
const brandLogo = document.querySelector("#brandLogo") || document.querySelector(".brand");
const statElements = document.querySelectorAll(".stat-number");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let statsAnimated = false;

if (brandLogo) {
  brandLogo.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (window.location.hash) {
      history.pushState(null, "", window.location.pathname);
    }
  });
}

function updateScrollProgress() {
  if (!scrollProgressBar) return;
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  if (scrollHeight <= 0) {
    scrollProgressBar.style.width = "0%";
    return;
  }
  const progress = Math.min(1, Math.max(0, window.scrollY / scrollHeight));
  scrollProgressBar.style.width = `${progress * 100}%`;
}

function setActiveSection(id) {
  navItems.forEach((item) => {
    item.classList.toggle("active", item.getAttribute("href") === `#${id}`);
  });
}

function runTypewriter() {
  if (!typewriter) return;

  const fullText = typewriter.dataset.text || typewriter.textContent.trim() || "K Karthik Reddy";

  if (reducedMotion) {
    typewriter.textContent = fullText;
    return;
  }

  typewriter.textContent = "";
  typewriter.classList.add("typing");

  const speed = 70;

  [...fullText].forEach((character, index) => {
    window.setTimeout(() => {
      typewriter.textContent += character;
      if (index === fullText.length - 1) {
        window.setTimeout(() => typewriter.classList.remove("typing"), 1400);
      }
    }, (index + 1) * speed);
  });
}

function initDotsCanvas() {
  const canvas = document.querySelector("#dotsCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let width = 0;
  let height = 0;
  let dpr = 1;
  let dots = [];
  const gridSpacing = 32;
  const influenceRadius = 88;

  const mouse = {
    x: -9999,
    y: -9999,
    targetX: -9999,
    targetY: -9999,
    active: false
  };

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    buildGrid();
  }

  function buildGrid() {
    dots = [];
    const cols = Math.ceil(width / gridSpacing) + 1;
    const rows = Math.ceil(height / gridSpacing) + 1;
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        dots.push({
          x: c * gridSpacing,
          y: r * gridSpacing
        });
      }
    }
  }

  let cardRects = [];

  function updateCardRects() {
    const cards = document.querySelectorAll(
      ".project-card, .skill-card, .edu-card, .cert-card, .profile-panel, .contact-form, .contact-social-card, .site-header"
    );
    cardRects = [];
    for (let i = 0; i < cards.length; i++) {
      const r = cards[i].getBoundingClientRect();
      if (r.width > 0 && r.height > 0 && r.bottom >= 0 && r.top <= height) {
        cardRects.push({
          left: r.left - 2,
          right: r.right + 2,
          top: r.top - 2,
          bottom: r.bottom + 2
        });
      }
    }
  }

  function isInsideCard(x, y) {
    for (let i = 0; i < cardRects.length; i++) {
      const r = cardRects[i];
      if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) {
        return true;
      }
    }
    return false;
  }

  window.addEventListener("resize", resize, { passive: true });
  resize();

  function updatePointer(e) {
    if (isInsideCard(e.clientX, e.clientY)) {
      mouse.active = false;
      mouse.x = -9999;
      mouse.y = -9999;
      return;
    }
    const overBox = e.target && e.target.closest && e.target.closest(
      ".project-card, .skill-card, .edu-card, .cert-card, .profile-panel, .contact-form, .contact-social-card, nav, .site-header, .stat-chip, button, a, input, textarea"
    );
    if (overBox) {
      mouse.active = false;
      mouse.x = -9999;
      mouse.y = -9999;
    } else {
      mouse.active = true;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }
  }

  window.addEventListener("pointermove", updatePointer, { passive: true });
  window.addEventListener("pointerdown", updatePointer, { passive: true });

  window.addEventListener("pointerleave", () => {
    mouse.active = false;
    mouse.x = -9999;
    mouse.y = -9999;
  });

  function render() {
    if (document.hidden) {
      requestAnimationFrame(render);
      return;
    }

    ctx.clearRect(0, 0, width, height);

    updateCardRects();

    if (isInsideCard(mouse.x, mouse.y)) {
      mouse.active = false;
      mouse.x = -9999;
      mouse.y = -9999;
    }

    if (!mouse.active) {
      mouse.x = -9999;
      mouse.y = -9999;
    }

    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    const dotBaseColor = isDark ? "rgba(148, 163, 184, 0.2)" : "rgba(71, 85, 105, 0.28)";
    const accentRgb = isDark ? "56, 189, 248" : "13, 148, 136";

    // 1. Draw smooth cursor core & soft glow
    if (mouse.active && mouse.x >= 0 && mouse.y >= 0 && mouse.x <= width && mouse.y <= height && !isInsideCard(mouse.x, mouse.y)) {
      const glow = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 24);
      glow.addColorStop(0, `rgba(${accentRgb}, ${isDark ? 0.22 : 0.28})`);
      glow.addColorStop(1, `rgba(${accentRgb}, 0)`);
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 24, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = `rgb(${accentRgb})`;
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // 2. Identify nearby dots & draw delicate mesh connections
    const nearby = [];

    for (let i = 0; i < dots.length; i++) {
      const d = dots[i];
      if (isInsideCard(d.x, d.y)) {
        continue;
      }

      let radius = isDark ? 0.85 : 1.05;
      let color = dotBaseColor;

      if (mouse.active && mouse.x >= 0 && mouse.y >= 0 && !isInsideCard(mouse.x, mouse.y)) {
        const dist = Math.hypot(mouse.x - d.x, mouse.y - d.y);
        if (dist < influenceRadius) {
          const ratio = 1 - dist / influenceRadius;
          radius = (isDark ? 0.85 : 1.05) + ratio * 1.5;
          color = `rgba(${accentRgb}, ${0.35 + ratio * 0.5})`;
          nearby.push({ dot: d, dist, ratio });
        }
      }

      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(d.x, d.y, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    // Connect mouse to the top 2-3 closest dots with gentle soft lines
    if (nearby.length > 0 && !isInsideCard(mouse.x, mouse.y)) {
      nearby.sort((a, b) => a.dist - b.dist);
      const topCount = Math.min(3, nearby.length);
      for (let k = 0; k < topCount; k++) {
        const item = nearby[k];
        if (isInsideCard(item.dot.x, item.dot.y)) continue;
        ctx.strokeStyle = `rgba(${accentRgb}, ${item.ratio * (isDark ? 0.22 : 0.32)})`;
        ctx.lineWidth = isDark ? 0.75 : 0.9;
        ctx.beginPath();
        ctx.moveTo(mouse.x, mouse.y);
        ctx.lineTo(item.dot.x, item.dot.y);
        ctx.stroke();
      }

      // Connect adjacent nearby dots to each other (organic constellation mesh)
      const maxNeighborDist = gridSpacing * 1.45;
      for (let m = 0; m < nearby.length; m++) {
        if (isInsideCard(nearby[m].dot.x, nearby[m].dot.y)) continue;
        for (let n = m + 1; n < nearby.length; n++) {
          if (isInsideCard(nearby[n].dot.x, nearby[n].dot.y)) continue;
          const d1 = nearby[m].dot;
          const d2 = nearby[n].dot;
          const dotDist = Math.hypot(d1.x - d2.x, d1.y - d2.y);
          if (dotDist <= maxNeighborDist) {
            const pairAlpha = Math.min(nearby[m].ratio, nearby[n].ratio) * (isDark ? 0.18 : 0.26);
            ctx.strokeStyle = `rgba(${accentRgb}, ${pairAlpha})`;
            ctx.lineWidth = isDark ? 0.65 : 0.8;
            ctx.beginPath();
            ctx.moveTo(d1.x, d1.y);
            ctx.lineTo(d2.x, d2.y);
            ctx.stroke();
          }
        }
      }
    }

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

function animateStats() {
  if (statsAnimated || statElements.length === 0) return;
  statsAnimated = true;

  statElements.forEach((el) => {
    const target = parseInt(el.dataset.target, 10);
    const start = parseInt(el.dataset.start, 10) || 0;
    const suffix = el.dataset.suffix || "";

    if (isNaN(target)) return;

    if (reducedMotion) {
      el.textContent = `${target}${suffix}`;
      return;
    }

    const duration = 1400;
    const startTime = performance.now();

    function step(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.round(start + (target - start) * ease);

      el.textContent = `${currentVal}${suffix}`;

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        el.textContent = `${target}${suffix}`;
      }
    }

    window.requestAnimationFrame(step);
  });
}

runTypewriter();
updateScrollProgress();
initDotsCanvas();

/* --- Cursor Spotlight Effect (Dynamic Cursor-Following Highlight for Cards) --- */
function initSpotlight() {
  const cards = document.querySelectorAll(
    ".project-card, .skill-card, .edu-card, .cert-card, .profile-panel, .contact-social-card"
  );
  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    });
    card.addEventListener("mouseleave", () => {
      card.style.removeProperty("--mouse-x");
      card.style.removeProperty("--mouse-y");
    });
  });
}

initSpotlight();

/* --- Theme Toggle & Preferences --- */
function getActiveTheme() {
  return document.documentElement.getAttribute("data-theme") || "light";
}

function updateThemeToggleAccessibility(theme) {
  if (!themeToggle) return;
  const isDark = theme === "dark";
  const label = isDark ? "Switch to light theme" : "Switch to dark theme";
  themeToggle.setAttribute("aria-label", label);
  themeToggle.setAttribute("title", label);
  themeToggle.setAttribute("aria-pressed", isDark ? "true" : "false");
}

function applyTheme(theme, save = true) {
  document.documentElement.setAttribute("data-theme", theme);
  updateThemeToggleAccessibility(theme);

  if (save) {
    try {
      localStorage.setItem("theme", theme);
    } catch (e) {}
  }
}

updateThemeToggleAccessibility(getActiveTheme());

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    themeToggle.classList.remove("theme-animating");
    void themeToggle.offsetWidth;
    themeToggle.classList.add("theme-animating");

    const current = getActiveTheme();
    const next = current === "dark" ? "light" : "dark";
    applyTheme(next, true);

    window.setTimeout(() => {
      themeToggle.classList.remove("theme-animating");
    }, 450);
  });
}

try {
  const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const handleSystemThemeChange = (e) => {
    try {
      if (!localStorage.getItem("theme")) {
        applyTheme(e.matches ? "dark" : "light", false, true);
      }
    } catch (err) {}
  };

  if (darkModeMediaQuery.addEventListener) {
    darkModeMediaQuery.addEventListener("change", handleSystemThemeChange);
  } else if (darkModeMediaQuery.addListener) {
    darkModeMediaQuery.addListener(handleSystemThemeChange);
  }
} catch (e) {}

if (menuToggle && navLinks) {
  function closeMenu() {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open menu");
  }

  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  });

  navItems.forEach((item) => {
    item.addEventListener("click", () => {
      navItems.forEach((n) => n.classList.remove("active"));
      item.classList.add("active");
      closeMenu();
    });
  });

  document.addEventListener("click", (event) => {
    if (
      navLinks.classList.contains("open") &&
      !navLinks.contains(event.target) &&
      !menuToggle.contains(event.target)
    ) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && navLinks.classList.contains("open")) {
      closeMenu();
      menuToggle.focus();
    }
  });
}

if (backToTop) {
  backToTop.setAttribute("tabindex", "-1");
  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          if (
            entry.target.classList.contains("profile-panel") ||
            entry.target.querySelector(".stat-number")
          ) {
            animateStats();
          }
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 30;
      if (atBottom) return;

      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        setActiveSection(entry.target.id);
      });
    },
    { rootMargin: "-30% 0px -40% 0px" }
  );

  sections.forEach((section) => sectionObserver.observe(section));
} else {
  revealItems.forEach((item) => item.classList.add("visible"));
  animateStats();
}

let scrollTicking = false;

function onScroll() {
  updateScrollProgress();

  const atBottom =
    window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 30;

  if (atBottom) {
    setActiveSection("contact");
  } else if (window.scrollY < 120) {
    setActiveSection("home");
  }

  if (backToTop) {
    const isVisible = window.scrollY > 500;
    backToTop.classList.toggle("visible", isVisible);
    backToTop.setAttribute("tabindex", isVisible ? "0" : "-1");
  }

  scrollTicking = false;
}

window.addEventListener(
  "scroll",
  () => {
    if (!scrollTicking) {
      window.requestAnimationFrame(onScroll);
      scrollTicking = true;
    }
  },
  { passive: true }
);

window.addEventListener(
  "resize",
  () => {
    if (!scrollTicking) {
      window.requestAnimationFrame(onScroll);
      scrollTicking = true;
    }
  },
  { passive: true }
);

function setFieldInvalid(field, isInvalid) {
  if (!field) return;
  const wrapper = field.closest(".form-field");
  if (!wrapper) return;

  wrapper.classList.toggle("invalid", Boolean(isInvalid));
  if (isInvalid) {
    field.setAttribute("aria-invalid", "true");
  } else {
    field.removeAttribute("aria-invalid");
  }
}

function validateContactForm() {
  if (!contactForm) return false;

  const name = contactForm.elements.name;
  const email = contactForm.elements.email;
  const message = contactForm.elements.message;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  let isValid = true;
  let firstInvalid = null;

  setFieldInvalid(name, false);
  setFieldInvalid(email, false);
  setFieldInvalid(message, false);

  if (message.value.trim().length < 10) {
    setFieldInvalid(message, true);
    isValid = false;
    firstInvalid = message;
  }

  if (!emailPattern.test(email.value.trim())) {
    setFieldInvalid(email, true);
    isValid = false;
    firstInvalid = email;
  }

  if (name.value.trim().length < 2) {
    setFieldInvalid(name, true);
    isValid = false;
    firstInvalid = name;
  }

  if (!isValid && firstInvalid) {
    firstInvalid.focus();
    if (typeof firstInvalid.reportValidity === "function") {
      firstInvalid.reportValidity();
    }
  }

  return isValid;
}

let formStatusTimeout = null;

function setFormStatus(statusEl, type, message, autoClearMs = 0) {
  if (!statusEl) return;
  if (formStatusTimeout) {
    clearTimeout(formStatusTimeout);
    formStatusTimeout = null;
  }
  statusEl.classList.remove("success", "error", "fade-out");
  statusEl.textContent = message;

  if (type) {
    statusEl.classList.add(type);
  }

  if (autoClearMs > 0) {
    formStatusTimeout = window.setTimeout(() => {
      statusEl.classList.add("fade-out");
      formStatusTimeout = window.setTimeout(() => {
        statusEl.classList.remove("success", "error", "fade-out");
        statusEl.textContent = "";
        formStatusTimeout = null;
      }, 400);
    }, autoClearMs);
  }
}

if (contactForm) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const status = contactForm.querySelector(".form-status");
    const submitButton = contactForm.querySelector(".submit-btn");
    const btnText = submitButton ? submitButton.querySelector(".btn-text") : null;

    if (!validateContactForm()) {
      setFormStatus(status, "", "");
      return;
    }

    submitButton.disabled = true;
    submitButton.classList.add("is-loading");
    if (btnText) btnText.textContent = "Sending...";
    setFormStatus(status, "", "");

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: new FormData(contactForm),
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Form submission failed");
      }

      contactForm.reset();
      setFieldInvalid(contactForm.elements.name, false);
      setFieldInvalid(contactForm.elements.email, false);
      setFieldInvalid(contactForm.elements.message, false);
      setFormStatus(status, "success", "Message sent successfully.", 4500);
    } catch (error) {
      setFormStatus(status, "error", "Message could not be sent. Please try again.", 6000);
    } finally {
      submitButton.disabled = false;
      submitButton.classList.remove("is-loading");
      if (btnText) btnText.textContent = "Submit Message";
    }
  });

  contactForm.querySelectorAll("input, textarea").forEach((field) => {
    field.addEventListener("input", () => {
      setFieldInvalid(field, false);
      const status = contactForm.querySelector(".form-status");
      if (status) {
        setFormStatus(status, "", "");
      }
    });
  });
}
