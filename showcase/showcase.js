(function () {
  const key = "wm-showcase-theme";
  const root = document.documentElement;
  const toggleButtons = document.querySelectorAll("[data-theme-toggle]");
  const fontStatusNodes = document.querySelectorAll("[data-font-status]");

  function applyTheme(theme) {
    const dark = theme === "dark";

    if (dark) {
      root.setAttribute("data-theme", "dark");
    } else {
      root.removeAttribute("data-theme");
    }

    toggleButtons.forEach((button) => {
      button.textContent = dark ? "Toggle Light" : "Toggle Dark";
      button.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
    });
  }

  function setActiveNavLink() {
    const rawPath = window.location.pathname;
    const page = rawPath.endsWith("/") || rawPath.endsWith("/showcase")
      ? "index.html"
      : rawPath.split("/").pop() || "index.html";

    document.querySelectorAll(".docs-nav-link").forEach((link) => {
      const isActive = link.getAttribute("data-page") === page;
      link.classList.toggle("is-active", isActive);
      if (isActive) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  function wireThemeToggle() {
    const saved = localStorage.getItem(key);
    const initial = saved === "dark" ? "dark" : "light";
    applyTheme(initial);

    toggleButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
        localStorage.setItem(key, next);
        applyTheme(next);
      });
    });
  }

  function updateFontStatus() {
    if (!fontStatusNodes.length || !document.fonts) {
      return;
    }

    document.fonts.ready.then(function () {
      const interLoaded = document.fonts.check('16px "Inter"');

      fontStatusNodes.forEach((node) => {
        if (interLoaded) {
          node.textContent = "Font status: Inter loaded";
          node.classList.add("font-status-ok");
          node.classList.remove("font-status-warn");
        } else {
          node.textContent = "Font status: Inter not loaded (using fallback stack)";
          node.classList.add("font-status-warn");
          node.classList.remove("font-status-ok");
        }
      });
    });
  }

  setActiveNavLink();
  wireThemeToggle();
  updateFontStatus();
  wireCopyButtons();

  // Prism syntax highlighting
  if (typeof Prism !== 'undefined') {
    Prism.plugins.autoloader.languages_path =
      'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/';
    Prism.highlightAll();
  }

  function wireCopyButtons() {
    document.querySelectorAll('[data-copy]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var pre = btn.closest('.code-sample').querySelector('.code-block');
        if (!pre || !navigator.clipboard) return;
        navigator.clipboard.writeText(pre.textContent.trim()).then(function () {
          var prev = btn.textContent;
          btn.textContent = 'Copied!';
          setTimeout(function () { btn.textContent = prev; }, 1500);
        });
      });
    });
  }
})();
