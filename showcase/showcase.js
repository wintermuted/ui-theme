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

    const sidebarToggle = document.createElement("button");
    sidebarToggle.className = "docs-topbar-menu";
    sidebarToggle.type = "button";
    sidebarToggle.setAttribute("data-docs-sidebar-toggle", "");
    sidebarToggle.setAttribute("aria-label", "Toggle page navigation");
    sidebarToggle.setAttribute("aria-expanded", "false");
    sidebarToggle.innerHTML = '<i data-lucide="panel-left" aria-hidden="true"></i><span>Menu</span>';

    const versionSelect = document.createElement("select");
    versionSelect.className = "docs-topbar-version";
    versionSelect.setAttribute("aria-label", "Select version");
    const versions = [
      { label: "v0.1.1", tag: "v0.1.1" },
      { label: "v0.1.0", tag: "v0.1.0" },
    ];
    versions.forEach(({ label, tag }) => {
      const opt = document.createElement("option");
      opt.value = "https://github.com/wintermuted/ui-theme/releases/tag/" + tag;
      opt.textContent = label;
      if (tag === "v0.1.1") opt.selected = true;
      versionSelect.appendChild(opt);
    });
    versionSelect.addEventListener("change", () => {
      window.open(versionSelect.value, "_blank", "noopener");
      versionSelect.value = versions[0].value;
    });

    const githubLink = document.createElement("a");
    githubLink.className = "docs-topbar-github";
    githubLink.href = "https://github.com/wintermuted/ui-theme";
    githubLink.target = "_blank";
    githubLink.rel = "noopener noreferrer";
    githubLink.setAttribute("aria-label", "View on GitHub");
    githubLink.innerHTML = '<i data-lucide="github" aria-hidden="true"></i>';

    const toggleBtn = document.createElement("button");
    toggleBtn.className = "docs-topbar-toggle";
    toggleBtn.setAttribute("data-theme-toggle", "");
    toggleBtn.setAttribute("aria-label", "Toggle theme");
    toggleBtn.textContent = "Toggle Dark";

    actions.append(sidebarToggle, versionSelect, githubLink, toggleBtn);

    inner.append(brand, actions);
    topbar.appendChild(inner);
    document.body.insertBefore(topbar, docsShell);
  }

  function slugify(text) {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  function buildPageOutline() {
    const docsShell = document.querySelector(".docs-shell");
    const main = document.querySelector(".docs-main");

    if (!docsShell || !main || docsShell.querySelector(".docs-outline-rail")) {
      return;
    }

    const headings = Array.from(
      main.querySelectorAll(".page-header .page-title, .docs-main > h3, .docs-main > .docs-section > .section-title")
    );

    if (!headings.length) {
      return;
    }

    const usedIds = new Set();
    headings.forEach((heading) => {
      if (heading.id) {
        usedIds.add(heading.id);
      }
    });

    headings.forEach((heading, index) => {
      if (heading.id) {
        return;
      }

      const base = slugify(heading.textContent || "section") || `section-${index + 1}`;
      let id = base;
      let counter = 2;

      while (usedIds.has(id) || document.getElementById(id)) {
        id = `${base}-${counter}`;
        counter += 1;
      }

      heading.id = id;
      usedIds.add(id);
    });

    const outline = document.createElement("nav");
    outline.className = "docs-outline-group";
    outline.setAttribute("aria-label", "Page outline");

    const outlineRail = document.createElement("aside");
    outlineRail.className = "docs-outline-rail";

    const label = document.createElement("p");
    label.className = "docs-outline-label";
    label.textContent = "On This Page";

    const links = document.createElement("div");
    links.className = "docs-outline-links";

    headings.forEach((heading) => {
      const link = document.createElement("a");
      link.className = "docs-outline-link";
      link.href = `#${heading.id}`;
      link.textContent = (heading.textContent || "").trim();
      link.setAttribute("data-outline-target", heading.id);
      links.appendChild(link);
    });

    outline.append(label, links);
    outlineRail.appendChild(outline);
    docsShell.appendChild(outlineRail);

    const outlineLinks = Array.from(links.querySelectorAll(".docs-outline-link"));
    const updateActive = () => {
      let activeId = headings[0].id;
      const offset = 120;

      headings.forEach((heading) => {
        const rect = heading.getBoundingClientRect();
        if (rect.top - offset <= 0) {
          activeId = heading.id;
        }
      });

      outlineLinks.forEach((link) => {
        const isActive = link.getAttribute("data-outline-target") === activeId;
        link.classList.toggle("is-active", isActive);
        if (isActive) {
          link.setAttribute("aria-current", "true");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    };

    window.addEventListener("scroll", updateActive, { passive: true });
    window.addEventListener("hashchange", updateActive);
    updateActive();
  }

  function wireSidebarToggle() {
    const sidebar = document.querySelector(".docs-sidebar");
    const toggleButtons = Array.from(document.querySelectorAll("[data-docs-sidebar-toggle]"));

    if (!sidebar || !toggleButtons.length) {
      return;
    }

    const sidebarId = sidebar.id || "docs-sidebar";
    sidebar.id = sidebarId;

    const backdrop = document.createElement("div");
    backdrop.className = "docs-sidebar-backdrop";
    document.body.appendChild(backdrop);

    const mobile = window.matchMedia("(max-width: 1000px)");
    const setOpen = (open) => {
      document.body.classList.toggle("docs-sidebar-open", open);
      toggleButtons.forEach((button) => {
        button.setAttribute("aria-expanded", open ? "true" : "false");
      });
    };

    toggleButtons.forEach((button) => {
      button.setAttribute("aria-controls", sidebarId);
      button.addEventListener("click", () => {
        setOpen(!document.body.classList.contains("docs-sidebar-open"));
      });
    });

    backdrop.addEventListener("click", () => setOpen(false));

    sidebar.querySelectorAll("a[href]").forEach((link) => {
      link.addEventListener("click", () => {
        if (mobile.matches) {
          setOpen(false);
        }
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    });

    const closeOnDesktop = () => {
      if (!mobile.matches) {
        setOpen(false);
      }
    };

    if (typeof mobile.addEventListener === "function") {
      mobile.addEventListener("change", closeOnDesktop);
    } else if (typeof mobile.addListener === "function") {
      mobile.addListener(closeOnDesktop);
    }
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
  buildPageOutline();
  setActiveNavLink();
  wireSidebarToggle();
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
