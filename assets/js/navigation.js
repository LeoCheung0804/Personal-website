'use strict';

// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

function getNavTarget(link) {
  return link.dataset.pageTarget || (link.innerText.toLowerCase() === 'projects' ? 'portfolio' : link.innerText.toLowerCase());
}

function activatePage(targetPage, activeLink = null) {
  let foundPage = false;

  for (let i = 0; i < pages.length; i++) {
    if (targetPage === pages[i].dataset.page) {
      pages[i].classList.add("active");
      foundPage = true;
    } else {
      pages[i].classList.remove("active");
    }
  }

  if (!foundPage) return false;

  for (let i = 0; i < navigationLinks.length; i++) {
    const linkTarget = getNavTarget(navigationLinks[i]);
    if (linkTarget === targetPage) {
      navigationLinks[i].classList.add("active");
    } else {
      navigationLinks[i].classList.remove("active");
    }
  }

  window.scrollTo(0, 0);

  if (activeLink && typeof gtag === 'function') {
    gtag('config', 'G-LEBDJN7H6D', {
      'page_title': activeLink.innerHTML,
      'page_path': '/#' + targetPage
    });
  }

  return true;
}

function activatePageFromHash() {
  const hash = window.location.hash.substring(1).toLowerCase();
  if (hash) activatePage(hash);
}

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {

    // Don't run this logic on the blog post page
    if (document.querySelector('.blog-post-full')) {
      return;
    }

    const targetPage = getNavTarget(this);
    const activated = activatePage(targetPage, this);

    if (activated && this.tagName.toLowerCase() === "button") {
      history.pushState(null, "", `#${targetPage}`);
    }

  });
}

// add hash-based page activation on page load, and support browser back/forward
window.addEventListener("DOMContentLoaded", activatePageFromHash);
window.addEventListener("popstate", activatePageFromHash);

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
