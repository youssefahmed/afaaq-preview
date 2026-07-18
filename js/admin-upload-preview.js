(function () {
  const uploadPreviewInputs = document.querySelectorAll("[data-upload-preview-input]");

  uploadPreviewInputs.forEach((input) => {
    const label = input.closest("label");
    const preview = label?.nextElementSibling?.matches("[data-upload-preview]")
      ? label.nextElementSibling
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

    function makePreviewMedia(file) {
      const url = URL.createObjectURL(file);
      const isVideo = file.type.startsWith("video/");
      const media = document.createElement(isVideo ? "video" : "img");

      media.src = url;
      media.alt = file.name;
      media.muted = true;
      media.controls = isVideo;
      media.onloadeddata = () => URL.revokeObjectURL(url);
      media.onload = () => URL.revokeObjectURL(url);

      return media;
    }

    function renderUploadPreview() {
      preview.innerHTML = "";

      if (!selectedFiles.length) {
        const empty = document.createElement("small");
        empty.textContent = preview.dataset.emptyText || "لم يتم اختيار ملفات";
        preview.appendChild(empty);
        return;
      }

      const count = document.createElement("strong");
      count.className = "upload-preview-count";
      count.textContent = `${selectedFiles.length} ملف محدد`;
      preview.appendChild(count);

      const grid = document.createElement("div");
      grid.className = "upload-preview-grid";
      preview.appendChild(grid);

      selectedFiles.forEach((file, index) => {
        const item = document.createElement("div");
        item.className = "upload-preview-item";

        const name = document.createElement("span");
        name.textContent = file.name;

        const remove = document.createElement("button");
        remove.type = "button";
        remove.textContent = "×";
        remove.setAttribute("aria-label", `حذف ${file.name}`);
        remove.addEventListener("click", () => {
          selectedFiles.splice(index, 1);
          syncInputFiles();
          renderUploadPreview();
        });

        item.append(makePreviewMedia(file), name, remove);
        grid.appendChild(item);
      });
    }

    input.addEventListener("change", () => {
      selectedFiles = [...input.files];
      renderUploadPreview();
    });
  });
})();
