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

  /* -- Shared partials ------------------------------------------------------ */
  await Promise.all([
    loadPartial('header-placeholder', '/partials/header.frag'),
    loadPartial('footer-placeholder', '/partials/footer.frag'),
    loadDataPartials()
  ]);

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

  /* -- Scroll fade-in reveals -----------------------------------------------
     Add the class "fade-in" to any element in HTML and it will fade/slide
     into view the first time it enters the viewport. Respects
     prefers-reduced-motion via the CSS media query in base.css. */
  var fadeEls = document.querySelectorAll('.fade-in');

  if ('IntersectionObserver' in window && fadeEls.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    fadeEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: no IntersectionObserver support — just show everything
    fadeEls.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

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

});
