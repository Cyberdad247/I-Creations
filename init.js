// Update all HTML files to include the new JavaScript files
document.addEventListener('DOMContentLoaded', function() {
  const mainScript = document.createElement('script');
  mainScript.src = 'js/page-updater.js';
  document.body.appendChild(mainScript);
});
