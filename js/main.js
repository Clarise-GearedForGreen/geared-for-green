document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector(".nav");
  const toggle = document.querySelector(".nav__toggle");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("nav--open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });
    nav.querySelectorAll(".nav__links a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("nav--open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  const year = document.querySelector("[data-year]");
  if (year) year.textContent = new Date().getFullYear();

  const revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length) {
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
      );
      revealEls.forEach((el) => observer.observe(el));
    } else {
      revealEls.forEach((el) => el.classList.add("is-visible"));
    }
  }

  // Like .reveal, but toggles is-visible on every crossing instead of
  // unobserving after the first -- used where an exit animation matters.
  const toggleEls = document.querySelectorAll(".reveal-toggle");
  if (toggleEls.length) {
    if ("IntersectionObserver" in window) {
      const toggleObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            entry.target.classList.toggle("is-visible", entry.isIntersecting);
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
      );
      toggleEls.forEach((el) => toggleObserver.observe(el));
    } else {
      toggleEls.forEach((el) => el.classList.add("is-visible"));
    }
  }

  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = contactForm.name.value.trim();
      const email = contactForm.email.value.trim();
      const organization = contactForm.organization.value.trim();
      const type = contactForm.type.value.trim();
      const message = contactForm.message.value.trim();

      const subject = `Event inquiry from ${name}`;
      const bodyLines = [
        `Name: ${name}`,
        `Email: ${email}`,
        organization ? `Organization: ${organization}` : null,
        type ? `Event/venue type: ${type}` : null,
        "",
        message,
      ].filter((line) => line !== null);

      const mailto = `mailto:info@championsforgreen.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join("\n"))}`;
      window.location.href = mailto;
    });
  }

  const quoteForm = document.getElementById("quote-form");
  if (quoteForm) {
    quoteForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = quoteForm.name.value.trim();
      const organization = quoteForm.organization.value.trim();
      const qty = quoteForm.qty.value.trim();
      const message = quoteForm.message.value.trim();
      const products = Array.from(quoteForm.querySelectorAll('input[name="product"]:checked')).map(
        (input) => input.value
      );

      const subject = `Apparel quote request from ${name}`;
      const bodyLines = [
        `Name: ${name}`,
        organization ? `Organization: ${organization}` : null,
        products.length ? `Product type: ${products.join(", ")}` : null,
        qty ? `Quantity: ${qty}` : null,
        "",
        message,
      ].filter((line) => line !== null);

      const mailto = `mailto:mainedm@gearedforgreen.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join("\n"))}`;
      window.location.href = mailto;
    });
  }
});
