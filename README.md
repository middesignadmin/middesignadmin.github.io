# [Business Name] — Website

Static HTML/CSS/JS site. No build step, no server, no database.
Open any `.html` file in a browser, or serve the folder locally (see below).

## Folder structure

```
site/
├── index.html          Home
├── portfolio.html       Portfolio / gallery
├── about.html            About
├── contact.html          Contact
├── css/
│   ├── variables.css    ★ Design tokens — colors, fonts, spacing. Edit THIS first.
│   ├── base.css          Resets, typography defaults, buttons, layout helpers
│   ├── layout.css        Header, nav, footer
│   └── components.css    Hero, cards, gallery grid, contact tiles, forms
├── js/
│   └── main.js           Mobile nav toggle, scroll fade-ins, GLightbox init
├── vendor/
│   └── glightbox/        Third-party lightbox library (vendored, not CDN)
└── images/
    ├── portfolio/        Full-size optimized photos, grouped by category
    │   ├── curtains/
    │   ├── wallpaper/
    │   └── flooring/
    └── thumbnails/        Small fast-loading versions for the gallery grid
        ├── curtains/
        ├── wallpaper/
        └── flooring/
```

## Design system: how to restyle later

All colors, fonts, and spacing live in **`css/variables.css`** as CSS custom
properties (`--color-accent`, `--font-heading`, etc). The rest of the CSS
references these variables instead of hardcoded values. To change the whole
site's look:

1. Pick fonts on [Google Fonts](https://fonts.google.com), add the `<link>`
   tags it gives you into the `<head>` of each HTML page (right under the
   "Google Fonts" comment).
2. Update `--font-heading` and `--font-body` in `variables.css` to match.
3. Pick a palette on [Coolors](https://coolors.co), update the `--color-*`
   variables in `variables.css`.

No other file should need to change for a visual refresh.

## Current state: scaffolding, not final design

The site currently uses a plain greyscale placeholder style on purpose —
so it's obvious what's structural scaffolding vs. an actual design choice.
Text in `[brackets]` throughout the HTML is placeholder copy waiting on the
business owner's real wording.

## Adding real portfolio photos

1. **Resize/compress originals before adding them.** Camera files are often
   3–10MB — far too slow for the web. Use [Squoosh](https://squoosh.app)
   (free, browser-based, no install) to resize the long edge to ~1500–2000px
   and export as JPG or WebP.
2. Put the resized full-size image in `images/portfolio/<category>/`.
3. Make a smaller thumbnail version (e.g. 500–600px wide) of the same photo
   and put it in `images/thumbnails/<category>/` — same filename, so it's
   easy to tell which thumbnail belongs to which full image.
4. Keep uncompressed camera originals OUT of this folder entirely — store
   those separately (e.g. Google Drive), not in the website files.
5. In `portfolio.html`, replace a placeholder `<div class="gallery-item ...">`
   block with the real markup — there's a commented example directly in that
   file showing the exact pattern (thumbnail in the grid, full image opens
   in the lightbox on click, grouped so visitors can swipe between all
   photos without closing the lightbox).

## The lightbox (GLightbox)

The portfolio gallery uses [GLightbox](https://biati-digital.github.io/glightbox/)
for the thumbnail → full-photo click interaction. It's vendored locally in
`vendor/glightbox/` (not loaded from a CDN), so the site works offline and
isn't dependent on a third party staying online. It's initialized in `js/main.js`.

## Contact form

The form on `contact.html` is currently just markup/styling — static sites
have no server, so a `<form>` can't actually send anything on its own yet.
When ready, the simplest fix is a free service like
[Formspree](https://formspree.io): sign up, get a unique endpoint URL, and
set it as the form's `action=""` attribute. No other code changes needed.

## Browser support / accessibility notes

- Visible keyboard focus outlines are preserved intentionally — don't remove.
- `prefers-reduced-motion` is respected (fade-ins and smooth scroll turn off
  automatically for users who've requested less motion at the OS level).
- Mobile nav collapses under 720px into a toggleable full-screen menu.

## Local preview

No build tools needed. Easiest options:

- Just double-click any `.html` file to open it in a browser, **or**
- For a closer-to-production preview (recommended, since some browsers
  restrict local file access oddly): run a tiny local server from this
  folder, e.g. with Python already on most machines:
  ```
  python3 -m http.server 8000
  ```
  then visit `http://localhost:8000` in your browser.

## SEO basics already in place

- `sitemap.xml` — lists all 4 pages for search engines. **Replace
  `https://www.example.com` with the real domain once one is chosen** —
  every URL in this file must use the live domain, not the placeholder.
- `robots.txt` — allows all crawlers and points to the sitemap. Update the
  `Sitemap:` line to match the real domain too (same placeholder swap).
- Once the domain is live, submit `sitemap.xml` in
  [Google Search Console](https://search.google.com/search-console) so
  Google discovers the site faster.
- Still to do once content is real: unique `<title>`/`<meta description>`
  per page (the tags are already there, just need real wording), descriptive
  `alt` text on every portfolio photo, and a `LocalBusiness` structured data
  snippet once the business address/hours are finalized.

## Adding analytics / ads later

Google Analytics, Google Ads/AdSense, etc. are just `<script>` tags — paste
the snippet they give you right before the closing `</head>` or `</body>`
tag on each page. No structural changes needed.
