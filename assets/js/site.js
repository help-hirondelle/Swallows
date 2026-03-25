(function () {
  var base = window.SITE_BASE || "";
  var activePage = window.ACTIVE_PAGE || "home";

  var navItems = [
    { key: "home", label: "Home", path: "index.html" },
    { key: "about", label: "About", path: "pages/about.html" },
    { key: "owners", label: "House Owners", path: "pages/owners.html" },
    { key: "constructors", label: "Constructors", path: "pages/constructors.html" },
    { key: "planners", label: "City Planners", path: "pages/planners.html" },
    { key: "solutions", label: "Solutions", path: "pages/solutions.html" },
    { key: "legal", label: "Swiss Laws", path: "pages/legal.html" },
    { key: "faq", label: "FAQ & Resources", path: "pages/faq-resources.html" }
  ];

  function resolvePath(path) {
    return base + path;
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
  }

  function renderFooter() {
    var host = document.querySelector("[data-site-footer]");
    if (!host) {
      return;
    }

    host.innerHTML =
      '<footer class="site-footer">' +
      '  <div class="container site-footer-inner">' +
      "    Informative prototype for coexistence between people and house martins in Switzerland." +
      "  </div>" +
      "</footer>";
  }

  renderHeader();
  renderFooter();
})();
