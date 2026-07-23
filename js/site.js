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
  const catalogButtons = document.querySelectorAll("[data-catalog-pdf]");
  const catalogModal = document.querySelector("#catalogModal");
  const catalogModalFrame = document.querySelector("#catalogModalFrame");
  const catalogModalTitle = document.querySelector("#catalogModalTitle");
  const catalogModalCategory = document.querySelector("#catalogModalCategory");
  const catalogModalExternal = document.querySelector("#catalogModalExternal");
  const catalogModalDownload = document.querySelector("#catalogModalDownload");
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
  const visionSliders = document.querySelectorAll("[data-vision-slider]");
  const materialLabs = document.querySelectorAll("[data-material-lab]");
  const eventHero = document.querySelector("[data-event-hero]");
  const eventHeader = document.querySelector(".event-header");
  const eventCards = document.querySelectorAll("[data-event-card]");
  const eventFireworks = document.querySelector("[data-event-fireworks]");
  const eventSortableGrids = document.querySelectorAll("[data-event-sortable-grid]");
  const projectCategoryLinks = document.querySelectorAll(".projects-category-bar a[href^='#']");
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

  visionSliders.forEach((slider) => {
    const visionImage = slider.querySelector("[data-vision-image]");
    const visionImagesScript = slider.querySelector("[data-vision-images]");
    const visionButtons = slider.querySelectorAll("[data-vision-direction]");

    if (!visionImage || !visionImagesScript) {
      return;
    }

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
  });

  materialLabs.forEach((lab) => {
    const stage = lab.querySelector(".decor-material-stage");
    const image = lab.querySelector("[data-material-image]:not(button)");
    const title = lab.querySelector("[data-material-title]:not(button)");
    const link = lab.querySelector("[data-material-link]");
    const counter = lab.querySelector("[data-material-counter]");
    const options = Array.from(lab.querySelectorAll("[data-material-option]"));
    let changeTimer;

    if (!stage || !image || !title || !link || !options.length) {
      return;
    }

    options.forEach((option, index) => {
      option.addEventListener("click", () => {
        if (option.classList.contains("is-active")) {
          return;
        }

        options.forEach((entry) => {
          const isCurrent = entry === option;
          entry.classList.toggle("is-active", isCurrent);
          entry.setAttribute("aria-pressed", String(isCurrent));
        });

        stage.classList.add("is-changing");
        window.clearTimeout(changeTimer);
        changeTimer = window.setTimeout(() => {
          image.src = option.dataset.materialImage || image.src;
          image.alt = option.dataset.materialTitle || "";
          title.textContent = option.dataset.materialTitle || "";
          link.href = option.dataset.materialUrl || "#";
          if (counter) {
            counter.textContent = String(index + 1).padStart(2, "0");
          }
          stage.classList.remove("is-changing");
        }, 260);
      });
    });
  });

  if (eventHeader) {
    const updateEventHeader = () => {
      eventHeader.classList.toggle("is-event-scrolled", window.scrollY > 40);
    };

    updateEventHeader();
    window.addEventListener("scroll", updateEventHeader, { passive: true });
  }

  if (
    eventFireworks
    && !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    const context = eventFireworks.getContext("2d");
    const particles = [];
    const rockets = [];
    const colors = ["#ff5d3d", "#ffb340", "#a34dff", "#38d9ff", "#fff2b8", "#ff55a5"];
    const startTime = performance.now();
    const showDuration = 4200;
    let lastBurst = 0;
    let animationFrame;

    const resizeFireworks = () => {
      const bounds = eventFireworks.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      eventFireworks.width = Math.max(1, Math.round(bounds.width * ratio));
      eventFireworks.height = Math.max(1, Math.round(bounds.height * ratio));
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const createBurst = (x, y, color) => {
      const count = 44 + Math.floor(Math.random() * 28);

      for (let index = 0; index < count; index += 1) {
        const angle = (Math.PI * 2 * index) / count + Math.random() * 0.13;
        const speed = 1.4 + Math.random() * 4.2;
        particles.push({
          x,
          y,
          previousX: x,
          previousY: y,
          velocityX: Math.cos(angle) * speed,
          velocityY: Math.sin(angle) * speed,
          life: 1,
          decay: 0.011 + Math.random() * 0.013,
          color,
          size: 1 + Math.random() * 1.7,
        });
      }
    };

    const launchRocket = () => {
      const width = eventFireworks.clientWidth;
      const height = eventFireworks.clientHeight;
      const x = width * (0.12 + Math.random() * 0.76);

      rockets.push({
        x,
        y: height + 20,
        previousX: x,
        previousY: height + 20,
        velocityX: -0.45 + Math.random() * 0.9,
        velocityY: -(7.5 + Math.random() * 3),
        targetY: height * (0.12 + Math.random() * 0.35),
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    };

    const drawFireworks = (time) => {
      const elapsed = time - startTime;
      context.globalCompositeOperation = "source-over";
      context.clearRect(0, 0, eventFireworks.clientWidth, eventFireworks.clientHeight);
      context.globalCompositeOperation = "lighter";

      if (elapsed < 3100 && time - lastBurst > 520 + Math.random() * 260) {
        launchRocket();
        if (Math.random() > 0.55) {
          window.setTimeout(launchRocket, 150);
        }
        lastBurst = time;
      }

      for (let index = rockets.length - 1; index >= 0; index -= 1) {
        const rocket = rockets[index];
        rocket.previousX = rocket.x;
        rocket.previousY = rocket.y;
        rocket.x += rocket.velocityX;
        rocket.y += rocket.velocityY;
        rocket.velocityY += 0.018;

        context.beginPath();
        context.moveTo(rocket.previousX, rocket.previousY + 18);
        context.lineTo(rocket.x, rocket.y);
        context.strokeStyle = rocket.color;
        context.globalAlpha = .9;
        context.lineWidth = 2.2;
        context.stroke();

        context.beginPath();
        context.arc(rocket.x, rocket.y, 2.6, 0, Math.PI * 2);
        context.fillStyle = "#fff";
        context.fill();

        if (rocket.y <= rocket.targetY || rocket.velocityY >= -1.5) {
          createBurst(rocket.x, rocket.y, rocket.color);
          rockets.splice(index, 1);
        }
      }

      for (let index = particles.length - 1; index >= 0; index -= 1) {
        const particle = particles[index];
        particle.previousX = particle.x;
        particle.previousY = particle.y;
        particle.velocityX *= 0.985;
        particle.velocityY = (particle.velocityY * 0.985) + 0.035;
        particle.x += particle.velocityX;
        particle.y += particle.velocityY;
        particle.life -= particle.decay;

        context.beginPath();
        context.moveTo(particle.previousX, particle.previousY);
        context.lineTo(particle.x, particle.y);
        context.strokeStyle = particle.color;
        context.globalAlpha = Math.max(0, particle.life);
        context.lineWidth = particle.size;
        context.stroke();

        if (particle.life <= 0) {
          particles.splice(index, 1);
        }
      }

      context.globalAlpha = 1;
      if (elapsed < showDuration || particles.length || rockets.length) {
        animationFrame = window.requestAnimationFrame(drawFireworks);
      } else {
        eventFireworks.classList.add("is-finished");
        window.setTimeout(() => {
          eventFireworks.hidden = true;
        }, 950);
      }
    };

    resizeFireworks();
    launchRocket();
    window.setTimeout(launchRocket, 180);
    window.addEventListener("resize", resizeFireworks, { passive: true });
    animationFrame = window.requestAnimationFrame(drawFireworks);

    window.addEventListener("pagehide", () => {
      window.cancelAnimationFrame(animationFrame);
    }, { once: true });
  } else if (eventFireworks) {
    eventFireworks.hidden = true;
  }

  if (
    eventHero
    && window.matchMedia("(pointer: fine)").matches
    && !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    const heroImage = eventHero.querySelector(":scope > img");
    const heroCopy = eventHero.querySelector(".event-hero-copy");

    eventHero.addEventListener("mousemove", (event) => {
      const bounds = eventHero.getBoundingClientRect();
      const x = ((event.clientX - bounds.left) / bounds.width) - 0.5;
      const y = ((event.clientY - bounds.top) / bounds.height) - 0.5;

      if (heroImage) {
        heroImage.style.setProperty("translate", `${x * -12}px ${y * -8}px`);
      }
      if (heroCopy) {
        heroCopy.style.transform = `translate3d(${x * 10}px, ${y * 7}px, 0)`;
      }
    }, { passive: true });

    eventHero.addEventListener("mouseleave", () => {
      if (heroImage) {
        heroImage.style.removeProperty("translate");
      }
      if (heroCopy) {
        heroCopy.style.transform = "";
      }
    });
  }

  if (
    eventCards.length
    && window.matchMedia("(pointer: fine)").matches
    && !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    eventCards.forEach((card) => {
      card.addEventListener("mousemove", (event) => {
        const bounds = card.getBoundingClientRect();
        card.style.setProperty("--event-card-x", `${event.clientX - bounds.left}px`);
        card.style.setProperty("--event-card-y", `${event.clientY - bounds.top}px`);
      }, { passive: true });
    });
  }

  eventSortableGrids.forEach((grid) => {
    const storageKey = `afaaqEventOrder:${document.documentElement.lang}:${grid.dataset.eventSortKey || "section"}`;
    let draggedCard = null;
    let didDrag = false;

    const saveOrder = () => {
      const order = Array.from(grid.querySelectorAll("[data-event-sort-id]"))
        .map((card) => card.dataset.eventSortId);
      window.localStorage.setItem(storageKey, JSON.stringify(order));
    };

    try {
      const savedOrder = JSON.parse(window.localStorage.getItem(storageKey) || "[]");
      const cardsById = new Map(
        Array.from(grid.querySelectorAll("[data-event-sort-id]"))
          .map((card) => [card.dataset.eventSortId, card])
      );
      savedOrder.forEach((id) => {
        if (cardsById.has(id)) {
          grid.appendChild(cardsById.get(id));
        }
      });
    } catch (error) {
      window.localStorage.removeItem(storageKey);
    }

    grid.addEventListener("dragstart", (event) => {
      const card = event.target.closest("[data-event-sort-id]");
      if (!card) {
        return;
      }

      draggedCard = card;
      didDrag = true;
      grid.classList.add("is-reordering");
      card.classList.add("is-dragging");
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", card.dataset.eventSortId || "");
    });

    grid.addEventListener("dragover", (event) => {
      event.preventDefault();
      const target = event.target.closest("[data-event-sort-id]");
      if (!draggedCard || !target || target === draggedCard) {
        return;
      }

      grid.querySelectorAll(".is-drag-target").forEach((card) => {
        card.classList.remove("is-drag-target");
      });
      target.classList.add("is-drag-target");

      const bounds = target.getBoundingClientRect();
      const insertAfter = event.clientX > bounds.left + (bounds.width / 2);
      grid.insertBefore(draggedCard, insertAfter ? target.nextSibling : target);
    });

    grid.addEventListener("drop", (event) => {
      event.preventDefault();
      saveOrder();
    });

    grid.addEventListener("dragend", () => {
      grid.classList.remove("is-reordering");
      grid.querySelectorAll(".is-dragging, .is-drag-target").forEach((card) => {
        card.classList.remove("is-dragging", "is-drag-target");
      });
      saveOrder();
      window.setTimeout(() => {
        didDrag = false;
      }, 0);
      draggedCard = null;
    });

    grid.addEventListener("click", (event) => {
      const handle = event.target.closest("[data-event-drag-handle]");
      const card = event.target.closest("[data-event-sort-id]");

      if (handle && card) {
        event.preventDefault();
        const cards = Array.from(grid.querySelectorAll("[data-event-sort-id]"));
        const cardIndex = cards.indexOf(card);
        const nextCard = cards[cardIndex + 1] || cards[0];
        if (nextCard && nextCard !== card) {
          grid.insertBefore(card, nextCard === cards[0] ? cards[0] : nextCard.nextSibling);
          saveOrder();
        }
        return;
      }

      if (didDrag) {
        event.preventDefault();
      }
    });

    grid.addEventListener("keydown", (event) => {
      const handle = event.target.closest("[data-event-drag-handle]");
      if (!handle || !["Enter", " ", "ArrowLeft", "ArrowRight"].includes(event.key)) {
        return;
      }

      event.preventDefault();
      handle.click();
    });
  });

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

  projectCategoryLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const target = document.querySelector(link.getAttribute("href"));

      if (!target) {
        return;
      }

      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.pushState(null, "", link.getAttribute("href"));
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

  if (catalogModal && catalogModalFrame && catalogModalTitle && catalogModalCategory) {
    let lastCatalogTrigger = null;

    function closeCatalog() {
      catalogModal.classList.remove("is-open");
      catalogModal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("modal-open");
      catalogModalFrame.src = "about:blank";
      lastCatalogTrigger?.focus();
    }

    catalogButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const pdfUrl = button.dataset.catalogPdf;

        lastCatalogTrigger = button;
        catalogModalFrame.src = `${pdfUrl}#view=FitH`;
        catalogModalTitle.textContent = button.dataset.catalogTitle || "";
        catalogModalCategory.textContent = button.dataset.catalogCategory || "";
        catalogModalExternal?.setAttribute("href", pdfUrl);
        catalogModalDownload?.setAttribute("href", pdfUrl);
        catalogModal.classList.add("is-open");
        catalogModal.setAttribute("aria-hidden", "false");
        document.body.classList.add("modal-open");
        window.setTimeout(() => catalogModal.querySelector("[data-catalog-close]")?.focus(), 50);
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
