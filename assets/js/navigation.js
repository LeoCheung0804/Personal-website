'use strict';

// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");
const defaultPageTarget = document.querySelector("[data-page].active")?.dataset.page
  || (pages[0] && pages[0].dataset.page);

function initMobileNavigation() {
  const navigation = document.querySelector("[data-mobile-nav]");
  const toggle = navigation?.querySelector("[data-mobile-nav-btn]");
  const panel = navigation?.querySelector("[data-mobile-nav-panel]");
  if (!navigation || !toggle || !panel) return;

  const mobileQuery = window.matchMedia("(max-width: 700px)");
  navigation.classList.add("mobile-nav-ready");

  const setMenuOpen = (open, { restoreFocus = false } = {}) => {
    const isMobile = mobileQuery.matches;
    const expanded = Boolean(open && isMobile);
    const labelKey = expanded ? "nav.closeMenu" : "nav.menu";
    const label = typeof getTranslation === "function"
      ? getTranslation(labelKey)
      : expanded ? "Close menu" : "Menu";
    const visibleLabel = toggle.querySelector("span");
    const icon = toggle.querySelector("ion-icon");

    navigation.classList.toggle("mobile-nav-open", expanded);
    toggle.setAttribute("aria-expanded", String(expanded));
    toggle.setAttribute("aria-label", label);
    toggle.dataset.i18nAriaLabel = labelKey;

    if (visibleLabel) {
      visibleLabel.dataset.i18n = labelKey;
      visibleLabel.textContent = label;
    }
    if (icon) icon.setAttribute("name", expanded ? "close-outline" : "menu-outline");

    if (isMobile && !expanded) {
      panel.setAttribute("inert", "");
      panel.setAttribute("aria-hidden", "true");
    } else {
      panel.removeAttribute("inert");
      panel.removeAttribute("aria-hidden");
    }

    if (restoreFocus) toggle.focus();
  };

  toggle.addEventListener("click", () => {
    setMenuOpen(!navigation.classList.contains("mobile-nav-open"));
  });

  panel.querySelectorAll("[data-nav-link]").forEach((link) => {
    link.addEventListener("click", () => setMenuOpen(false));
  });

  navigation.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || !navigation.classList.contains("mobile-nav-open")) return;
    event.preventDefault();
    setMenuOpen(false, { restoreFocus: true });
  });

  mobileQuery.addEventListener("change", () => setMenuOpen(false));
  window.addEventListener("site-language-change", () => {
    setMenuOpen(navigation.classList.contains("mobile-nav-open"));
  });
  setMenuOpen(false);
}

initMobileNavigation();

function normalizePageTarget(target) {
  const value = String(target || "").replace(/^#/, "").trim();

  try {
    return decodeURIComponent(value).toLowerCase();
  } catch (error) {
    return value.toLowerCase();
  }
}

function getNavTarget(link) {
  if (link.dataset.pageTarget) {
    return normalizePageTarget(link.dataset.pageTarget);
  }

  const href = link.getAttribute("href") || "";
  const hashIndex = href.indexOf("#");

  if (hashIndex >= 0 && hashIndex < href.length - 1) {
    return normalizePageTarget(href.slice(hashIndex + 1));
  }

  const label = normalizePageTarget(link.textContent);
  return label === "projects" ? "portfolio" : label;
}

function preparePageForFocus(page, targetPage) {
  const title = page.querySelector(".article-title, h1, h2");

  if (title) {
    if (!title.id) title.id = `${targetPage}-page-title`;
    page.setAttribute("aria-labelledby", title.id);
  }

  if (!page.hasAttribute("tabindex")) {
    page.setAttribute("tabindex", "-1");
  }
}

function focusActivePage(page) {
  requestAnimationFrame(() => {
    if (!page.classList.contains("active")) return;

    try {
      page.focus({ preventScroll: true });
    } catch (error) {
      page.focus();
    }
  });
}

function activatePage(targetPage, activeLink = null, options = {}) {
  const normalizedTarget = normalizePageTarget(targetPage);
  const activePage = [...pages].find((page) => page.dataset.page === normalizedTarget);
  const navigationTarget = normalizedTarget === "blog-post" ? "blog" : normalizedTarget;

  if (!activePage) return false;

  for (let i = 0; i < pages.length; i++) {
    const isActive = pages[i] === activePage;
    pages[i].classList.toggle("active", isActive);

    if (isActive) {
      pages[i].removeAttribute("aria-hidden");
      preparePageForFocus(pages[i], normalizedTarget);
    } else {
      pages[i].setAttribute("aria-hidden", "true");
    }
  }

  for (let i = 0; i < navigationLinks.length; i++) {
    const linkTarget = getNavTarget(navigationLinks[i]);
    const isActive = linkTarget === navigationTarget;
    navigationLinks[i].classList.toggle("active", isActive);

    if (isActive) {
      navigationLinks[i].setAttribute("aria-current", "page");
    } else {
      navigationLinks[i].removeAttribute("aria-current");
    }
  }

  if (options.scroll !== false) {
    window.scrollTo(0, 0);
  }

  if (activeLink && typeof gtag === 'function') {
    gtag('config', 'G-LEBDJN7H6D', {
      'page_title': activeLink.innerHTML,
      'page_path': '/#' + normalizedTarget
    });
  }

  document.dispatchEvent(new CustomEvent("site:page-activated", {
    detail: {
      page: activePage,
      targetPage: normalizedTarget
    }
  }));

  const shouldFocus = options.focus === true || (options.focus !== false && Boolean(activeLink));
  if (shouldFocus) focusActivePage(activePage);

  return true;
}

function activatePageFromHash(event) {
  const hash = normalizePageTarget(window.location.hash);
  const currentPage = document.querySelector("[data-page].active");
  const targetPage = hash || defaultPageTarget || (currentPage && currentPage.dataset.page);

  if (!targetPage) return;

  const activated = activatePage(targetPage, null, {
    focus: Boolean(event && event.type === "popstate"),
    scroll: Boolean(hash)
  });

  if (!activated && currentPage) {
    activatePage(currentPage.dataset.page, null, { focus: false, scroll: false });
  }
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
