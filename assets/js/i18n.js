'use strict';

const supportedLanguages = Object.keys(translations);
const defaultLanguage = "en";
const storedLanguage = localStorage.getItem("language");
let currentLanguage = supportedLanguages.includes(storedLanguage) ? storedLanguage : defaultLanguage;
let loadedBlogPosts = [];

function getTranslation(key, language = currentLanguage) {
  return translations[language]?.[key] || translations[defaultLanguage]?.[key] || key;
}

function applyTranslations(language = currentLanguage) {
  currentLanguage = supportedLanguages.includes(language) ? language : defaultLanguage;

  document.documentElement.lang = currentLanguage === "zhHant" ? "zh-Hant" : "en";

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.innerHTML = getTranslation(element.dataset.i18n);
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    element.setAttribute("placeholder", getTranslation(element.dataset.i18nPlaceholder));
  });

  document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
    element.setAttribute("aria-label", getTranslation(element.dataset.i18nAriaLabel));
  });

  applySharedShellTranslations(currentLanguage);
  applyProjectPageTranslations(currentLanguage);
}

function setText(selector, key, language = currentLanguage) {
  const element = document.querySelector(selector);
  if (element) {
    element.textContent = getTranslation(key, language);
  }
}

function applySharedShellTranslations(language = currentLanguage) {
  setText(".info-content .title", "profile.title", language);
  setText("[data-sidebar-btn] span", "sidebar.showContacts", language);
  setText(".contacts-list .contact-item:nth-child(1) .contact-title", "contact.email", language);
  setText(".contacts-list .contact-item:nth-child(2) .contact-title", "contact.location", language);
  setText(".contacts-list .contact-item:nth-child(2) address", "contact.hongKong", language);
  setText(".contacts-list .contact-item:nth-child(3) .contact-title", "contact.employer", language);
  setText(".contacts-list .contact-item:nth-child(4) .contact-title", "contact.organization", language);
  setText(".back-to-top", "footer.backToTop", language);
}

function getCurrentProjectPageKey() {
  const pageName = window.location.pathname.split("/").pop().replace(".html", "");
  return projectPageAliases[pageName] || pageName;
}

function applyProjectPageTranslations(language = currentLanguage) {
  const projectKey = getCurrentProjectPageKey();
  const projectCopy = projectPageTranslations[projectKey]?.[language];
  if (!projectCopy) return;

  const backLink = document.querySelector(".btn-back");
  const pageTitle = document.querySelector(".portfolio.active .article-title");
  const overviewTitle = document.querySelector(".project-detail .title");
  const projectContent = document.querySelector(".project-detail .project-content");

  if (backLink) {
    backLink.innerHTML = `&larr; ${getTranslation("projects.back", language)}`;
  }

  if (pageTitle) {
    pageTitle.textContent = projectCopy.title;
    document.title = `${projectCopy.title} | Leo Cheung`;
  }

  if (overviewTitle) {
    overviewTitle.textContent = getTranslation("project.overview", language);
  }

  if (projectContent) {
    projectContent.innerHTML = projectCopy.content;
  }
}

function getNextLanguage(language = currentLanguage) {
  return language === "en" ? "zhHant" : "en";
}

function updateLanguageButton() {
  const langLabel = document.querySelector("[data-lang-label]");
  if (!langLabel) return;

  langLabel.textContent = currentLanguage === "en" ? "\u7e41" : "EN";
}

function localizePostField(post, field) {
  const languageSuffix = currentLanguage === "zhHant" ? "ZhHant" : "En";
  const snakeSuffix = currentLanguage === "zhHant" ? "zhHant" : "en";

  return post[`${field}${languageSuffix}`] || post[`${field}_${snakeSuffix}`] || post[field] || "";
}

function formatPostDate(date) {
  if (!date) return "";

  const locale = currentLanguage === "zhHant" ? "zh-HK" : "en-US";
  return new Date(date).toLocaleDateString(locale, {
    month: "short",
    day: "2-digit",
    year: "numeric"
  });
}

function renderBlogPosts(posts = loadedBlogPosts) {
  const blogList = document.getElementById('dynamic-blog-list');
  if (!blogList) return;

  blogList.innerHTML = '';

  posts.forEach(post => {
    const title = localizePostField(post, "title") || post.filename;
    const category = localizePostField(post, "category");
    const summary = localizePostField(post, "summary");
    const dateStr = formatPostDate(post.date);

    const li = document.createElement('li');
    li.className = 'blog-post-item tilt-card fade-seed';

    li.innerHTML = `
      <a href="${post.url || `blog-post.html?post=${post.filename}`}" class="magnetic" data-magnetic>
        ${post.image ? `<figure class="blog-banner-box"><img src="${post.image}" alt="${title}" loading="lazy"></figure>` : ''}
        <div class="blog-content">
          <div class="blog-meta">
            ${category ? `<p class="blog-category">${category}</p><span class="dot"></span>` : ''}
            ${post.date ? `<time datetime="${post.date}">${dateStr}</time>` : ''}
          </div>
          <h3 class="h3 blog-item-title">${title}</h3>
          <p class="blog-text">${summary}</p>
        </div>
      </a>
    `;
    blogList.appendChild(li);
  });

  applyRandomFade();
  initMagneticButtons();
  initTiltCards();
}

function syncSelectLabels() {
  const activeFilterBtn = document.querySelector("[data-filter-btn].active");
  if (selectValue && activeFilterBtn) {
    selectValue.textContent = activeFilterBtn.textContent.trim();
  }

  const activePublicationFilterBtn = document.querySelector("[data-publication-filter-btn].active");
  if (publicationSelectValue && activePublicationFilterBtn) {
    publicationSelectValue.textContent = activePublicationFilterBtn.textContent.trim();
  }
}

function setLanguage(language) {
  currentLanguage = supportedLanguages.includes(language) ? language : defaultLanguage;
  localStorage.setItem("language", currentLanguage);
  applyTranslations(currentLanguage);
  updateLanguageButton();
  syncSelectLabels();
  renderBlogPosts();
  window.dispatchEvent(new CustomEvent("site-language-change", { detail: { language: currentLanguage } }));
}
