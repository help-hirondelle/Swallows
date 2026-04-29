(function () {
  var base = window.SITE_BASE || "";
  var activePage = window.ACTIVE_PAGE || "information";
  var lastUpdated = window.LAST_UPDATED || "March 25, 2026";

  var navItems = [
    { key: "information", label: "Information", path: "index.html" },
    { key: "fun-facts", label: "Fun Facts", path: "pages/fun-facts.html" },
    { key: "trail", label: "Trail", path: "pages/nest-map.html" },
    { key: "game", label: "Game", path: "pages/game.html" },
    { key: "about", label: "About", path: "pages/about.html" }
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
      '"><img class="brand-mark" src="' +
      resolvePath("assets/icons/swallow-icon.png") +
      '" alt="" aria-hidden="true" />' +
      "<span>Swallow Trail Vaud</span></a>" +
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

  renderHeader();
  renderFooter();
  renderLastUpdated();
})();
