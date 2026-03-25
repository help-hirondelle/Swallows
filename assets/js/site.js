(function () {
  var base = window.SITE_BASE || "";
  var activePage = window.ACTIVE_PAGE || "home";
  var lastUpdated = window.LAST_UPDATED || "March 25, 2026";
  var tocMinSections = window.TOC_MIN_SECTIONS || 2;

  var navItems = [
    { key: "home", label: "Home", path: "index.html" },
    { key: "about", label: "About", path: "pages/about.html" },
    { key: "owners", label: "Owners", path: "pages/owners.html" },
    { key: "constructors", label: "Builders", path: "pages/constructors.html" },
    { key: "planners", label: "Planners", path: "pages/planners.html" },
    { key: "solutions", label: "Solutions", path: "pages/solutions.html" },
    { key: "legal", label: "Laws", path: "pages/legal.html" },
    { key: "faq", label: "FAQ", path: "pages/faq-resources.html" }
  ];

  function resolvePath(path) {
    return base + path;
  }

  function closeMenu(menu, button) {
    menu.setAttribute("data-open", "false");
    button.setAttribute("aria-expanded", "false");
  }

  function renderHeader() {
    var host = document.querySelector("[data-site-header]");
    if (!host) {
      return;
    }

    var links = navItems
      .map(function (item) {
        var isCurrent = item.key === activePage;
        var currentAttr = isCurrent ? ' aria-current="page"' : "";
        return (
          '<li><a href="' +
          resolvePath(item.path) +
          '"' +
          currentAttr +
          ">" +
          item.label +
          "</a></li>"
        );
      })
      .join("");

    host.innerHTML =
      '<a class="skip-link" href="#main-content">Skip to content</a>' +
      '<header class="site-header">' +
      '  <div class="container site-header-inner">' +
      '    <a class="brand" href="' +
      resolvePath("index.html") +
      '">House Martins Switzerland</a>' +
      '    <button type="button" class="menu-btn" data-menu-btn aria-expanded="false">Menu</button>' +
      '    <nav class="site-nav" data-open="false"><ul>' +
      links +
      "</ul></nav>" +
      "  </div>" +
      "</header>";

    var menuButton = host.querySelector("[data-menu-btn]");
    var menu = host.querySelector(".site-nav");
    if (!menuButton || !menu) {
      return;
    }

    menuButton.addEventListener("click", function () {
      var isOpen = menu.getAttribute("data-open") === "true";
      menu.setAttribute("data-open", String(!isOpen));
      menuButton.setAttribute("aria-expanded", String(!isOpen));
    });

    var menuLinks = menu.querySelectorAll("a");
    Array.prototype.forEach.call(menuLinks, function (link) {
      link.addEventListener("click", function () {
        closeMenu(menu, menuButton);
      });
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeMenu(menu, menuButton);
      }
    });
  }

  function renderFooter() {
    var host = document.querySelector("[data-site-footer]");
    if (!host) {
      return;
    }

    host.innerHTML =
      '<footer class="site-footer">' +
      '  <div class="container site-footer-inner">' +
      '    <span>Informative prototype for coexistence between people and house martins in Switzerland.</span>' +
      '    <span class="site-footer-meta">Last updated: <span data-last-updated></span></span>' +
      "  </div>" +
      "</footer>";
  }

  function renderLastUpdated() {
    var nodes = document.querySelectorAll("[data-last-updated]");
    Array.prototype.forEach.call(nodes, function (node) {
      node.textContent = lastUpdated;
    });
  }

  function slugify(text) {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  function ensureSectionId(section, fallbackIndex) {
    if (section.id) {
      return section.id;
    }

    var heading = section.querySelector(":scope > h2");
    var baseId = heading ? slugify(heading.textContent) : "";
    if (!baseId) {
      baseId = "section-" + String(fallbackIndex + 1);
    }

    var id = baseId;
    var counter = 2;

    while (document.getElementById(id)) {
      id = baseId + "-" + String(counter);
      counter += 1;
    }

    section.id = id;
    return id;
  }

  function setActiveTocLink(id) {
    var tocLinks = document.querySelectorAll("[data-toc-link]");
    Array.prototype.forEach.call(tocLinks, function (link) {
      link.classList.toggle("is-active", link.getAttribute("data-toc-link") === id);
    });
  }

  function watchSections(sectionIds) {
    if (!("IntersectionObserver" in window)) {
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            setActiveTocLink(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-42% 0px -45% 0px",
        threshold: [0, 1]
      }
    );

    sectionIds.forEach(function (id) {
      var section = document.getElementById(id);
      if (section) {
        observer.observe(section);
      }
    });
  }

  function renderToc() {
    var main = document.getElementById("main-content") || document.querySelector("main");
    if (!main) {
      return;
    }

    var sections = Array.prototype.slice
      .call(main.querySelectorAll(":scope > section"))
      .filter(function (section) {
        return !section.classList.contains("page-hero") && !section.classList.contains("hero");
      });

    if (sections.length < tocMinSections) {
      return;
    }

    var items = sections
      .map(function (section, index) {
        var heading = section.querySelector(":scope > h2");
        if (!heading) {
          return null;
        }

        return {
          id: ensureSectionId(section, index),
          label: heading.textContent.trim()
        };
      })
      .filter(Boolean);

    if (items.length < tocMinSections) {
      return;
    }

    var links = items
      .map(function (item) {
        return '<li><a data-toc-link="' + item.id + '" href="#' + item.id + '">' + item.label + "</a></li>";
      })
      .join("");

    var toc = document.createElement("aside");
    toc.className = "toc";
    toc.setAttribute("aria-label", "On this page");
    toc.innerHTML = '<p class="toc-title">On this page</p><ul>' + links + "</ul>";

    var hero = main.querySelector(":scope > .page-hero, :scope > .hero");
    if (hero) {
      hero.insertAdjacentElement("afterend", toc);
    } else {
      main.prepend(toc);
    }

    setActiveTocLink(items[0].id);
    watchSections(
      items.map(function (item) {
        return item.id;
      })
    );
  }

  renderHeader();
  renderFooter();
  renderLastUpdated();
  renderToc();
})();
