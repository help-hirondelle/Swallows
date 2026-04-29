(function () {
  var base = window.SITE_BASE || "";
  var activePage = window.ACTIVE_PAGE || "information";
  var lastUpdated = window.LAST_UPDATED || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  var lang = window.SITE_LANG || "en";
  if (lang !== "fr" && lang !== "de" && lang !== "en") {
    lang = "en";
  }

  var navItems = [
    { key: "information", path: "index.html" },
    { key: "fun-facts", path: "pages/fun-facts.html" },
    { key: "how-to-do-more", path: "pages/how-to-do-more.html" },
    { key: "trail", path: "pages/nest-map.html" },
    { key: "game", path: "pages/game.html" },
    { key: "about", path: "pages/about.html" }
  ];

  var navLabels = {
    en: {
      information: "Information",
      "fun-facts": "Fun Facts",
      "how-to-do-more": "Do More",
      trail: "Trail",
      game: "Game",
      about: "About"
    },
    fr: {
      information: "Information",
      "fun-facts": "Faits Amusants",
      "how-to-do-more": "Agir Plus",
      trail: "Parcours",
      game: "Jeu",
      about: "A propos"
    },
    de: {
      information: "Information",
      "fun-facts": "Fun Fakten",
      "how-to-do-more": "Mehr Tun",
      trail: "Pfad",
      game: "Spiel",
      about: "Ueber Uns"
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
    for (var i = 0; i < navItems.length; i += 1) {
      if (navItems[i].key === activePage) {
        return navItems[i].path;
      }
    }

    return "index.html";
  }

  function renderLanguageSwitchDropdown() {
    var items = [
      { key: "fr", label: "French" },
      { key: "de", label: "German" },
      { key: "en", label: "English" }
    ];
    var basePath = currentBasePath();

    var options = items
      .map(function (item) {
        var selected = item.key === lang ? " selected" : "";
        var targetPath = localizedPath(basePath, item.key);
        return '<option value="' + resolvePath(targetPath) + '"' + selected + ">" + item.label + "</option>";
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
      "<span>Help Hironelle</span></a>" +
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

  renderHeader();
  renderFooter();
  renderLastUpdated();
})();
