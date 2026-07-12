(function () {
  const services = window.siteServices || [];
  const heroImage = document.querySelector("#heroImage");
  const heroImageTitle = document.querySelector("#heroImageTitle");
  const heroImageCount = document.querySelector("#heroImageCount");
  const heroBadge = document.querySelector("#heroBadge");
  const heroTitle = document.querySelector("#heroTitle");
  const heroText = document.querySelector("#heroText");
  const cards = document.querySelectorAll("[data-hero-service-index]");
  const revealItems = document.querySelectorAll(".reveal-on-scroll");
  const catalogButtons = document.querySelectorAll("[data-catalog-image]");
  const catalogModal = document.querySelector("#catalogModal");
  const catalogModalImage = document.querySelector("#catalogModalImage");
  const catalogModalTitle = document.querySelector("#catalogModalTitle");
  const catalogModalCategory = document.querySelector("#catalogModalCategory");
  const catalogCloseButtons = document.querySelectorAll("[data-catalog-close]");

  if (services.length && heroImage && cards.length) {
    let activeIndex = 0;
    let timer;

    function setHero(index) {
      activeIndex = (index + services.length) % services.length;
      const service = services[activeIndex];

      heroImage.style.opacity = "0";
      window.setTimeout(() => {
        heroImage.src = service.image_url;
        heroImageTitle.textContent = service.name;
        heroImageCount.textContent = `${activeIndex + 1} / ${services.length}`;
        heroBadge.textContent = service.name;
        heroTitle.textContent = service.headline;
        heroText.textContent = service.description;
        cards.forEach((card) => {
          card.classList.toggle("active", Number(card.dataset.heroServiceIndex) === activeIndex);
        });
        heroImage.style.opacity = "1";
      }, 140);
    }

    function restartSlider() {
      window.clearInterval(timer);
      timer = window.setInterval(() => setHero(activeIndex + 1), 5200);
    }

    cards.forEach((card) => {
      const index = Number(card.dataset.heroServiceIndex);
      card.addEventListener("mouseenter", () => {
        setHero(index);
        restartSlider();
      });
      card.addEventListener("focus", () => {
        setHero(index);
        restartSlider();
      });
    });

    setHero(0);
    restartSlider();
  }

  if (catalogModal && catalogModalImage && catalogModalTitle && catalogModalCategory) {
    function closeCatalog() {
      catalogModal.classList.remove("is-open");
      catalogModal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("modal-open");
      catalogModalImage.src = "";
    }

    catalogButtons.forEach((button) => {
      button.addEventListener("click", () => {
        catalogModalImage.src = button.dataset.catalogImage;
        catalogModalImage.alt = button.dataset.catalogTitle || "";
        catalogModalTitle.textContent = button.dataset.catalogTitle || "";
        catalogModalCategory.textContent = button.dataset.catalogCategory || "";
        catalogModal.classList.add("is-open");
        catalogModal.setAttribute("aria-hidden", "false");
        document.body.classList.add("modal-open");
      });
    });

    catalogCloseButtons.forEach((button) => {
      button.addEventListener("click", closeCatalog);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && catalogModal.classList.contains("is-open")) {
        closeCatalog();
      }
    });
  }

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.22 });

    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }
})();
