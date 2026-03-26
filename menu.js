// menu.js – Handles mobile sidebar toggle functionality

(function() {
  // Wait for DOM to be fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  function init() {
    const toggleBtn = document.getElementById('menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    if (!toggleBtn || !sidebar) return;
    
    // Toggle sidebar class when hamburger button is clicked
    toggleBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      sidebar.classList.toggle('open');
    });
    
    // Close sidebar when any link inside it is clicked (optional, improves UX)
    const sidebarLinks = sidebar.querySelectorAll('a');
    sidebarLinks.forEach(link => {
      link.addEventListener('click', function() {
        sidebar.classList.remove('open');
      });
    });
    
    // Close sidebar when clicking outside on mobile (optional)
    document.addEventListener('click', function(e) {
      if (window.innerWidth <= 768) {
        // Check if click is outside the sidebar and not on the toggle button
        if (!sidebar.contains(e.target) && e.target !== toggleBtn && !toggleBtn.contains(e.target)) {
          sidebar.classList.remove('open');
        }
      }
    });
    
    // When window is resized above mobile breakpoint, close the sidebar
    window.addEventListener('resize', function() {
      if (window.innerWidth > 768) {
        sidebar.classList.remove('open');
      }
    });
  }
})();