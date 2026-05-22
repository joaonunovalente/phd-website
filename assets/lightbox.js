(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var overlay = document.getElementById('lightbox-overlay');
    var lightboxImage = document.getElementById('lightbox-image');
    if (!overlay || !lightboxImage) return;
    document.querySelectorAll('.lightbox').forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        lightboxImage.src = this.href;
        overlay.style.display = 'flex';
      });
    });
    overlay.addEventListener('click', function () {
      overlay.style.display = 'none';
    });
  });
})();
