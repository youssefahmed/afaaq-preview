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
  const themePickers = document.querySelectorAll("[data-theme-picker]");
  const decorHeader = document.querySelector("[data-decor-header]");
  const decorDepthItems = document.querySelectorAll("[data-decor-depth]");
  const projectsToggle = document.querySelector("[data-projects-toggle]");
  const projectMediaModal = document.querySelector("[data-project-media-modal]");
  const projectMediaItemsScript = document.querySelector("[data-project-media-items]");
  const uploadPreviewInputs = document.querySelectorAll("[data-upload-preview-input]");
  const scrollTopButtons = document.querySelectorAll("[data-scroll-top]");
  const decorAnchorLinks = document.querySelectorAll(".decor-shell a[href*='#']");
  const visionImage = document.querySelector("#visionImage");
  const visionImagesScript = document.querySelector("#visionImages");
  const visionButtons = document.querySelectorAll("[data-vision-direction]");
  const themeNames = ["dark", "green", "white", "gold"];
  const isArabic = document.documentElement.lang !== "en";
  const i18n = {
    videoSoon: isArabic ? "سيتم إضافة فيديو المشروع من لوحة الإدارة" : "The project video will be added from the dashboard",
    noFiles: isArabic ? "لم يتم اختيار ملفات" : "No files selected",
    selectedCount: (count) => isArabic ? `${count} ملف محدد` : `${count} files selected`,
    removeFile: (name) => isArabic ? `حذف ${name}` : `Remove ${name}`,
  };

  function applyTheme(theme) {
    const selectedTheme = themeNames.includes(theme) ? theme : "dark";

    themeNames.forEach((themeName) => {
      document.body.classList.toggle(`theme-${themeName}`, themeName === selectedTheme);
    });

    themePickers.forEach((picker) => {
      picker.value = selectedTheme;
      picker.closest(".theme-select")?.setAttribute("data-theme-value", selectedTheme);
    });

    window.localStorage.setItem("afaaqTheme", selectedTheme);
  }

  if (themePickers.length) {
    applyTheme(window.localStorage.getItem("afaaqTheme") || "dark");

    themePickers.forEach((picker) => {
      picker.addEventListener("change", () => applyTheme(picker.value));
    });
  }

  if (decorHeader) {
    const setDecorHeaderState = () => {
      decorHeader.classList.toggle("is-scrolled", window.scrollY > 24);
    };

    setDecorHeaderState();
    window.addEventListener("scroll", setDecorHeaderState, { passive: true });
  }

  if (
    decorDepthItems.length
    && window.matchMedia("(pointer: fine)").matches
    && !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    window.addEventListener("mousemove", (event) => {
      const x = (event.clientX / window.innerWidth) - 0.5;
      const y = (event.clientY / window.innerHeight) - 0.5;

      decorDepthItems.forEach((item) => {
        const depth = Number(item.dataset.decorDepth || 0);
        item.style.setProperty("--decor-parallax-x", `${x * depth}px`);
        item.style.setProperty("--decor-parallax-y", `${y * depth}px`);
        item.style.transform = `translate3d(var(--decor-parallax-x), var(--decor-parallax-y), 0)`;
      });
    }, { passive: true });
  }

  if (projectsToggle) {
    projectsToggle.addEventListener("click", () => {
      document.querySelectorAll(".decor-project-showcase-card.is-hidden").forEach((card) => {
        card.classList.remove("is-hidden");
      });
      projectsToggle.remove();
    });
  }

  if (visionImage && visionImagesScript) {
    const images = JSON.parse(visionImagesScript.textContent || "[]").filter(Boolean);
    let activeVisionImage = Math.max(0, images.indexOf(visionImage.getAttribute("src")));
    let visionTimer;

    function setVisionImage(index) {
      if (!images.length) {
        return;
      }

      activeVisionImage = (index + images.length) % images.length;
      visionImage.style.opacity = "0";

      window.setTimeout(() => {
        visionImage.src = images[activeVisionImage];
        visionImage.style.opacity = "1";
      }, 180);
    }

    function startVisionTimer() {
      if (images.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      window.clearInterval(visionTimer);
      visionTimer = window.setInterval(() => setVisionImage(activeVisionImage + 1), 4200);
    }

    visionButtons.forEach((button) => {
      button.addEventListener("click", () => {
        setVisionImage(activeVisionImage + Number(button.dataset.visionDirection || 1));
        startVisionTimer();
      });
    });

    startVisionTimer();
  }

  function scrollDecorTargetToComfortPosition(target, behavior = "smooth") {
    const header = document.querySelector("[data-decor-header]");
    const headerHeight = header?.getBoundingClientRect().height || 0;
    const targetTop = target.getBoundingClientRect().top + window.scrollY;
    const targetOffset = window.innerHeight <= 700 ? 96 : Math.round(window.innerHeight * 0.24);
    const targetPosition = Math.max(0, targetTop - targetOffset - Math.min(headerHeight, 92));

    window.scrollTo({ top: targetPosition, behavior });
  }

  decorAnchorLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const url = new URL(link.href, window.location.href);
      const currentPath = window.location.pathname.replace(/\/$/, "");
      const targetPath = url.pathname.replace(/\/$/, "");

      if (targetPath !== currentPath || !url.hash) {
        return;
      }

      const target = document.querySelector(url.hash);

      if (!target) {
        return;
      }

      event.preventDefault();
      scrollDecorTargetToComfortPosition(target);
      window.history.pushState(null, "", url.hash);
    });
  });

  if (window.location.hash && document.body.classList.contains("decor-identity-page")) {
    window.setTimeout(() => {
      const target = document.querySelector(window.location.hash);
      if (target) {
        scrollDecorTargetToComfortPosition(target);
      }
    }, 120);
  }

  if (projectMediaModal && projectMediaItemsScript) {
    const mediaItems = JSON.parse(projectMediaItemsScript.textContent || "[]");
    const stage = projectMediaModal.querySelector("[data-project-media-stage]");
    const title = projectMediaModal.querySelector("[data-project-media-title]");
    const counter = projectMediaModal.querySelector("[data-project-media-counter]");
    const closeButtons = projectMediaModal.querySelectorAll("[data-project-media-close]");
    const navButtons = projectMediaModal.querySelectorAll("[data-project-media-direction]");
    const triggers = document.querySelectorAll("[data-project-media-index]");
    let activeMediaIndex = 0;

    function renderProjectMedia(index) {
      if (!mediaItems.length) {
        return;
      }

      activeMediaIndex = (index + mediaItems.length) % mediaItems.length;
      const item = mediaItems[activeMediaIndex];
      title.textContent = item.title || "";
      counter.textContent = `${activeMediaIndex + 1} / ${mediaItems.length}`;
      stage.innerHTML = "";

      if (item.type === "video") {
        const iframe = document.createElement("iframe");
        iframe.src = item.src;
        iframe.title = item.title || "Project video";
        iframe.allowFullscreen = true;
        iframe.loading = "lazy";
        stage.appendChild(iframe);
        return;
      }

      if (item.type === "uploaded-video") {
        const video = document.createElement("video");
        video.src = item.src;
        video.controls = true;
        video.preload = "metadata";
        stage.appendChild(video);
        return;
      }

      if (item.type === "video-placeholder") {
        const placeholder = document.createElement("div");
        placeholder.className = "project-media-video-placeholder";
        placeholder.innerHTML = `<span>Video</span><strong>${i18n.videoSoon}</strong>`;
        stage.appendChild(placeholder);
        return;
      }

      const image = document.createElement("img");
      image.src = item.src;
      image.alt = item.title || "";
      stage.appendChild(image);
    }

    function openProjectMedia(index) {
      renderProjectMedia(index);
      projectMediaModal.classList.add("is-open");
      projectMediaModal.setAttribute("aria-hidden", "false");
      document.body.classList.add("modal-open");
    }

    function closeProjectMedia() {
      projectMediaModal.classList.remove("is-open");
      projectMediaModal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("modal-open");
      stage.innerHTML = "";
    }

    triggers.forEach((trigger) => {
      trigger.addEventListener("click", () => {
        openProjectMedia(Number(trigger.dataset.projectMediaIndex || 0));
      });
    });

    closeButtons.forEach((button) => button.addEventListener("click", closeProjectMedia));
    navButtons.forEach((button) => {
      button.addEventListener("click", () => {
        renderProjectMedia(activeMediaIndex + Number(button.dataset.projectMediaDirection));
      });
    });

    document.addEventListener("keydown", (event) => {
      if (!projectMediaModal.classList.contains("is-open")) {
        return;
      }

      if (event.key === "Escape") {
        closeProjectMedia();
      }

      if (event.key === "ArrowRight") {
        renderProjectMedia(activeMediaIndex - 1);
      }

      if (event.key === "ArrowLeft") {
        renderProjectMedia(activeMediaIndex + 1);
      }
    });
  }

  uploadPreviewInputs.forEach((input) => {
    const preview = input.closest("label")?.nextElementSibling?.matches("[data-upload-preview]")
      ? input.closest("label").nextElementSibling
      : null;

    if (!preview) {
      return;
    }

    let selectedFiles = [];

    function syncInputFiles() {
      if (typeof DataTransfer === "undefined") {
        return;
      }

      const transfer = new DataTransfer();
      selectedFiles.forEach((file) => transfer.items.add(file));
      input.files = transfer.files;
    }

    function renderUploadPreview() {
      preview.innerHTML = "";

      if (!selectedFiles.length) {
        const empty = document.createElement("small");
        empty.textContent = preview.dataset.emptyText || i18n.noFiles;
        preview.appendChild(empty);
        return;
      }

      const count = document.createElement("strong");
      count.className = "upload-preview-count";
      count.textContent = i18n.selectedCount(selectedFiles.length);
      preview.appendChild(count);

      const grid = document.createElement("div");
      grid.className = "upload-preview-grid";
      preview.appendChild(grid);

      selectedFiles.forEach((file, index) => {
        const item = document.createElement("div");
        item.className = "upload-preview-item";

        const image = document.createElement("img");
        image.src = URL.createObjectURL(file);
        image.alt = file.name;
        image.onload = () => URL.revokeObjectURL(image.src);

        const name = document.createElement("span");
        name.textContent = file.name;

        const remove = document.createElement("button");
        remove.type = "button";
        remove.textContent = "×";
        remove.setAttribute("aria-label", i18n.removeFile(file.name));
        remove.addEventListener("click", () => {
          selectedFiles.splice(index, 1);
          syncInputFiles();
          renderUploadPreview();
        });

        item.append(image, name, remove);
        grid.appendChild(item);
      });
    }

    input.addEventListener("change", () => {
      selectedFiles = [...input.files];
      renderUploadPreview();
    });
  });

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

  scrollTopButtons.forEach((button) => {
    button.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

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
