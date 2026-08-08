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

// ===== ENGAGED VISIT RULES =====
// The one place to add/edit/remove what counts as an "engaged visit."
// Each rule matches a pushed dataLayer event by `event`.
// threshold: 1 (or omitted) fires immediately on first match.
// threshold: N requires N distinct values of `distinctBy` before firing.
// announceEvent (optional): a dedicated event pushed once per session when this
// specific rule is satisfied, independent of `engaged_visit` (which only ever
// fires once per session, for whichever rule gets satisfied first). Without
// announceEvent, a rule satisfied after `engaged_visit` already fired from a
// different rule would otherwise leave no trace at all.
var ENGAGEMENT_RULES = [
  { id: 'project_card_click', event: 'project_card_click', threshold: 1 },
  { id: 'style_match_explore', event: 'style_match_explore', threshold: 1 },
  { id: 'steps_view_all', event: 'steps_view_all', threshold: 1 },
  { id: 'our_work_view_portfolio', event: 'our_work_view_portfolio', threshold: 1 },
  {
    id: 'gallery_5',
    event: 'gallery_open',
    threshold: 5,
    distinctBy: 'cta_destination',
    announceEvent: 'multiple_images_opened'
  },
  {
    id: 'pages_3',
    event: 'page_view_internal',
    threshold: 3,
    distinctBy: 'page_path',
    announceEvent: 'multiple_pages_visited'
  }
];

var ENGAGEMENT_STORAGE_KEY = 'mid_engagement_state';

function loadEngagementState() {
  try {
    var stored = JSON.parse(sessionStorage.getItem(ENGAGEMENT_STORAGE_KEY));
    if (stored && typeof stored === 'object') {
      if (!stored.progress) {
        stored.progress = {};
      }
      if (!stored.ruleFired) {
        stored.ruleFired = {};
      }
      return stored;
    }
  } catch (e) {}
  return { fired: false, progress: {}, ruleFired: {} };
}

function saveEngagementState(state) {
  try {
    sessionStorage.setItem(ENGAGEMENT_STORAGE_KEY, JSON.stringify(state));
  } catch (e) {}
}

// Returns the rules newly satisfied by this click (usually 0 or 1). Rules
// already satisfied earlier this session are skipped so they don't re-fire.
function evaluateEngagementRules(pushedEvent, state) {
  var newlySatisfied = [];

  for (var i = 0; i < ENGAGEMENT_RULES.length; i++) {
    var rule = ENGAGEMENT_RULES[i];
    if (pushedEvent.event !== rule.event || state.ruleFired[rule.id]) {
      continue;
    }

    var threshold = rule.threshold || 1;
    var satisfied;
    if (threshold <= 1) {
      satisfied = true;
    } else {
      var seen = state.progress[rule.id] || [];
      var value = rule.distinctBy ? pushedEvent[rule.distinctBy] : null;
      if (value && seen.indexOf(value) === -1) {
        seen.push(value);
        state.progress[rule.id] = seen;
      }
      satisfied = seen.length >= threshold;
    }

    if (satisfied) {
      state.ruleFired[rule.id] = true;
      newlySatisfied.push(rule);
    }
  }

  return newlySatisfied;
}

// Evaluates pushedEvent against ENGAGEMENT_RULES, dispatches any newly-earned
// announceEvent(s) plus engaged_visit (once per session), and persists state.
// Shared by the click listener and the page-view check below.
function processEngagementEvent(pushedEvent) {
  window.dataLayer = window.dataLayer || [];

  var engagementState = loadEngagementState();
  var newlySatisfiedRules = evaluateEngagementRules(pushedEvent, engagementState);

  newlySatisfiedRules.forEach(function (rule) {
    if (rule.announceEvent) {
      window.dataLayer.push({ event: rule.announceEvent, engagement_rule: rule.id });
    }
    if (!engagementState.fired) {
      engagementState.fired = true;
      window.dataLayer.push({ event: 'engaged_visit', engagement_rule: rule.id });
    }
  });

  saveEngagementState(engagementState);
}

document.addEventListener('DOMContentLoaded', function () {
  document.addEventListener('click', function (event) {
    var target = event.target.closest('[data-gtm-event]');
    if (!target) {
      return;
    }

    var pushedEvent = {
      event: target.getAttribute('data-gtm-event'),
      cta_section: target.getAttribute('data-gtm-section'),
      cta_destination: target.getAttribute('href') || null
    };

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(pushedEvent);

    processEngagementEvent(pushedEvent);
  });
});

// Not pushed to dataLayer directly (GTM already has its own pageview signal
// via gtm.js) — only used to feed the pages_3 engagement rule above.
document.addEventListener('DOMContentLoaded', function () {
  processEngagementEvent({ event: 'page_view_internal', page_path: location.pathname });
});
