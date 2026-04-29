# House Martins Website Mockup

Static multi-page prototype for an informative website about house martins in Switzerland.

## Structure

- `index.html`: homepage and entry points.
- `pages/`: content pages.
  - `about.html`
  - `owners.html`
  - `constructors.html`
  - `planners.html`
  - `solutions.html`
  - `legal.html`
  - `faq-resources.html`
  - `nest-map.html`
- `assets/css/main.css`: shared design tokens and layout styles.
- `assets/js/site.js`: shared header/footer, navigation, last-updated stamp, and automatic table of contents.
- `assets/js/flappy-swallow.js`: homepage-only mini-game logic.
- `assets/js/nest-map.js`: interactive demo map behavior for invented nest sites near Lausanne.
- `assets/icons/`: favicon and app icon files.

## Editing rules

- Update global navigation in one place: `assets/js/site.js` (`navItems`).
- Update color/typography/layout in one place: `assets/css/main.css`.
- Keep page-specific text inside each file in `pages/`.
- Keep each page main wrapper as `<main class="container" id="main-content">` (used by skip link and TOC).
- On each page, set:
  - `window.SITE_BASE` to `"../"` for files in `pages/`.
  - `window.ACTIVE_PAGE` to the current page key (`home`, `about`, `owners`, etc.).
- Optional page-level settings:
  - `window.LAST_UPDATED = "Month DD, YYYY"` to override the global date.
  - `window.TOC_MIN_SECTIONS = 3` to require more sections before TOC appears.

## Run locally

Open `index.html` in a browser.
