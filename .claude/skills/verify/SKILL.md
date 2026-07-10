---
name: verify
description: How to run and visually verify this static site (partials need a server; screenshots via playwright-core + cached headless Chromium)
---

# Verifying changes to this site

Static site, no build step. Partials (`partials/*.frag`) are fetched with
absolute `/partials/...` paths, so pages must be served from the **repo root**
— opening the HTML file directly won't load header/footer/process sections.

```bash
python3 -m http.server 8931 --bind 127.0.0.1   # from repo root
```

## Screenshots / driving the pages

No project-local Playwright. Working recipe:

1. `npm i playwright-core` in the scratchpad (small, no browser download).
2. Launch the cached browser:
   `executablePath: ~/.cache/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-linux64/chrome-headless-shell`
3. That binary is missing system libs on this WSL host. Fix without root:
   `apt-get download libnss3 libnspr4 libasound2t64`, extract with
   `dpkg-deb -x <deb> extracted`, then run node with
   `LD_LIBRARY_PATH=<...>/extracted/usr/lib/x86_64-linux-gnu`.

## Gotchas

- `.fade-in` elements stay `opacity: 0` until scrolled into view
  (IntersectionObserver in `js/main.js`). Before screenshotting, call
  `scrollIntoViewIfNeeded()` on the target and wait ~700ms for the transition.
- `waitUntil: 'networkidle'` may be slow/flaky because pages load Google Tag
  Manager and Google Fonts from the network; `load` + a wait also works.
- Flows worth checking after layout changes: curtains/blinds/wallpaper product
  pages share partials — verify all pages that consume a partial you touched.
- Mobile breakpoints of interest: most components switch layout somewhere
  between 720–900px; check both sides of the boundary and assert
  `document.documentElement.scrollWidth <= clientWidth` (no horizontal overflow).
