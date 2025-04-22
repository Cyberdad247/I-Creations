// Back to top button functionality for AI Agent Ecosystem Website

document.addEventListener('DOMContentLoaded', function() {
  initBackToTop();
});

// Initialize back to top button
function initBackToTop() {
  // Create back to top button
  const backToTopBtn = document.createElement('button');
  backToTopBtn.id = 'back-to-top';
  backToTopBtn.className = 'back-to-top';
  backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
  backToTopBtn.setAttribute('aria-label', 'Back to top');
  backToTopBtn.setAttribute('title', 'Back to top');
  
  // Append button to body
  document.body.appendChild(backToTopBtn);
  
  // Add styles
  const style = document.createElement('style');
  style.textContent = `
    .back-to-top {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background-color: var(--primary-color);
      color: white;
      border: none;
      border-radius: 50%;
      width: 50px;
      height: 50px;
      font-size: 1.2rem;
      cursor: pointer;
      display: none;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
      z-index: 1000;
      transition: background-color 0.3s ease, transform 0.3s ease;
    }
    
    .back-to-top:hover {
      background-color: #2a75e6;
      transform: translateY(-3px);
    }
    
    .back-to-top.visible {
      display: flex;
    }
    
    body.dark-theme .back-to-top {
      background-color: var(--primary-color);
    }
  `;
  document.head.appendChild(style);
  
  // Show/hide button based on scroll position
  window.addEventListener('scroll', function() {
    if (window.pageYOffset > 300) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });
  
  // Scroll to top when button is clicked
  backToTopBtn.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}
