(function () {
  var base = window.SITE_BASE || "";
  var activePage = window.ACTIVE_PAGE || "information";
  var lastUpdated = window.LAST_UPDATED || "May 27, 2026";
  var lang = window.SITE_LANG || "en";
  if (lang !== "fr" && lang !== "de" && lang !== "en") {
    lang = "en";
  }

  document.documentElement.classList.add("js-reveal");

  var pageItems = [
    { key: "information", path: "index.html" },
    { key: "fun-facts", path: "pages/fun-facts.html" },
    { key: "how-to-do-more", path: "pages/how-to-do-more.html" },
    { key: "trail", path: "pages/nest-map.html" },
    { key: "game", path: "pages/game.html" },
    { key: "about", path: "pages/about.html" }
  ];
  var navItems = pageItems.filter(function (item) {
    return item.key !== "fun-facts" && item.key !== "how-to-do-more";
  });

  var navLabels = {
    en: {
      information: "Home",
      "fun-facts": "Learn",
      "how-to-do-more": "Take Action",
      trail: "Trail Map",
      game: "Game",
      about: "Project"
    },
    fr: {
      information: "Accueil",
      "fun-facts": "Découvrir",
      "how-to-do-more": "Agir",
      trail: "Carte du parcours",
      game: "Jeu",
      about: "Projet"
    },
    de: {
      information: "Start",
      "fun-facts": "Entdecken",
      "how-to-do-more": "Helfen",
      trail: "Pfadkarte",
      game: "Spiel",
      about: "Projekt"
    }
  };

  function resolvePath(path) {
    return base + path;
  }

  function localizedPath(path, targetLang) {
    if (!/\.html$/i.test(path)) {
      return path;
    }

    if (targetLang === "en") {
      return path;
    }

    return path.replace(/\.html$/i, "-" + targetLang + ".html");
  }

  function currentBasePath() {
    for (var i = 0; i < pageItems.length; i += 1) {
      if (pageItems[i].key === activePage) {
        return pageItems[i].path;
      }
    }

    return "index.html";
  }

  function renderLanguageSwitchDropdown() {
    var items = [
      { key: "fr", label: "Français" },
      { key: "de", label: "Deutsch" },
      { key: "en", label: "English" }
    ];
    var basePath = currentBasePath();
    var suffix = window.location.search + window.location.hash;

    var options = items
      .map(function (item) {
        var selected = item.key === lang ? " selected" : "";
        var targetPath = localizedPath(basePath, item.key);
        return '<option value="' + resolvePath(targetPath) + suffix + '"' + selected + ">" + item.label + "</option>";
      })
      .join("");

    return '<select id="site-lang" class="lang-select" aria-label="Language selection">' + options + "</select>";
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
        var targetPath = localizedPath(item.path, lang);
        return (
          '<li><a href="' +
          resolvePath(targetPath) +
          '"' +
          currentAttr +
          ">" +
          (navLabels[lang] && navLabels[lang][item.key] ? navLabels[lang][item.key] : navLabels.en[item.key]) +
          "</a></li>"
        );
      })
      .join("");

    host.innerHTML =
      '<a class="skip-link" href="#main-content">Skip to content</a>' +
      '<header class="site-header">' +
      '  <div class="container site-header-inner">' +
      '    <a class="brand" href="' +
      resolvePath(localizedPath("index.html", lang)) +
      '"><img class="brand-mark" src="' +
      resolvePath("assets/icons/swallow-icon.png") +
      '" alt="" aria-hidden="true" />' +
      "<span>Help Hirondelle</span></a>" +
      '    <div class="lang-switch" aria-label="Language selection">' +
      renderLanguageSwitchDropdown() +
      "</div>" +
      '    <button type="button" class="menu-btn" data-menu-btn aria-expanded="false">Menu</button>' +
      '    <nav class="site-nav" data-open="false"><ul>' +
      links +
      "</ul></nav>" +
      "  </div>" +
      "</header>";

    var menuButton = host.querySelector("[data-menu-btn]");
    var menu = host.querySelector(".site-nav");
    var langSelect = host.querySelector("#site-lang");
    if (!menuButton || !menu) {
      return;
    }

    if (langSelect) {
      langSelect.addEventListener("change", function () {
        var destination = langSelect.value || resolvePath("index.html");
        window.location.href = destination;
      });
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
      '    <span>A prototype for coexistence between people and swallows in Vaud.</span>' +
      '    <span class="site-footer-meta"><a href="' +
      resolvePath("pages/photo-credits.html") +
      '">Photo credits</a> · Last updated: <span data-last-updated></span></span>' +
      "  </div>" +
      "</footer>";
  }

  function renderLastUpdated() {
    var nodes = document.querySelectorAll("[data-last-updated]");
    Array.prototype.forEach.call(nodes, function (node) {
      node.textContent = lastUpdated;
    });
  }

  function initScrollReveal() {
    var nodes = document.querySelectorAll(".reveal-on-scroll");
    if (!nodes.length) {
      return;
    }

    if (!("IntersectionObserver" in window)) {
      Array.prototype.forEach.call(nodes, function (node) {
        node.classList.add("is-visible");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        Array.prototype.forEach.call(entries, function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    Array.prototype.forEach.call(nodes, function (node) {
      observer.observe(node);
    });
  }

  renderHeader();
  renderFooter();
  renderLastUpdated();
  initScrollReveal();
})();
