// Search functionality for AI Agent Ecosystem Website

document.addEventListener('DOMContentLoaded', function() {
  initSearch();
});

// Initialize search functionality
function initSearch() {
  const searchContainer = document.createElement('div');
  searchContainer.className = 'search-container';
  searchContainer.innerHTML = `
    <div class="search-box">
      <input type="text" id="search-input" placeholder="Search the website...">
      <button id="search-button"><i class="fas fa-search"></i></button>
    </div>
    <div id="search-results" class="search-results"></div>
  `;
  
  // Insert search container into the navigation
  const navContainer = document.querySelector('.nav-container');
  if (navContainer) {
    navContainer.appendChild(searchContainer);
  }
  
  // Style the search container
  const style = document.createElement('style');
  style.textContent = `
    .search-container {
      position: relative;
      margin-left: auto;
      margin-right: 20px;
    }
    
    .search-box {
      display: flex;
      align-items: center;
    }
    
    #search-input {
      padding: 8px 12px;
      border: 1px solid var(--light-gray);
      border-radius: 4px 0 0 4px;
      font-size: 14px;
      width: 200px;
    }
    
    #search-button {
      background-color: var(--primary-color);
      color: white;
      border: none;
      padding: 8px 12px;
      border-radius: 0 4px 4px 0;
      cursor: pointer;
    }
    
    .search-results {
      display: none;
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background-color: white;
      border: 1px solid var(--light-gray);
      border-radius: 4px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      z-index: 1000;
      max-height: 300px;
      overflow-y: auto;
    }
    
    .search-result-item {
      padding: 10px;
      border-bottom: 1px solid var(--light-gray);
      cursor: pointer;
    }
    
    .search-result-item:hover {
      background-color: var(--light-gray);
    }
    
    .search-result-item:last-child {
      border-bottom: none;
    }
    
    @media (max-width: 768px) {
      .search-container {
        width: 100%;
        margin: 10px 0;
        order: 3;
      }
      
      #search-input {
        width: 100%;
      }
    }
  `;
  document.head.appendChild(style);
  
  // Add event listeners
  const searchInput = document.getElementById('search-input');
  const searchButton = document.getElementById('search-button');
  const searchResults = document.getElementById('search-results');
  
  if (searchInput && searchButton && searchResults) {
    // Search on input
    searchInput.addEventListener('input', function() {
      performSearch(this.value);
    });
    
    // Search on button click
    searchButton.addEventListener('click', function() {
      performSearch(searchInput.value);
    });
    
    // Close search results when clicking outside
    document.addEventListener('click', function(e) {
      if (!searchInput.contains(e.target) && !searchResults.contains(e.target) && !searchButton.contains(e.target)) {
        searchResults.style.display = 'none';
      }
    });
  }
}

// Perform search across all pages
function performSearch(query) {
  const searchResults = document.getElementById('search-results');
  
  if (!searchResults) return;
  
  if (query.length < 2) {
    searchResults.innerHTML = '';
    searchResults.style.display = 'none';
    return;
  }
  
  query = query.toLowerCase();
  
  // Get all content sections on the current page
  const contentSections = document.querySelectorAll('.content h2, .content h3, .content p');
  const results = [];
  
  // Search in current page
  contentSections.forEach(section => {
    const text = section.textContent.toLowerCase();
    
    if (text.includes(query)) {
      let resultType = 'paragraph';
      let parentHeading = '';
      
      if (section.tagName === 'H2') {
        resultType = 'heading';
      } else if (section.tagName === 'H3') {
        resultType = 'subheading';
      } else {
        // Find the closest heading for context
        let currentElement = section.previousElementSibling;
        while (currentElement && !['H2', 'H3'].includes(currentElement.tagName)) {
          currentElement = currentElement.previousElementSibling;
        }
        
        if (currentElement) {
          parentHeading = currentElement.textContent;
        }
      }
      
      results.push({
        type: resultType,
        text: section.textContent,
        parentHeading: parentHeading,
        id: section.id || (section.closest('[id]') ? section.closest('[id]').id : ''),
        page: getCurrentPage()
      });
    }
  });
  
  // Display results
  if (results.length > 0) {
    searchResults.innerHTML = '';
    
    results.slice(0, 5).forEach(result => {
      const resultItem = document.createElement('div');
      resultItem.className = 'search-result-item';
      
      let resultHTML = '';
      
      if (result.type === 'heading') {
        resultHTML = `<h3>${result.text}</h3>`;
      } else if (result.type === 'subheading') {
        resultHTML = `<h4>${result.text}</h4>`;
      } else {
        resultHTML = `
          <p><strong>${result.parentHeading}</strong></p>
          <p>${result.text.substring(0, 100)}${result.text.length > 100 ? '...' : ''}</p>
        `;
      }
      
      if (result.page) {
        resultHTML += `<small>Page: ${result.page}</small>`;
      }
      
      resultItem.innerHTML = resultHTML;
      
      if (result.id) {
        resultItem.addEventListener('click', function() {
          if (result.page === getCurrentPage()) {
            window.location.href = `#${result.id}`;
          } else {
            window.location.href = `${result.page}#${result.id}`;
          }
          searchResults.style.display = 'none';
        });
      }
      
      searchResults.appendChild(resultItem);
    });
    
    searchResults.style.display = 'block';
  } else {
    searchResults.innerHTML = '<div class="search-result-item">No results found</div>';
    searchResults.style.display = 'block';
  }
}

// Get current page name
function getCurrentPage() {
  const path = window.location.pathname;
  const page = path.split('/').pop();
  return page || 'index.html';
}
