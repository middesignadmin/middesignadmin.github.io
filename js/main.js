document.addEventListener('DOMContentLoaded', function () {
  var hamburgerBtn = document.getElementById('hamburger-btn');
  var primaryNav = document.getElementById('primary-nav');

  if (!hamburgerBtn || !primaryNav) {
    return;
  }

  hamburgerBtn.addEventListener('click', function () {
    var isOpen = primaryNav.classList.toggle('is-open');
    hamburgerBtn.classList.toggle('is-active', isOpen);
    hamburgerBtn.setAttribute('aria-expanded', String(isOpen));
  });

  window.addEventListener('pageshow', function (event) {
    if (event.persisted) {
      primaryNav.classList.remove('is-open');
      hamburgerBtn.classList.remove('is-active');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
    }
  });
});

document.addEventListener('DOMContentLoaded', function () {
  var curtainStylesToggle = document.getElementById('curtain-styles-toggle');
  var curtainStylesPanel = document.getElementById('curtain-styles-panel');

  if (!curtainStylesToggle || !curtainStylesPanel) {
    return;
  }

  curtainStylesToggle.addEventListener('click', function () {
    var isOpen = curtainStylesPanel.classList.toggle('is-open');
    if (isOpen) {
      curtainStylesPanel.removeAttribute('inert');
    } else {
      curtainStylesPanel.setAttribute('inert', '');
    }
    curtainStylesToggle.setAttribute('aria-expanded', String(isOpen));
  });
});

document.addEventListener('DOMContentLoaded', function () {
  var topBtn = document.querySelector('.float-btn--top');

  if (!topBtn) {
    return;
  }

  window.addEventListener('scroll', function () {
    topBtn.classList.toggle('is-visible', window.scrollY > 300);
  });

  topBtn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});
