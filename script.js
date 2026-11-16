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

function triggerThemeRipple(x, y, targetTheme) {
  if (reducedMotion) return;

  const ripple = document.createElement("div");
  ripple.className = "theme-ripple";

  const maxDim = Math.max(
    Math.hypot(x, y),
    Math.hypot(window.innerWidth - x, y),
    Math.hypot(x, window.innerHeight - y),
    Math.hypot(window.innerWidth - x, window.innerHeight - y)
  );
  const size = Math.ceil(maxDim * 2.2);

  ripple.style.width = `${size}px`;
  ripple.style.height = `${size}px`;
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;
  ripple.style.backgroundColor = targetTheme === "dark" ? "#0b0f17" : "#f7f8fb";

  document.body.appendChild(ripple);

  requestAnimationFrame(() => {
    ripple.style.transform = "translate(-50%, -50%) scale(1)";
  });

  window.setTimeout(() => {
    ripple.classList.add("fade-out");
    window.setTimeout(() => {
      ripple.remove();
    }, 220);
  }, 260);
}

function toggleTheme(event) {
  const current = getActiveTheme();
  const next = current === "dark" ? "light" : "dark";

  const rect = themeToggle
    ? themeToggle.getBoundingClientRect()
    : { left: window.innerWidth - 60, top: 20, width: 40, height: 40 };

  const x = event && typeof event.clientX === "number" && event.clientX > 0
    ? event.clientX
    : rect.left + rect.width / 2;
  const y = event && typeof event.clientY === "number" && event.clientY > 0
    ? event.clientY
    : rect.top + rect.height / 2;

  triggerThemeRipple(x, y, next);
  applyTheme(next, true);
}

if (themeToggle) {
  themeToggle.addEventListener("click", toggleTheme);
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
    item.addEventListener("click", closeMenu);
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

function setFieldError(field, message) {
  if (!field) return;
  const wrapper = field.closest(".form-field");
  if (!wrapper) return;

  const error = wrapper.querySelector(".error-message");

  wrapper.classList.toggle("invalid", Boolean(message));
  if (message) {
    field.setAttribute("aria-invalid", "true");
  } else {
    field.removeAttribute("aria-invalid");
  }
  if (error) {
    error.textContent = message;
  }
}

function validateContactForm() {
  if (!contactForm) return false;

  const name = contactForm.elements.name;
  const email = contactForm.elements.email;
  const message = contactForm.elements.message;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  let isValid = true;

  setFieldError(name, "");
  setFieldError(email, "");
  setFieldError(message, "");

  if (message.value.trim().length < 10) {
    setFieldError(message, "Message should be at least 10 characters.");
    isValid = false;
  }

  if (!emailPattern.test(email.value.trim())) {
    setFieldError(email, "Please enter a valid email address.");
    isValid = false;
  }

  if (name.value.trim().length < 2) {
    setFieldError(name, "Please enter your name.");
    isValid = false;
  }

  if (!isValid) {
    const firstInvalid = contactForm.querySelector(
      ".form-field.invalid input, .form-field.invalid textarea"
    );
    if (firstInvalid) firstInvalid.focus();
  }

  return isValid;
}

if (contactForm) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const status = contactForm.querySelector(".form-status");
    const submitButton = contactForm.querySelector(".submit-btn");
    const btnText = submitButton ? submitButton.querySelector(".btn-text") : null;

    if (!validateContactForm()) {
      status.classList.remove("success");
      status.classList.add("error");
      status.textContent = "Please fix the highlighted fields.";
      return;
    }

    submitButton.disabled = true;
    submitButton.classList.add("is-loading");
    if (btnText) btnText.textContent = "Sending...";
    status.classList.remove("success", "error");
    status.textContent = "";

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
      setFieldError(contactForm.elements.name, "");
      setFieldError(contactForm.elements.email, "");
      setFieldError(contactForm.elements.message, "");
      status.classList.remove("error");
      status.classList.add("success");
      status.textContent = "Message sent successfully.";
    } catch (error) {
      status.classList.remove("success");
      status.classList.add("error");
      status.textContent = "Message could not be sent. Please try again.";
    } finally {
      submitButton.disabled = false;
      submitButton.classList.remove("is-loading");
      if (btnText) btnText.textContent = "Submit Message";
    }
  });

  contactForm.querySelectorAll("input, textarea").forEach((field) => {
    field.addEventListener("input", () => {
      setFieldError(field, "");
      const status = contactForm.querySelector(".form-status");
      if (status) {
        status.classList.remove("success", "error");
        status.textContent = "";
      }
    });
  });
}
