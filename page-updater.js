// Update HTML files to include all JavaScript files

document.addEventListener('DOMContentLoaded', function() {
  // Add script tags to all pages
  updateScriptTags();
  
  // Initialize active link highlighting
  highlightActiveLink();
  
  // Generate table of contents for each page
  generateTableOfContents();
});

// Add script tags to all pages
function updateScriptTags() {
  // Get all script tags
  const scripts = document.querySelectorAll('script');
  
  // Check if search.js is already included
  let hasSearchScript = false;
  let hasThemeScript = false;
  let hasBackToTopScript = false;
  
  scripts.forEach(script => {
    const src = script.getAttribute('src');
    if (src) {
      if (src.includes('search.js')) hasSearchScript = true;
      if (src.includes('theme.js')) hasThemeScript = true;
      if (src.includes('back-to-top.js')) hasBackToTopScript = true;
    }
  });
  
  // Add missing scripts
  if (!hasSearchScript) {
    const searchScript = document.createElement('script');
    searchScript.src = 'js/search.js';
    document.body.appendChild(searchScript);
  }
  
  if (!hasThemeScript) {
    const themeScript = document.createElement('script');
    themeScript.src = 'js/theme.js';
    document.body.appendChild(themeScript);
  }
  
  if (!hasBackToTopScript) {
    const backToTopScript = document.createElement('script');
    backToTopScript.src = 'js/back-to-top.js';
    document.body.appendChild(backToTopScript);
  }
}

// Highlight active link in navigation
function highlightActiveLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-links a');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || 
        (currentPage === 'index.html' && href === '#') ||
        (href.includes('#') && href.split('#')[0] === currentPage)) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// Generate table of contents from headings
function generateTableOfContents() {
  const tocContainer = document.querySelector('.toc-list');
  const contentContainer = document.querySelector('.content');
  
  if (!tocContainer || !contentContainer) return;
  
  const headings = contentContainer.querySelectorAll('h2, h3');
  
  headings.forEach(heading => {
    // Create ID for the heading if it doesn't have one
    if (!heading.id) {
      heading.id = heading.textContent.toLowerCase().replace(/[^\w]+/g, '-');
    }
    
    const listItem = document.createElement('li');
    const link = document.createElement('a');
    link.href = `#${heading.id}`;
    link.textContent = heading.textContent;
    
    // Add indentation for h3 elements
    if (heading.tagName === 'H3') {
      listItem.style.paddingLeft = '1rem';
    }
    
    listItem.appendChild(link);
    tocContainer.appendChild(listItem);
  });
  
  // Add smooth scrolling for TOC links
  document.querySelectorAll('.toc-list a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80, // Offset for fixed header
          behavior: 'smooth'
        });
        
        // Update URL without page jump
        history.pushState(null, null, targetId);
      }
    });
  });
}
