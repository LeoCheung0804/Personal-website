'use strict';

// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {

    // Don't run this logic on the blog post page
    if (document.querySelector('.blog-post-full')) {
      return;
    }

    const targetPage = this.dataset.pageTarget || (this.innerText.toLowerCase() === 'projects' ? 'portfolio' : this.innerText.toLowerCase());

    for (let i = 0; i < pages.length; i++) {
      if (targetPage === pages[i].dataset.page) {
        pages[i].classList.add("active");
        navigationLinks[i].classList.add("active");
        window.scrollTo(0, 0);
        
        // Track page view in Google Analytics
        if (typeof gtag === 'function') {
          gtag('config', 'G-LEBDJN7H6D', {
            'page_title': this.innerHTML,
            'page_path': '/#' + pages[i].dataset.page
          });
        }
      } else {
        pages[i].classList.remove("active");
        navigationLinks[i].classList.remove("active");
      }
    }

  });
}

// add hash-based page activation on page load, and ensure Portfolio remains active
window.addEventListener("DOMContentLoaded", () => {
  const hash = window.location.hash.substring(1).toLowerCase();
  if (hash) {
    for (let i = 0; i < pages.length; i++) {
      if (pages[i].dataset.page === hash) {
        pages[i].classList.add("active");
        navigationLinks[i].classList.add("active");
        window.scrollTo(0, 0);
      } else {
        pages[i].classList.remove("active");
        navigationLinks[i].classList.remove("active");
      }
    }
  } 
});

// Track project link clicks
const projectLinks = document.querySelectorAll('.project-item a');
projectLinks.forEach(link => {
  link.addEventListener('click', function() {
    const projectTitle = this.querySelector('.project-title');
    if (projectTitle && typeof trackProjectView === 'function') {
      trackProjectView(projectTitle.textContent);
    }
  });
});
