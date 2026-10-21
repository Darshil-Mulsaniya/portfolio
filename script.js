
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  // 1. Page loader
  const loader = document.getElementById("loader");

  const hideLoader = () => {
    if (loader) loader.classList.add("loaded");
  };

  window.addEventListener("load", hideLoader, { once: true });
  // Fallback in case the load event has already fired.
  if (document.readyState === "complete") hideLoader();

  // 2. Dynamic copyright year
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // 3. Mobile navigation
  const menuToggle = document.getElementById("menuToggle");
  const nav = document.getElementById("nav");

  function closeMenu() {
    if (!nav || !menuToggle) return;

    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
    document.body.classList.remove("menu-open");
  }

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");

      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.innerHTML = isOpen
        ? '<i class="fa-solid fa-xmark"></i>'
        : '<i class="fa-solid fa-bars"></i>';

      document.body.classList.toggle("menu-open", isOpen);
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 800) closeMenu();
    });
  }

  // 4. Reveal elements as they enter the viewport
  const revealElements = document.querySelectorAll(".reveal");

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if ("IntersectionObserver" in window && !reduceMotion) {
    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            currentObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -35px 0px"
      }
    );

    revealElements.forEach((element) => observer.observe(element));
  } else {
    revealElements.forEach((element) => {
      element.classList.add("visible");
    });
  }

  // 5. Portfolio category filtering
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selectedFilter = button.dataset.filter;

      filterButtons.forEach((item) => {
        const active = item === button;
        item.classList.toggle("active", active);
        item.setAttribute("aria-pressed", String(active));
      });

      projectCards.forEach((card) => {
        const matches =
          selectedFilter === "all" ||
          card.dataset.category === selectedFilter;

        card.classList.toggle("hidden", !matches);
      });
    });

    button.setAttribute(
      "aria-pressed",
      String(button.classList.contains("active"))
    );
  });

  // 6. Active navigation link
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          navLinks.forEach((link) => {
            const active =
              link.getAttribute("href") === `#${entry.target.id}`;

            link.classList.toggle("active", active);
          });
        });
      },
      {
        rootMargin: "-30% 0px -60% 0px"
      }
    );

    sections.forEach((section) => sectionObserver.observe(section));
  }

  // 7. Client enquiry form
  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");

  // IMPORTANT: Replace this with your real business email address.
  const ownerEmail = "darshil.developer@gmail.com";

  if (contactForm && formStatus) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      formStatus.textContent = "";

      if (!contactForm.reportValidity()) return;

      const formData = new FormData(contactForm);

      const name = String(formData.get("name") || "").trim();
      const email = String(formData.get("email") || "").trim();
      const project = String(formData.get("project") || "").trim();
      const budget = String(formData.get("budget") || "").trim();
      const message = String(formData.get("message") || "").trim();

      if (!name || !email || !project || !message) {
        formStatus.textContent =
          "Please complete all required fields.";
        return;
      }

      // Encode the content for a mailto link.
      // The visitor's email address is included in the reply-to
      // information in the message body, not as a mailto header.
      const subject = `New website enquiry: ${project}`;

      const body = [
        "NEW WEBSITE PROJECT ENQUIRY",
        "",
        `Name: ${name}`,
        `Email: ${email}`,
        `Project type: ${project}`,
        `Budget: ${budget || "Not specified"}`,
        "",
        "Project details:",
        message
      ].join("\n");

      const mailtoURL =
        `mailto:${ownerEmail}` +
        `?subject=${encodeURIComponent(subject)}` +
        `&body=${encodeURIComponent(body)}`;

      formStatus.textContent =
        "Opening your email application. Please send the prepared message to complete your enquiry.";

      // Opens the visitor's configured email application.
      window.location.href = mailtoURL;
    });
  }
});
