$(function () {
  $('[data-toggle="tooltip"]').tooltip()
})


document.querySelectorAll('[data-toggle="collapse"]').forEach(trigger => {
  trigger.addEventListener('click', function () {
    const targetId = this.getAttribute('href') || this.getAttribute('data-target');
    const header = this.closest('.card');

    const content = document.querySelector(targetId);
    if (!content.classList.contains('show')) {
      setTimeout(() => {
        const topPos = header.getBoundingClientRect().top + window.pageYOffset - 20; // Offset of 80px above
        window.scrollTo({ top: topPos, behavior: 'smooth' });
      }, 300);
    }
  });
});