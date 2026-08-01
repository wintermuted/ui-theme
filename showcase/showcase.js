(function () {
  const key = "wm-showcase-theme";
  const repo = "wintermuted/wintermuted-ui-library";

  const NAV_STRUCTURE = [
    {
      sectionLabel: "Foundations",
      items: [
        { page: "index.html", label: "Introduction" },
        { page: "installation.html", label: "Installation" },
        { page: "typography.html", label: "Typography" },
        { page: "cards.html", label: "Cards" },
      ],
    },
    {
      sectionLabel: "Inputs and Actions",
      items: [
        { page: "buttons.html", label: "Buttons" },
        { page: "tags.html", label: "Tags" },
        { page: "forms.html", label: "Forms" },
        { page: "toggle.html", label: "Toggle Switch" },
        { page: "slider.html", label: "Slider" },
        { page: "toggle-group.html", label: "Toggle Group" },
      ],
    },
    {
      sectionLabel: "Navigation and Structure",
      items: [
        { page: "navigation.html", label: "Navigation" },
        { page: "modal.html", label: "Modal" },
        {
          label: "Layout",
          disclosure: [
            { page: "layout.html", label: "Overview" },
            { page: "layout-topnav.html", label: "Top Nav" },
            { page: "layout-app-shell.html", label: "App Shell" },
            { page: "layout-sidebar.html", label: "Sidebar Layout" },
            { page: "layout-utilities.html", label: "Layout Utilities" },
            { page: "layout-entry-header.html", label: "Entry Header" },
            { page: "layout-content-grid.html", label: "Content Grid" },
          ],
        },
      ],
    },
    {
      sectionLabel: "Visual Data",
      items: [
        { page: "code-block.html", label: "Code Block" },
        { page: "mermaid.html", label: "Mermaid" },
        { page: "data-display.html", label: "Data Display Overview" },
        { page: "sample-data.html", label: "Sample Data Showcase" },
        { page: "tables.html", label: "Tables" },
        { page: "charts.html", label: "Charts" },
        { page: "gallery.html", label: "Gallery" },
      ],
    },
    {
      sectionLabel: "Status and Messaging",
      items: [
        { page: "feedback.html", label: "Feedback" },
        { page: "toast.html", label: "Toast" },
      ],
    },
    {
      sectionLabel: "Utilities",
      items: [
        { page: "icons.html", label: "Icons" },
      ],
    },
  ];


  const releaseApiUrl = `https://api.github.com/repos/${repo}/releases?per_page=20`;
  const fallbackTags = ["v0.1.1", "v0.1.0"];
  const root = document.documentElement;
  const fontStatusNodes = document.querySelectorAll("[data-font-status]");

  function releaseTagUrl(tag) {
    return `https://github.com/${repo}/releases/tag/${tag}`;
  }

  function setVersionOptions(selectNode, tags) {
    selectNode.innerHTML = "";

    tags.forEach((tag, index) => {
      const opt = document.createElement("option");
      opt.value = releaseTagUrl(tag);
      opt.textContent = tag;
      if (index === 0) {
        opt.selected = true;
      }
      selectNode.appendChild(opt);
    });
  }

  async function loadReleaseTags() {
    try {
      const response = await fetch(releaseApiUrl, {
        headers: { Accept: "application/vnd.github+json" },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch releases (${response.status})`);
      }

      const releases = await response.json();
      const tags = releases
        .map((release) => release && release.tag_name)
        .filter((tag) => typeof tag === "string" && /^v\d+\.\d+\.\d+$/.test(tag));

      return tags.length ? tags : fallbackTags;
    } catch (_err) {
      return fallbackTags;
    }
  }

  function getCurrentPage() {
    const rawPath = window.location.pathname;
    return rawPath.endsWith("/") || rawPath.endsWith("/showcase")
      ? "index.html"
      : rawPath.split("/").pop() || "index.html";
  }

  function buildTopNav() {
    const docsShell = document.querySelector(".docs-shell");

    if (!docsShell || document.querySelector(".docs-topbar-global")) {
      return;
    }

    const topbar = document.createElement("header");
    topbar.className = "docs-topbar docs-topbar-global";

    const inner = document.createElement("div");
    inner.className = "docs-topbar-inner";

    const brand = document.createElement("a");
    brand.className = "docs-topbar-brand";
    brand.href = "./index.html";
    brand.innerHTML = '<img class="docs-topbar-brand-icon" src="./logo.png" alt="" width="20" height="20" aria-hidden="true" /><span>Wintermuted UI Docs</span>';

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
    setVersionOptions(versionSelect, fallbackTags);

    versionSelect.addEventListener("change", () => {
      window.open(versionSelect.value, "_blank", "noopener");
      versionSelect.selectedIndex = 0;
    });

    loadReleaseTags().then((tags) => {
      setVersionOptions(versionSelect, tags);
    });

    const githubLink = document.createElement("a");
    githubLink.className = "docs-topbar-github";
    githubLink.href = "https://github.com/wintermuted/wintermuted-ui-library";
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

  function buildSidebar() {
    const sidebar = document.querySelector(".docs-sidebar");
    if (!sidebar || sidebar.querySelector(".docs-nav-group")) {
      return;
    }

    const nav = document.createElement("nav");
    nav.className = "docs-nav-group";
    nav.setAttribute("aria-label", "Showcase pages");

    const chevronSvg = '<svg class="docs-nav-disclosure-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>';

    NAV_STRUCTURE.forEach((section) => {
      const label = document.createElement("p");
      label.className = "docs-nav-label";
      label.textContent = section.sectionLabel;
      nav.appendChild(label);

      section.items.forEach((item) => {
        if (item.disclosure) {
          const details = document.createElement("details");
          details.className = "docs-nav-disclosure";

          const summary = document.createElement("summary");
          summary.innerHTML = item.label + chevronSvg;

          const body = document.createElement("div");
          body.className = "docs-nav-disclosure-body";

          item.disclosure.forEach((subItem) => {
            const a = document.createElement("a");
            a.className = "docs-nav-sub-link";
            a.setAttribute("data-page", subItem.page);
            a.href = "./" + subItem.page;
            a.textContent = subItem.label;
            body.appendChild(a);
          });

          details.append(summary, body);
          nav.appendChild(details);
        } else {
          const a = document.createElement("a");
          a.className = "docs-nav-link";
          a.setAttribute("data-page", item.page);
          a.href = "./" + item.page;
          a.textContent = item.label;
          nav.appendChild(a);
        }
      });
    });

    sidebar.appendChild(nav);
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

    // Handle disclosure sub-links
    document.querySelectorAll(".docs-nav-sub-link").forEach((link) => {
      const isActive = link.getAttribute("data-page") === page;
      link.classList.toggle("is-active", isActive);
      if (isActive) {
        link.setAttribute("aria-current", "page");
        // Auto-open parent disclosure and mark it as having an active child
        const disclosure = link.closest(".docs-nav-disclosure");
        if (disclosure) {
          disclosure.open = true;
          disclosure.classList.add("has-active");
        }
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

  function formatCurrency(value) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  }

  function renderSampleDataShowcase() {
    const mount = document.querySelector("[data-sample-data-showcase]");
    if (!mount) {
      return;
    }

    const data = {
      range: "Jan 2026 - Jun 2026",
      merchants: [
        { name: "Figma", amount: 180, frequency: "Monthly", status: "Confirmed" },
        { name: "Notion", amount: 96, frequency: "Annual", status: "Detected" },
        { name: "Sentry", amount: 264, frequency: "Monthly", status: "Confirmed" },
        { name: "Linear", amount: 144, frequency: "Monthly", status: "Pending Cancel" },
      ],
      monthly: [
        { month: "Jan", spend: 628, savings: 26 },
        { month: "Feb", spend: 612, savings: 44 },
        { month: "Mar", spend: 604, savings: 51 },
        { month: "Apr", spend: 587, savings: 73 },
        { month: "May", spend: 571, savings: 86 },
        { month: "Jun", spend: 552, savings: 102 },
      ],
    };

    const totalSpend = data.monthly.reduce((sum, row) => sum + row.spend, 0);
    const totalSavings = data.monthly.reduce((sum, row) => sum + row.savings, 0);
    const activeSubscriptions = data.merchants.filter((row) => row.status !== "Pending Cancel").length;

    const statMount = mount.querySelector("[data-sample-stats]");
    const tableMount = mount.querySelector("[data-sample-table]");
    const chartMount = mount.querySelector("[data-sample-chart]");
    const rangeMount = mount.querySelector("[data-sample-range]");

    if (rangeMount) {
      rangeMount.textContent = data.range;
    }

    if (statMount) {
      const cards = [
        { value: formatCurrency(totalSpend), label: "Total spend" },
        { value: formatCurrency(totalSavings), label: "Savings identified", tone: "success" },
        { value: String(activeSubscriptions), label: "Active subscriptions" },
      ];

      statMount.innerHTML = cards
        .map((card) => {
          const toneClass = card.tone === "success" ? " stat-card-success" : "";
          return `<div class="stat-card${toneClass}"><div class="stat-value">${card.value}</div><div class="stat-label">${card.label}</div></div>`;
        })
        .join("");
    }

    if (tableMount) {
      tableMount.innerHTML = data.merchants
        .map((row) => {
          return `<tr><td>${row.name}</td><td>${formatCurrency(row.amount)}</td><td>${row.frequency}</td><td>${row.status}</td></tr>`;
        })
        .join("");
    }

    if (chartMount) {
      const maxSpend = Math.max(...data.monthly.map((row) => row.spend));
      chartMount.innerHTML = data.monthly
        .map((row) => {
          const spendHeight = Math.max(10, Math.round((row.spend / maxSpend) * 140));
          const savingsHeight = Math.max(8, Math.round((row.savings / maxSpend) * 140));
          return `<div class="sample-data-bar-group"><div class="sample-data-bars"><span class="sample-data-bar sample-data-bar-spend" style="height:${spendHeight}px" title="${row.month} spend ${formatCurrency(row.spend)}"></span><span class="sample-data-bar sample-data-bar-savings" style="height:${savingsHeight}px" title="${row.month} savings ${formatCurrency(row.savings)}"></span></div><span class="sample-data-bar-label">${row.month}</span></div>`;
        })
        .join("");
    }
  }

  buildSidebar();
  buildTopNav();
  buildPageOutline();
  setActiveNavLink();
  wireSidebarToggle();
  wireThemeToggle();
  updateFontStatus();
  renderSampleDataShowcase();
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
