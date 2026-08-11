document.addEventListener('DOMContentLoaded', function () {
  if (typeof GLightbox !== 'function') {
    return;
  }

  var lightboxIsOpen = false;
  var closingFromPopstate = false;

  var lightbox = GLightbox({
    selector: '.glightbox',
    onOpen: function () {
      lightboxIsOpen = true;
      history.pushState({ glightboxOpen: true }, '');
    },
    onClose: function () {
      lightboxIsOpen = false;
      if (!closingFromPopstate) {
        history.back();
      }
      closingFromPopstate = false;
    }
  });

  window.addEventListener('popstate', function () {
    if (lightboxIsOpen) {
      closingFromPopstate = true;
      lightbox.close();
    }
  });

  var lastGalleryDestination = null;

  lightbox.on('slide_changed', function (data) {
    var trigger = data && data.current && data.current.trigger;
    if (!trigger || !trigger.getAttribute('data-gtm-event')) {
      return;
    }

    var destination = trigger.getAttribute('href') || null;
    if (destination === lastGalleryDestination) {
      return;
    }
    lastGalleryDestination = destination;

    var pushedEvent = {
      event: trigger.getAttribute('data-gtm-event'),
      cta_section: trigger.getAttribute('data-gtm-section'),
      cta_destination: destination
    };

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(pushedEvent);

    processEngagementEvent(pushedEvent);
  });
});
