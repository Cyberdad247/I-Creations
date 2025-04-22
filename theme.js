// Theme toggle functionality for AI Agent Ecosystem Website

document.addEventListener('DOMContentLoaded', function() {
  initThemeToggle();
});

// Initialize theme toggle functionality
function initThemeToggle() {
  // Create theme toggle button
  const themeToggle = document.createElement('button');
  themeToggle.id = 'theme-toggle';
  themeToggle.className = 'theme-toggle';
  themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
  themeToggle.setAttribute('aria-label', 'Toggle dark mode');
  themeToggle.setAttribute('title', 'Toggle dark mode');
  
  // Insert theme toggle button into the navigation
  const navLinks = document.querySelector('.nav-links');
  if (navLinks) {
    const themeToggleContainer = document.createElement('li');
    themeToggleContainer.appendChild(themeToggle);
    navLinks.appendChild(themeToggleContainer);
  }
  
  // Add dark theme styles
  const style = document.createElement('style');
  style.textContent = `
    :root {
      --dark-bg: #121212;
      --dark-card-bg: #1e1e1e;
      --dark-text: #e0e0e0;
      --dark-muted-text: #a0a0a0;
      --dark-border: #333333;
      --dark-hover: #2a2a2a;
      --dark-code-bg: #2d2d2d;
    }
    
    .theme-toggle {
      background: none;
      border: none;
      color: var(--dark-gray);
      font-size: 1.2rem;
      cursor: pointer;
      padding: 0.5rem;
      transition: color 0.3s ease;
    }
    
    .theme-toggle:hover {
      color: var(--primary-color);
    }
    
    body.dark-theme {
      background-color: var(--dark-bg);
      color: var(--dark-text);
    }
    
    body.dark-theme .card,
    body.dark-theme .toc,
    body.dark-theme nav,
    body.dark-theme .search-results,
    body.dark-theme .search-result-item {
      background-color: var(--dark-card-bg);
      color: var(--dark-text);
    }
    
    body.dark-theme .section-title {
      color: var(--primary-color);
      border-bottom-color: var(--dark-border);
    }
    
    body.dark-theme .card-title {
      color: var(--secondary-color);
    }
    
    body.dark-theme .nav-links a,
    body.dark-theme .footer-links a {
      color: var(--dark-muted-text);
    }
    
    body.dark-theme .nav-links a:hover,
    body.dark-theme .footer-links a:hover {
      color: var(--primary-color);
    }
    
    body.dark-theme code {
      background-color: var(--dark-code-bg);
    }
    
    body.dark-theme pre {
      background-color: var(--dark-code-bg);
    }
    
    body.dark-theme .search-result-item:hover {
      background-color: var(--dark-hover);
    }
    
    body.dark-theme #search-input {
      background-color: var(--dark-card-bg);
      color: var(--dark-text);
      border-color: var(--dark-border);
    }
    
    body.dark-theme .mobile-menu-btn {
      color: var(--dark-text);
    }
    
    body.dark-theme .theme-toggle {
      color: var(--dark-text);
    }
    
    body.dark-theme .theme-toggle i::before {
      content: "\\f185"; /* sun icon */
    }
  `;
  document.head.appendChild(style);
  
  // Check for saved theme preference
  const savedTheme = localStorage.getItem('dark-theme');
  if (savedTheme === 'true') {
    document.body.classList.add('dark-theme');
  }
  
  // Add event listener to toggle theme
  themeToggle.addEventListener('click', function() {
    document.body.classList.toggle('dark-theme');
    
    // Save preference to localStorage
    const isDarkTheme = document.body.classList.contains('dark-theme');
    localStorage.setItem('dark-theme', isDarkTheme);
  });
}
