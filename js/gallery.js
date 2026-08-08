document.addEventListener('DOMContentLoaded', function () {
  if (typeof GLightbox !== 'function') {
    return;
  }

  var lightbox = GLightbox({
    selector: '.glightbox'
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
