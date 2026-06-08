const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const navItems = document.querySelectorAll(".nav-links a");
const backToTop = document.querySelector(".back-to-top");
const revealItems = document.querySelectorAll(".reveal");
const sections = document.querySelectorAll("main section[id]");
const contactForm = document.querySelector("#contactForm");

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navItems.forEach((item) => {
  item.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

revealItems.forEach((item) => revealObserver.observe(item));

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      navItems.forEach((item) => {
        item.classList.toggle("active", item.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  },
  { rootMargin: "-45% 0px -50% 0px" }
);

sections.forEach((section) => sectionObserver.observe(section));

window.addEventListener("scroll", () => {
  backToTop.classList.toggle("visible", window.scrollY > 500);
});

function setFieldError(field, message) {
  const wrapper = field.closest(".form-field");
  const error = wrapper.querySelector(".error-message");

  wrapper.classList.toggle("invalid", Boolean(message));
  error.textContent = message;
}

function validateContactForm() {
  const name = contactForm.elements.name;
  const email = contactForm.elements.email;
  const message = contactForm.elements.message;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  let isValid = true;

  setFieldError(name, "");
  setFieldError(email, "");
  setFieldError(message, "");

  if (name.value.trim().length < 2) {
    setFieldError(name, "Please enter your name.");
    isValid = false;
  }

  if (!emailPattern.test(email.value.trim())) {
    setFieldError(email, "Please enter a valid email address.");
    isValid = false;
  }

  if (message.value.trim().length < 10) {
    setFieldError(message, "Message should be at least 10 characters.");
    isValid = false;
  }

  return isValid;
}

contactForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const status = contactForm.querySelector(".form-status");
  const submitButton = contactForm.querySelector(".submit-btn");

  if (!validateContactForm()) {
    status.textContent = "Please fix the highlighted fields.";
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = "Sending...";
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
    status.textContent = "Message sent successfully.";
  } catch (error) {
    status.textContent = "Message could not be sent. Please try again.";
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Submit Message";
  }
});

contactForm.querySelectorAll("input, textarea").forEach((field) => {
  field.addEventListener("input", () => {
    setFieldError(field, "");
    contactForm.querySelector(".form-status").textContent = "";
  });
});
