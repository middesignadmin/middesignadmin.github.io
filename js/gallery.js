document.addEventListener('DOMContentLoaded', function () {
  if (typeof GLightbox !== 'function') {
    return;
  }

  GLightbox({
    selector: '.glightbox'
  });
});
