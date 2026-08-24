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

  const lightbox = document.getElementById("product-lightbox");
  const galleryItems = document.querySelectorAll(".product-gallery__item[data-product] img");
  if (lightbox && galleryItems.length) {
    const groups = {};
    galleryItems.forEach((img) => {
      const name = img.closest("[data-product]").dataset.product;
      if (!groups[name]) groups[name] = [];
      groups[name].push({ src: img.currentSrc || img.src, alt: img.alt });
    });

    const lightboxImg = lightbox.querySelector(".lightbox__img");
    const titleEl = lightbox.querySelector(".lightbox__title");
    const countEl = lightbox.querySelector(".lightbox__count");
    const prevBtn = lightbox.querySelector(".lightbox__nav--prev");
    const nextBtn = lightbox.querySelector(".lightbox__nav--next");
    const closeBtn = lightbox.querySelector(".lightbox__close");

    let activeGroup = null;
    let activeIndex = 0;

    const render = () => {
      const photos = groups[activeGroup];
      const photo = photos[activeIndex];
      lightboxImg.src = photo.src;
      lightboxImg.alt = photo.alt;
      titleEl.textContent = activeGroup;
      countEl.textContent = `${activeIndex + 1} / ${photos.length}`;
      prevBtn.disabled = activeIndex === 0;
      nextBtn.disabled = activeIndex === photos.length - 1;
    };

    const open = (name, index) => {
      activeGroup = name;
      activeIndex = index;
      render();
      lightbox.setAttribute("aria-hidden", "false");
    };

    const close = () => {
      lightbox.setAttribute("aria-hidden", "true");
      lightboxImg.src = "";
    };

    galleryItems.forEach((img) => {
      const item = img.closest("[data-product]");
      const name = item.dataset.product;
      const index = groups[name].findIndex((p) => p.src === (img.currentSrc || img.src));
      img.closest(".product-gallery__media").addEventListener("click", () => open(name, index));
    });

    prevBtn.addEventListener("click", () => {
      if (activeIndex > 0) {
        activeIndex -= 1;
        render();
      }
    });
    nextBtn.addEventListener("click", () => {
      if (activeIndex < groups[activeGroup].length - 1) {
        activeIndex += 1;
        render();
      }
    });
    closeBtn.addEventListener("click", close);
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) close();
    });
    document.addEventListener("keydown", (e) => {
      if (lightbox.getAttribute("aria-hidden") === "true") return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft" && !prevBtn.disabled) prevBtn.click();
      if (e.key === "ArrowRight" && !nextBtn.disabled) nextBtn.click();
    });
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
