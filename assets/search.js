// Search functionality for posts page
let postsData = [];
let currentSearchTerm = '';

// Load posts data
async function loadPosts() {
  try {
    const response = await fetch('/search.json');
    postsData = await response.json();
  } catch (error) {
    console.error('Error loading posts:', error);
  }
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

// Sync search inputs (desktop and mobile)
function syncSearchInputs(value) {
  const desktopInput = document.getElementById('search-posts-input');
  const mobileInput = document.getElementById('search-posts-input-mobile');
  
  if (desktopInput && desktopInput.value !== value) {
    desktopInput.value = value;
  }
  if (mobileInput && mobileInput.value !== value) {
    mobileInput.value = value;
  }
  
  filterPostsOnPage(value);
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
  loadPosts();

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
    searchPostsInput.addEventListener('keyup', function() {
      syncSearchInputs(this.value);
    });
  }

  // Mobile search input
  if (mobileSearchInput) {
    mobileSearchInput.addEventListener('keyup', function() {
      syncSearchInputs(this.value);
    });
  }

  // Search input on dedicated search page
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('keyup', function() {
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
function searchPosts(query) {
  if (!query || query.trim().length < 2) {
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
