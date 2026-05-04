(function () {
  const key = "wm-showcase-theme";
  const root = document.documentElement;
  const fontStatusNodes = document.querySelectorAll("[data-font-status]");

  function getCurrentPage() {
    const rawPath = window.location.pathname;
    return rawPath.endsWith("/") || rawPath.endsWith("/showcase")
      ? "index.html"
      : rawPath.split("/").pop() || "index.html";
  }

  function buildTopNav() {
    const docsShell = document.querySelector(".docs-shell");
    const sourceNav = document.querySelector(".docs-nav-group");

    if (!docsShell || !sourceNav || document.querySelector(".docs-topbar-global")) {
      return;
    }

    const topbar = document.createElement("header");
    topbar.className = "docs-topbar docs-topbar-global";

    const inner = document.createElement("div");
    inner.className = "docs-topbar-inner";

    const brand = document.createElement("a");
    brand.className = "docs-topbar-brand";
    brand.href = "./index.html";
    brand.textContent = "Wintermuted UI Docs";

    const actions = document.createElement("div");
    actions.className = "docs-topbar-actions";

    const toggleBtn = document.createElement("button");
    toggleBtn.className = "docs-topbar-toggle";
    toggleBtn.setAttribute("data-theme-toggle", "");
    toggleBtn.setAttribute("aria-label", "Toggle theme");
    toggleBtn.textContent = "Toggle Dark";
    actions.appendChild(toggleBtn);

    inner.append(brand, actions);
    topbar.appendChild(inner);
    document.body.insertBefore(topbar, docsShell);
  }

  function getToggleButtons() {
    return document.querySelectorAll("[data-theme-toggle]");
  }

  function applyTheme(theme) {
    const dark = theme === "dark";

    if (dark) {
      root.setAttribute("data-theme", "dark");
    } else {
      root.removeAttribute("data-theme");
    }

    const iconName = dark ? "sun" : "moon";
    const label = dark ? "Light" : "Dark";

    getToggleButtons().forEach((button) => {
      button.innerHTML = `<i data-lucide="${iconName}" aria-hidden="true"></i><span>${label}</span>`;
      button.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
    });

    if (typeof lucide !== "undefined") {
      lucide.createIcons();
    }
  }

  function setActiveNavLink() {
    const page = getCurrentPage();

    document.querySelectorAll(".docs-nav-link, .docs-topbar-link").forEach((link) => {
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

    getToggleButtons().forEach((button) => {
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

  buildTopNav();
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
