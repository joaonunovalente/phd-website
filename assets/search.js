// Search functionality for posts page
let postsData = [];
let currentSearchTerm = '';
let currentSearchPage = 1;
let postsGridOriginalHTML = '';
let paginationOriginalHTML = '';
let paginationOriginalHidden = true;
let postsDataPromise = null;

// Load posts data
async function loadPosts() {
  try {
    const response = await fetch('/search.json');
    postsData = await response.json();
  } catch (error) {
    console.error('Error loading posts:', error);
  }
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getPostsGrid() {
  return document.querySelector('[data-post-filter]');
}

function getPaginationContainer() {
  return document.getElementById('posts-pagination');
}

function getSearchStatusElement() {
  return document.getElementById('search-results-status');
}

function getPostsPerPage() {
  const postsGrid = getPostsGrid();
  const value = postsGrid ? Number(postsGrid.dataset.postsPerPage) : NaN;
  return Number.isFinite(value) && value > 0 ? value : 5;
}

function getSiteAuthor() {
  const postsGrid = getPostsGrid();
  return postsGrid ? postsGrid.dataset.siteAuthor || '' : '';
}

function renderPostCard(post) {
  const title = escapeHtml(post.title);
  const subtitle = post.subtitle ? escapeHtml(post.subtitle) : escapeHtml(post.excerpt);
  const tags = Array.isArray(post.tags) ? post.tags : [];
  const tagsMarkup = tags.length > 0 ? `
        <div class="post-tags">
          ${tags.map(tag => `<a class="tag-badge" href="/posts/?tag=${encodeURIComponent(tag)}">${escapeHtml(tag)}</a>`).join('')}
        </div>
      ` : '';
  const thumbnailMarkup = post.background ? `
      <a href="${escapeHtml(post.url)}" class="post-card-thumb-link">
        <img src="${escapeHtml(post.background)}" alt="${title}" class="post-card-thumb" loading="lazy" />
      </a>
    ` : '';

  return `
  <div class="post-item col-12 mb-4" data-post-tags="${escapeHtml(tags.join(',').toLowerCase())}">
    <article class="post-card h-100">
      ${thumbnailMarkup}

      <div class="post-card-body">
        <a href="${escapeHtml(post.url)}">
          <h2 class="post-title">${title}</h2>
          <h3 class="post-subtitle">${subtitle}</h3>
        </a>

        <p class="post-meta">Posted by ${escapeHtml(getSiteAuthor())} on ${escapeHtml(post.date_display || post.date)}</p>

        ${tagsMarkup}
      </div>

    </article>
  </div>`;
}

// Search and filter posts on the posts page
function filterPostsOnPage(searchTerm) {
  const postItems = document.querySelectorAll('.post-item');
  
  if (!searchTerm || searchTerm.trim().length < 1) {
    // Show all posts
    postItems.forEach(item => {
      item.style.display = '';
    });
    return;
  }

  const term = searchTerm.toLowerCase();
  
  postItems.forEach(item => {
    const titleElement = item.querySelector('.post-title');
    const subtitleElement = item.querySelector('.post-subtitle');
    const tagsElements = item.querySelectorAll('.tag-badge');
    
    const title = titleElement ? titleElement.textContent.toLowerCase() : '';
    const subtitle = subtitleElement ? subtitleElement.textContent.toLowerCase() : '';
    const tags = Array.from(tagsElements).map(tag => tag.textContent.toLowerCase()).join(' ');
    
    const matches = title.includes(term) || subtitle.includes(term) || tags.includes(term);
    
    item.style.display = matches ? '' : 'none';
  });
}

function updateSearchStatus(resultsCount, currentPage, searchTerm) {
  const status = getSearchStatusElement();
  if (!status) {
    return;
  }

  if (!searchTerm) {
    status.textContent = '';
    status.classList.add('d-none');
    return;
  }

  if (resultsCount === 0) {
    status.textContent = 'No posts found. Try a different search term.';
    status.classList.remove('d-none');
    return;
  }

  const perPage = getPostsPerPage();
  const start = ((currentPage - 1) * perPage) + 1;
  const end = Math.min(currentPage * perPage, resultsCount);
  status.textContent = `Showing ${start}-${end} of ${resultsCount} posts for "${searchTerm}"`;
  status.classList.remove('d-none');
}

function restoreDefaultPostsView() {
  const postsGrid = getPostsGrid();
  const paginationContainer = getPaginationContainer();
  const status = getSearchStatusElement();

  if (postsGrid && postsGridOriginalHTML) {
    postsGrid.innerHTML = postsGridOriginalHTML;
  }

  if (paginationContainer) {
    paginationContainer.innerHTML = paginationOriginalHTML;
    paginationContainer.classList.toggle('d-none', paginationOriginalHidden);
  }

  if (status) {
    status.textContent = '';
    status.classList.add('d-none');
  }
}

function renderSearchPagination(totalPages, activePage) {
  const paginationContainer = getPaginationContainer();
  if (!paginationContainer) {
    return;
  }

  if (totalPages <= 1) {
    paginationContainer.innerHTML = '';
    paginationContainer.classList.add('d-none');
    return;
  }

  const items = [];

  items.push(`
    <li class="mx-1 mb-2">
      ${activePage === 1
        ? '<span class="btn btn-outline-primary disabled" aria-disabled="true"><span aria-hidden="true">&laquo;</span><span class="d-none d-sm-inline"> Previous</span></span>'
        : `<button type="button" class="btn btn-outline-primary" data-search-page="${activePage - 1}" aria-label="Previous"><span aria-hidden="true">&laquo;</span><span class="d-none d-sm-inline"> Previous</span></button>`}
    </li>`);

  for (let page = 1; page <= totalPages; page++) {
    items.push(`
      <li class="mx-1 mb-2">
        ${page === activePage
          ? `<span class="btn btn-primary" aria-current="page">${page}</span>`
          : `<button type="button" class="btn btn-outline-primary" data-search-page="${page}">${page}</button>`}
      </li>`);
  }

  items.push(`
    <li class="mx-1 mb-2">
      ${activePage === totalPages
        ? '<span class="btn btn-outline-primary disabled" aria-disabled="true"><span class="d-none d-sm-inline">Next </span><span aria-hidden="true">&raquo;</span></span>'
        : `<button type="button" class="btn btn-outline-primary" data-search-page="${activePage + 1}" aria-label="Next"><span class="d-none d-sm-inline">Next </span><span aria-hidden="true">&raquo;</span></button>`}
    </li>`);

  paginationContainer.innerHTML = `<ul class="list-unstyled d-flex flex-wrap justify-content-center mb-0">${items.join('')}</ul>`;
  paginationContainer.classList.remove('d-none');
}

function renderSearchResults(searchTerm, page = 1) {
  const postsGrid = getPostsGrid();
  if (!postsGrid) {
    return;
  }

  const normalizedTerm = searchTerm.trim();
  if (!normalizedTerm) {
    restoreDefaultPostsView();
    return;
  }

  if (!postsData.length) {
    filterPostsOnPage(normalizedTerm);
    updateSearchStatus(0, 1, normalizedTerm);
    return;
  }

  const matches = searchPosts(normalizedTerm, 1);
  const perPage = getPostsPerPage();
  const totalPages = Math.max(1, Math.ceil(matches.length / perPage));
  const activePage = Math.min(Math.max(page, 1), totalPages);
  const startIndex = (activePage - 1) * perPage;
  const pageMatches = matches.slice(startIndex, startIndex + perPage);

  if (pageMatches.length > 0) {
    postsGrid.innerHTML = pageMatches.map(renderPostCard).join('');
  } else {
    postsGrid.innerHTML = '';
  }

  renderSearchPagination(totalPages, activePage);
  updateSearchStatus(matches.length, activePage, normalizedTerm);
}

// Sync search inputs (desktop and mobile)
async function syncSearchInputs(value) {
  const desktopInput = document.getElementById('search-posts-input');
  const mobileInput = document.getElementById('search-posts-input-mobile');
  const normalizedValue = value || '';
  
  if (desktopInput && desktopInput.value !== normalizedValue) {
    desktopInput.value = normalizedValue;
  }
  if (mobileInput && mobileInput.value !== normalizedValue) {
    mobileInput.value = normalizedValue;
  }
  
  currentSearchTerm = normalizedValue;
  currentSearchPage = 1;
  await postsDataPromise;
  renderSearchResults(normalizedValue, currentSearchPage);
}

// Display search results on dedicated search page
function displayResults(results) {
  const resultsContainer = document.getElementById('search-results');
  
  if (!resultsContainer) return;

  if (results.length === 0) {
    resultsContainer.innerHTML = '<p class="text-muted">No posts found. Try a different search term.</p>';
    return;
  }

  const html = results.map(post => `
    <div class="search-result">
      <h4><a href="${post.url}">${post.title}</a></h4>
      ${post.subtitle ? `<p class="text-muted">${post.subtitle}</p>` : ''}
      <small class="text-muted">
        <i class="fa fa-calendar"></i> ${post.date}
        ${post.tags && post.tags.length > 0 ? `| <i class="fa fa-tags"></i> ${post.tags.join(', ')}` : ''}
      </small>
      <p>${post.excerpt}</p>
    </div>
  `).join('');

  resultsContainer.innerHTML = html;
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
  postsDataPromise = loadPosts();

  const postsGrid = getPostsGrid();
  const paginationContainer = getPaginationContainer();

  if (postsGrid) {
    postsGridOriginalHTML = postsGrid.innerHTML;
  }

  if (paginationContainer) {
    paginationOriginalHTML = paginationContainer.innerHTML;
    paginationOriginalHidden = paginationContainer.classList.contains('d-none');

    paginationContainer.addEventListener('click', function(event) {
      const trigger = event.target.closest('[data-search-page]');
      if (!trigger) {
        return;
      }

      event.preventDefault();
      const nextPage = Number(trigger.dataset.searchPage);
      if (!Number.isFinite(nextPage)) {
        return;
      }

      currentSearchPage = nextPage;
      renderSearchResults(currentSearchTerm, currentSearchPage);
    });
  }

  // Mobile search button toggle
  const mobileSearchBtn = document.getElementById('mobile-search-btn');
  const mobileSearchContainer = document.getElementById('mobile-search-container');
  const mobileSearchInput = document.getElementById('search-posts-input-mobile');
  
  if (mobileSearchBtn) {
    mobileSearchBtn.addEventListener('click', function() {
      mobileSearchContainer.classList.toggle('d-none');
      if (!mobileSearchContainer.classList.contains('d-none')) {
        mobileSearchInput.focus();
      }
    });
  }

  // Desktop search input
  const searchPostsInput = document.getElementById('search-posts-input');
  if (searchPostsInput) {
    searchPostsInput.addEventListener('input', function() {
      syncSearchInputs(this.value);
    });
  }

  // Mobile search input
  if (mobileSearchInput) {
    mobileSearchInput.addEventListener('input', function() {
      syncSearchInputs(this.value);
    });
  }

  // Search input on dedicated search page
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      if (this.value.trim().length >= 2) {
        const results = searchPosts(this.value);
        displayResults(results);
      } else {
        displayResults([]);
      }
    });

    // Initial search if query parameter exists
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');
    if (query) {
      searchInput.value = query;
      searchInput.dispatchEvent(new Event('keyup'));
    }
  }
});

// Search posts (for dedicated search page)
function searchPosts(query, minimumLength = 2) {
  if (!query || query.trim().length < minimumLength) {
    return [];
  }

  const searchTerm = query.toLowerCase();

  return postsData.filter(post => {
    const titleMatch = post.title.toLowerCase().includes(searchTerm);
    const subtitleMatch = post.subtitle && post.subtitle.toLowerCase().includes(searchTerm);
    const contentMatch = post.content.toLowerCase().includes(searchTerm);
    const tagsMatch = post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchTerm));

    return titleMatch || subtitleMatch || contentMatch || tagsMatch;
  });
}
