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
const progressBar = document.querySelector("#progressBar");
const statElements = document.querySelectorAll(".stat-number");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let statsAnimated = false;

function updateScrollProgress() {
  if (!progressBar) return;
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  if (scrollHeight <= 0) {
    progressBar.style.width = "0%";
    return;
  }
  const progress = Math.min(100, Math.max(0, (window.scrollY / scrollHeight) * 100));
  progressBar.style.width = `${progress}%`;
}

function runTypewriter() {
  if (!typewriter) return;

  const text = typewriter.dataset.text || typewriter.textContent.trim();
  if (reducedMotion) {
    typewriter.textContent = text;
    return;
  }

  typewriter.textContent = "";
  typewriter.classList.add("typing");

  [...text].forEach((character, index) => {
    window.setTimeout(() => {
      typewriter.textContent += character;
      if (index === text.length - 1) {
        window.setTimeout(() => typewriter.classList.remove("typing"), 1000);
      }
    }, index * 85);
  });
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
