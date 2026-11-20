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
const scrollBrick = document.querySelector("#scrollBrick");
const scrollTrack = document.querySelector(".vertical-scroll-track");
const statElements = document.querySelectorAll(".stat-number");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let statsAnimated = false;

function updateScrollProgress() {
  if (!scrollBrick || !scrollTrack) return;
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  if (scrollHeight <= 0) {
    scrollBrick.style.transform = "translateY(0)";
    return;
  }
  const trackHeight = scrollTrack.clientHeight;
  const brickHeight = scrollBrick.clientHeight;
  const maxTravel = trackHeight - brickHeight;
  const progress = Math.min(1, Math.max(0, window.scrollY / scrollHeight));
  scrollBrick.style.transform = `translateY(${progress * maxTravel}px)`;
}

function runTypewriter() {
  const line1 = document.querySelector(".name-line-1");
  const line2 = document.querySelector(".name-line-2");
  if (!line1 || !line2) return;

  const text1 = line1.dataset.text || line1.textContent.trim() || "K Karthik";
  const text2 = line2.dataset.text || line2.textContent.trim() || "Reddy";

  if (reducedMotion) {
    line1.textContent = text1;
    line2.textContent = text2;
    return;
  }

  line1.textContent = "";
  line2.textContent = "";
  line1.classList.add("typing");

  const speed = 75;

  [...text1].forEach((character, index) => {
    window.setTimeout(() => {
      line1.textContent += character;
      if (index === text1.length - 1) {
        line1.classList.remove("typing");
        line2.classList.add("typing");

        [...text2].forEach((char2, index2) => {
          window.setTimeout(() => {
            line2.textContent += char2;
            if (index2 === text2.length - 1) {
              window.setTimeout(() => line2.classList.remove("typing"), 1200);
            }
          }, (index2 + 1) * speed);
        });
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
  const gridSpacing = 28;
  const maxDistance = 115;

  const mouse = {
    x: -9999,
    y: -9999,
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
          y: r * gridSpacing,
          originX: c * gridSpacing,
          originY: r * gridSpacing
        });
      }
    }
  }

  window.addEventListener("resize", resize, { passive: true });
  resize();

  window.addEventListener("pointermove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
  }, { passive: true });

  window.addEventListener("pointerdown", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
  }, { passive: true });

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

    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    const dotBaseColor = isDark ? "rgba(148, 163, 184, 0.22)" : "rgba(100, 116, 139, 0.28)";
    const accentLineRgb = isDark ? "56, 189, 248" : "79, 70, 229";
    const ballRgb = isDark ? "56, 189, 248" : "79, 70, 229";

    // 1. Draw glowing cursor ball when mouse is active in viewport
    if (mouse.active && mouse.x >= 0 && mouse.y >= 0 && mouse.x <= width && mouse.y <= height) {
      const glow = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 44);
      glow.addColorStop(0, `rgba(${ballRgb}, 0.28)`);
      glow.addColorStop(1, `rgba(${ballRgb}, 0)`);
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 44, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = `rgb(${ballRgb})`;
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 3.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // 2. Draw connections and dots
    for (let i = 0; i < dots.length; i++) {
      const d = dots[i];
      let currentDotColor = dotBaseColor;
      let currentRadius = 0.95;

      if (mouse.active && mouse.x >= 0 && mouse.y >= 0) {
        const dx = mouse.x - d.x;
        const dy = mouse.y - d.y;
        const dist = Math.hypot(dx, dy);

        if (dist < maxDistance) {
          const ratio = 1 - dist / maxDistance;

          ctx.strokeStyle = `rgba(${accentLineRgb}, ${ratio * 0.52})`;
          ctx.lineWidth = ratio * 1.15;
          ctx.beginPath();
          ctx.moveTo(mouse.x, mouse.y);
          ctx.lineTo(d.x, d.y);
          ctx.stroke();

          const pull = ratio * 3.2;
          d.x = d.originX + (dx / dist) * pull;
          d.y = d.originY + (dy / dist) * pull;

          currentDotColor = `rgba(${accentLineRgb}, ${0.5 + ratio * 0.5})`;
          currentRadius = 1.6;
        } else {
          d.x += (d.originX - d.x) * 0.1;
          d.y += (d.originY - d.y) * 0.1;
        }
      } else {
        d.x += (d.originX - d.x) * 0.1;
        d.y += (d.originY - d.y) * 0.1;
      }

      ctx.fillStyle = currentDotColor;
      ctx.beginPath();
      ctx.arc(d.x, d.y, currentRadius, 0, Math.PI * 2);
      ctx.fill();
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

        navItems.forEach((item) => {
          item.classList.toggle("active", item.getAttribute("href") === `#${entry.target.id}`);
        });
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
    navItems.forEach((item) => {
      item.classList.toggle("active", item.getAttribute("href") === "#contact");
    });
  } else if (window.scrollY < 120) {
    navItems.forEach((item) => item.classList.remove("active"));
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
