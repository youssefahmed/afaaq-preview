(function () {
  const groups = document.querySelectorAll("[data-accordion]");

  groups.forEach((group) => {
    const panels = group.querySelectorAll("details");

    function openPanel(panel) {
      panels.forEach((otherPanel) => {
        if (otherPanel !== panel) {
          otherPanel.removeAttribute("open");
        }
      });

      panel.setAttribute("open", "");
    }

    panels.forEach((panel) => {
      panel.addEventListener("toggle", () => {
        if (!panel.open) return;

        openPanel(panel);
      });
    });

    document.querySelectorAll(`a[href^="#"]`).forEach((link) => {
      link.addEventListener("click", () => {
        const panel = group.querySelector(link.getAttribute("href"));

        if (panel?.tagName === "DETAILS") {
          openPanel(panel);
        }
      });
    });
  });
})();
