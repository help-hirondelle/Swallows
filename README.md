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
- `assets/css/main.css`: shared design tokens and layout styles.
- `assets/js/site.js`: shared header/footer and navigation generation.

## Editing rules

- Update global navigation in one place: `assets/js/site.js` (`navItems`).
- Update color/typography/layout in one place: `assets/css/main.css`.
- Keep page-specific text inside each file in `pages/`.
- On each page, set:
  - `window.SITE_BASE` to `"../"` for files in `pages/`.
  - `window.ACTIVE_PAGE` to the current page key (`home`, `about`, `owners`, etc.).

## Run locally

Open `index.html` in a browser.
