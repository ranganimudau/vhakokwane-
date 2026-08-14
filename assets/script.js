/* ==========================================================================
   Vhakokwane Architects & Projects — site interactivity
   Vanilla JS, no build step, no dependencies.
   ========================================================================== */
(() => {
  "use strict";

  /* ---- Project / gallery data --------------------------------------------- */
  const projects = [
    { img: "assets/images/project-01.jpg", title: "Modern Garage Villa", category: "Residential" },
    { img: "assets/images/project-02.jpg", title: "Pool House Retreat", category: "Luxury Living" },
    { img: "assets/images/project-03.jpg", title: "Contemporary Courtyard", category: "Residential" },
    { img: "assets/images/project-04.jpg", title: "Sculptural Estate", category: "Luxury Living" },
    { img: "assets/images/project-05.jpg", title: "Dark Modern Facade", category: "Residential" },
    { img: "assets/images/project-06.jpg", title: "Pool & Sculpture Estate", category: "Luxury Living" },
    { img: "assets/images/project-07.jpg", title: "Indoor-Outdoor Living", category: "Interior" },
    { img: "assets/images/project-08.jpg", title: "Pitched Roof Elegance", category: "Residential" },
    { img: "assets/images/project-09.jpg", title: "White Modern Villa", category: "Residential" },
    { img: "assets/images/project-10.jpg", title: "Modern Lounge Interior", category: "Interior" },
    { img: "assets/images/project-11.jpg", title: "Garden Pavilion", category: "Outdoor Living" },
    { img: "assets/images/project-12.jpg", title: "Glass Facade Villa", category: "Luxury Living" },
    { img: "assets/images/project-13.jpg", title: "Contemporary Facade", category: "Residential" },
    { img: "assets/images/project-14.jpg", title: "Celtic Meadows Estate", category: "Residential" },
    { img: "assets/images/project-15.jpg", title: "Artistic Entrance", category: "Residential" },
    { img: "assets/images/project-16.jpg", title: "Evening Exterior", category: "Residential" },
    { img: "assets/images/project-17.jpg", title: "Industrial Modern", category: "Commercial" },
    { img: "assets/images/project-18.jpg", title: "Aerial Pool View", category: "Luxury Living" }
  ];

  const expandIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>`;

  const galleryGrid = document.getElementById("galleryGrid");
  if (galleryGrid) {
    galleryGrid.innerHTML = projects.map((p, i) => `
      <div class="gallery-item" data-category="${p.category}" data-index="${i}" data-reveal="fade" data-reveal-delay="${(i % 4) + 1}">
        <img src="${p.img}" alt="${p.title} — ${p.category} project by Vhakokwane Architects & Projects" loading="lazy" width="640" height="800" />
        <span class="gallery-expand">${expandIcon}</span>
        <div class="gallery-overlay">
          <span class="gallery-cat">${p.category}</span>
          <h3 class="gallery-title">${p.title}</h3>
        </div>
      </div>
    `).join("");
  }

  /* ---- Preloader ------------------------------------------------------------ */
  window.addEventListener("load", () => {
    document.getElementById("preloader")?.classList.add("is-hidden");
  });

  /* ---- Header scroll state + active link tracking --------------------------- */
  const header = document.getElementById("siteHeader");
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(".nav-desktop a");

  const onScroll = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 40);

    let current = "";
    sections.forEach((sec) => {
      const top = sec.offsetTop - 140;
      if (window.scrollY >= top) current = sec.id;
    });
    navLinks.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${current}`);
    });

    document.getElementById("toTop")?.classList.toggle("is-visible", window.scrollY > 600);
  };
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- Mobile nav ------------------------------------------------------------ */
  const navToggle = document.getElementById("navToggle");
  const mobileNav = document.getElementById("mobileNav");

  const closeMobileNav = () => {
    navToggle.classList.remove("is-open");
    mobileNav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  };

  navToggle?.addEventListener("click", () => {
    const open = mobileNav.classList.toggle("is-open");
    navToggle.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
  });

  mobileNav?.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMobileNav));

  /* ---- Back to top ------------------------------------------------------------ */
  document.getElementById("toTop")?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ---- Scroll-reveal via IntersectionObserver --------------------------------- */
  const revealTargets = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });
    revealTargets.forEach((el) => revealObserver.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---- Animated stat counters -------------------------------------------------- */
  const counters = document.querySelectorAll("[data-count]");
  const animateCount = (el) => {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || "";
    const duration = 1600;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if ("IntersectionObserver" in window && counters.length) {
    const countObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          countObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach((el) => countObserver.observe(el));
  }

  /* ---- Portfolio filtering ------------------------------------------------------ */
  const filterButtons = document.querySelectorAll(".filter-btn");
  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterButtons.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      const filter = btn.dataset.filter;

      document.querySelectorAll(".gallery-item").forEach((item) => {
        const match = filter === "all" || item.dataset.category === filter;
        item.classList.toggle("is-hidden", !match);
      });
    });
  });

  /* ---- Lightbox ------------------------------------------------------------------ */
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxTitle = document.getElementById("lightboxTitle");
  const lightboxCat = document.getElementById("lightboxCat");
  let activeIndex = 0;

  const visibleItems = () => Array.from(document.querySelectorAll(".gallery-item:not(.is-hidden)"));

  const openLightbox = (index) => {
    const items = visibleItems();
    activeIndex = index;
    const p = projects[Number(items[activeIndex].dataset.index)];
    lightboxImg.src = p.img;
    lightboxImg.alt = p.title;
    lightboxTitle.textContent = p.title;
    lightboxCat.textContent = p.category;
    lightbox.classList.add("is-open");
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    lightbox.classList.remove("is-open");
    document.body.style.overflow = "";
  };

  const stepLightbox = (dir) => {
    const items = visibleItems();
    activeIndex = (activeIndex + dir + items.length) % items.length;
    openLightbox(activeIndex);
  };

  galleryGrid?.addEventListener("click", (e) => {
    const item = e.target.closest(".gallery-item");
    if (!item) return;
    const items = visibleItems();
    const idx = items.indexOf(item);
    if (idx > -1) openLightbox(idx);
  });

  document.getElementById("lightboxClose")?.addEventListener("click", closeLightbox);
  document.getElementById("lightboxPrev")?.addEventListener("click", () => stepLightbox(-1));
  document.getElementById("lightboxNext")?.addEventListener("click", () => stepLightbox(1));
  lightbox?.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });

  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("is-open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") stepLightbox(-1);
    if (e.key === "ArrowRight") stepLightbox(1);
  });

  /* ---- Toast helper ---------------------------------------------------------------- */
  const toast = document.getElementById("toast");
  const toastMsg = document.getElementById("toastMsg");
  let toastTimer;
  const showToast = (msg) => {
    toastMsg.textContent = msg;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 3200);
  };

  /* ---- Contact form -> WhatsApp handoff --------------------------------------------- */
  const WHATSAPP_NUMBER = "27723662375";
  const contactForm = document.getElementById("contactForm");

  contactForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }

    const data = new FormData(contactForm);
    const name = data.get("name");
    const phone = data.get("phone");
    const email = data.get("email");
    const service = data.get("service");
    const message = data.get("message");

    const text =
      `Hi Vhakokwane Architects, my name is ${name}.\n\n` +
      `Project type: ${service}\n` +
      `Phone: ${phone}\n` +
      `Email: ${email}\n\n` +
      `${message}`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    showToast("Message ready — opening WhatsApp…");
    window.open(url, "_blank", "noopener");
    contactForm.reset();
  });

  /* ---- Footer year ------------------------------------------------------------------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
