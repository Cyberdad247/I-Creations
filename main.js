// Main JavaScript for AI Agent Ecosystem Website

document.addEventListener('DOMContentLoaded', function() {
  // Mobile menu toggle
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  
  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', function() {
      navLinks.classList.toggle('active');
    });
  }
  
  // Table of Contents generation
  generateTableOfContents();
  
  // Smooth scrolling for anchor links
  setupSmoothScrolling();
  
  // Code highlighting
  highlightCode();
  
  // Initialize search functionality
  initSearch();
});

// Generate Table of Contents from headings
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
}

// Setup smooth scrolling for anchor links
function setupSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
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

// Highlight code blocks
function highlightCode() {
  document.querySelectorAll('pre code').forEach(block => {
    // Add a simple syntax highlighting
    const text = block.innerHTML;
    
    // Highlight keywords
    const keywords = ['function', 'return', 'if', 'else', 'for', 'while', 'const', 'let', 'var', 'class', 'import', 'export', 'from', 'async', 'await'];
    
    let highlightedText = text;
    
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'g');
      highlightedText = highlightedText.replace(regex, `<span class="keyword">${keyword}</span>`);
    });
    
    // Highlight strings
    highlightedText = highlightedText.replace(/(["'`])(.*?)\1/g, '<span class="string">$&</span>');
    
    // Highlight comments
    highlightedText = highlightedText.replace(/(\/\/.*)/g, '<span class="comment">$1</span>');
    
    block.innerHTML = highlightedText;
  });
}

// Initialize search functionality
function initSearch() {
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');
  
  if (!searchInput || !searchResults) return;
  
  searchInput.addEventListener('input', function() {
    const query = this.value.toLowerCase();
    
    if (query.length < 2) {
      searchResults.innerHTML = '';
      searchResults.style.display = 'none';
      return;
    }
    
    // Get all content sections
    const contentSections = document.querySelectorAll('.content h2, .content h3, .content p');
    const results = [];
    
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
          id: section.id || (section.closest('[id]') ? section.closest('[id]').id : '')
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
        
        resultItem.innerHTML = resultHTML;
        
        if (result.id) {
          resultItem.addEventListener('click', function() {
            window.location.href = `#${result.id}`;
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
  });
  
  // Close search results when clicking outside
  document.addEventListener('click', function(e) {
    if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
      searchResults.style.display = 'none';
    }
  });
}

// Theme toggle functionality
function toggleTheme() {
  const body = document.body;
  body.classList.toggle('dark-theme');
  
  // Save preference to localStorage
  const isDarkTheme = body.classList.contains('dark-theme');
  localStorage.setItem('dark-theme', isDarkTheme);
}

// Check for saved theme preference
const savedTheme = localStorage.getItem('dark-theme');
if (savedTheme === 'true') {
  document.body.classList.add('dark-theme');
}
