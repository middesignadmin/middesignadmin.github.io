// Google Tag Manager
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-N33WDGSD');

/* ==========================================================================
   MAIN.JS — vanilla JS only, no framework
   Handles: shared partials injection, mobile nav toggle, scroll fade-in
            reveals, GLightbox init.
   ========================================================================== */

async function loadPartial(id, url) {
  var el = document.getElementById(id);
  if (!el) return;
  var res = await fetch(url);
  el.outerHTML = await res.text();
}

async function loadDataPartials() {
  var els = Array.from(document.querySelectorAll('[data-partial]'));
  if (!els.length) return;
  var cache = {};
  for (var el of els) {
    var name = el.dataset.partial;
    if (!cache[name]) {
      var res = await fetch('/partials/' + name + '.frag');
      cache[name] = await res.text();
    }
    el.outerHTML = cache[name];
  }
}

function markCurrentNavLink() {
  var path = window.location.pathname;
  if (path === '/') path = '/index.html';
  document.querySelectorAll('.main-nav a').forEach(function (link) {
    if (link.getAttribute('href') === path) {
      link.setAttribute('aria-current', 'page');
    }
  });
}

document.addEventListener('DOMContentLoaded', async function () {

  /* -- Scroll fade-in reveals -----------------------------------------------
     Set up immediately so elements already in the viewport are revealed
     without waiting for async partial fetches. Called again after partials
     load to pick up any newly injected .fade-in elements. */
  function observeFadeIns() {
    var fadeEls = document.querySelectorAll('.fade-in:not(.is-observed)');
    if (!fadeEls.length) return;

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });

      fadeEls.forEach(function (el) {
        el.classList.add('is-observed');
        observer.observe(el);
      });
    } else {
      // Fallback: no IntersectionObserver support — just show everything
      fadeEls.forEach(function (el) { el.classList.add('is-visible'); });
    }
  }

  observeFadeIns();

  /* -- Shared partials ------------------------------------------------------ */
  await Promise.all([
    loadPartial('header-placeholder', '/partials/header.frag'),
    loadPartial('footer-placeholder', '/partials/footer.frag'),
    loadDataPartials()
  ]);

  // Pick up any .fade-in elements injected by partials (e.g. process-steps)
  observeFadeIns();

  markCurrentNavLink();

  /* -- Mobile nav toggle --------------------------------------------------- */
  var navToggle = document.querySelector('.nav-toggle');
  var mainNav = document.querySelector('.main-nav');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function () {
      var isOpen = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!isOpen));
      mainNav.classList.toggle('is-open', !isOpen);
    });

    // Close menu when a nav link is clicked (mobile)
    mainNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navToggle.setAttribute('aria-expanded', 'false');
        mainNav.classList.remove('is-open');
      });
    });
  }

  /* -- Products dropdown toggle --------------------------------------------- */
  document.querySelectorAll('.dropdown-toggle').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!isOpen));
      btn.closest('.has-dropdown').classList.toggle('is-open', !isOpen);
    });
  });

  document.addEventListener('click', function (e) {
    if (!e.target.closest('.has-dropdown')) {
      document.querySelectorAll('.dropdown-toggle').forEach(function (btn) {
        btn.setAttribute('aria-expanded', 'false');
        btn.closest('.has-dropdown').classList.remove('is-open');
      });
    }
  });

  /* -- Back-to-top floating button -------------------------------------------
     Fades in once the user scrolls past a threshold, scrolls smoothly to
     top on click. */
  var topBtn = document.querySelector('.float-btn--top');

  if (topBtn) {
    window.addEventListener('scroll', function () {
      topBtn.classList.toggle('is-visible', window.scrollY > 300);
    });

    topBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* -- GLightbox init --------------------------------------------------------
     Targets any link with class "glightbox" (see portfolio.html gallery).
     Library file: vendor/glightbox/glightbox.min.js */
  if (typeof GLightbox === 'function') {
    GLightbox({
      selector: '.glightbox',
      touchNavigation: true,
      loop: true
    });
  }

  /* -- Carousel pagination dots -----------------------------------------------
     Mobile-only peek carousels (.card-grid--carousel, see css/components.css)
     get a row of dots below them, one per card, generated here so counts
     always match the actual cards. Active dot tracks the centered card via
     an IntersectionObserver rooted on the carousel; clicking a dot scrolls
     its card into view. */
  document.querySelectorAll('.card-grid--carousel').forEach(function (carousel) {
    var cards = Array.from(carousel.querySelectorAll(':scope > .card'));
    if (!cards.length) return;

    var dotsEl = document.createElement('div');
    dotsEl.className = 'carousel-dots';

    var dots = cards.map(function (card, i) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'carousel-dot';
      dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      dot.addEventListener('click', function () {
        card.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      });
      dotsEl.appendChild(dot);
      return dot;
    });

    carousel.insertAdjacentElement('afterend', dotsEl);
    dots[0].classList.add('is-active');

    if ('IntersectionObserver' in window) {
      var ratios = new Map();

      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          ratios.set(entry.target, entry.intersectionRatio);
        });

        var activeIndex = 0;
        var bestRatio = -1;
        cards.forEach(function (card, i) {
          var ratio = ratios.get(card) || 0;
          if (ratio > bestRatio) {
            bestRatio = ratio;
            activeIndex = i;
          }
        });

        dots.forEach(function (dot, i) {
          dot.classList.toggle('is-active', i === activeIndex);
        });
      }, { root: carousel, threshold: [0, 0.25, 0.5, 0.75, 1] });

      cards.forEach(function (card) { observer.observe(card); });
    }
  });

});
