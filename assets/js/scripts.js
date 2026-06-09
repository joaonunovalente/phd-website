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
        if (!header) return;
        const topPos = header.getBoundingClientRect().top + window.pageYOffset - 20;
        window.scrollTo({ top: topPos, behavior: 'smooth' });
      }, 300);
    }
  });

  document.addEventListener('DOMContentLoaded', function () {
    const postFilter = document.querySelector('[data-post-filter]');

    if (!postFilter) {
      return;
    }

    const posts = Array.from(postFilter.querySelectorAll('[data-post-tags]'));
    const status = document.getElementById('tag-filter-status');
    const clearButton = document.getElementById('clear-tag-filter');
    const emptyState = document.querySelector('[data-empty-state]');
    const params = new URLSearchParams(window.location.search);
    const tag = (params.get('tag') || '').trim().toLowerCase();

    if (!tag) {
      if (status) {
        status.textContent = '';
      }
      if (clearButton) {
        clearButton.classList.add('d-none');
      }
      if (emptyState) {
        emptyState.classList.add('d-none');
      }
      return;
    }

    let visiblePosts = 0;

    posts.forEach(function (post) {
      const postTags = (post.getAttribute('data-post-tags') || '')
        .split(',')
        .map(function (item) {
          return item.trim().toLowerCase();
        })
        .filter(Boolean);
      const isMatch = postTags.includes(tag);

      post.classList.toggle('d-none', !isMatch);
      if (isMatch) {
        visiblePosts += 1;
      }
    });

    if (status) {
      status.textContent = 'Filtered by tag: ' + tag;
    }

    if (clearButton) {
      clearButton.classList.remove('d-none');
    }

    if (emptyState) {
      emptyState.classList.toggle('d-none', visiblePosts > 0);
    }
  });
});

// Copy code to clipboard
function copyCode(button) {
  const code = button.closest('.code-container').querySelector('pre code').innerText;
  navigator.clipboard.writeText(code).then(() => {
    button.textContent = 'Copied!';
    setTimeout(() => button.textContent = 'Copy', 1500);
  }, () => {
    button.textContent = 'Failed';
  });
}
