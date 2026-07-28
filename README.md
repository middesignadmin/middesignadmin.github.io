# MID Design Studio

Website for MID Design Studio (curtains, blinds, wallpaper, room dividers).

## Stack

Plain static HTML/CSS/JS — no build tooling, no framework, no package manager.

## Structure

- `index.html`, `portfolio.html`, `about-us.html` — root pages
- `products/` — product pages (`curtains.html`, `blinds.html`, `wallpaper.html`, `dividers.html`) and their style/type subpages
- `portfolio-pages/` — individual project pages
- `css/` — `variables.css`, `base.css`, `layout.css`, `components.css` (loaded in that order)
- `js/` — site scripts (mobile nav toggle, gallery/lightbox)
- `images/` — assets, split by product
- `vendor/` — third-party libraries

## Running locally

No build step — just serve the folder and open it in a browser, e.g.:

```
python3 -m http.server
```

Then visit `http://localhost:8000`.

## Deployment

Hosted on GitHub Pages at [www.middesign.studio](https://www.middesign.studio) (see `CNAME`).
