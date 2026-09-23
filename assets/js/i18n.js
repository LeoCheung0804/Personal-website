'use strict';

const supportedLanguages = Object.keys(translations);
const defaultLanguage = "en";
const storedLanguage = localStorage.getItem("language");
let currentLanguage = supportedLanguages.includes(storedLanguage) ? storedLanguage : defaultLanguage;
let loadedBlogPosts = [];
const projectMediaByContainer = new WeakMap();

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
    const translatedPlaceholder = getTranslation(element.dataset.i18nPlaceholder);
    element.setAttribute("placeholder", translatedPlaceholder);
    element.setAttribute("aria-label", translatedPlaceholder);
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

function getLocalizedProfileValue(value, language = currentLanguage) {
  if (!value || typeof value !== "object") return value || "";
  return value[language] || value[defaultLanguage] || "";
}

function applySharedShellTranslations(language = currentLanguage) {
  const profileName = document.querySelector(".info-content .name");
  if (profileName) {
    profileName.textContent = siteProfile.name;
    const fullName = document.createElement("span");
    fullName.className = "full-name";
    fullName.textContent = siteProfile.fullName;
    profileName.append(fullName);
    profileName.setAttribute("title", `${siteProfile.fullName} (${siteProfile.name})`);
  }

  const profileTitle = document.querySelector(".info-content .title");
  if (profileTitle) {
    profileTitle.textContent = getLocalizedProfileValue(siteProfile.role, language);
  }

  const sidebarButton = document.querySelector("[data-sidebar-btn]");
  const sidebarLabelKey = sidebarButton?.getAttribute("aria-expanded") === "true"
    ? "sidebar.hideContacts"
    : "sidebar.showContacts";
  setText("[data-sidebar-btn] span", sidebarLabelKey, language);

  if (sidebarButton) {
    sidebarButton.dataset.i18nAriaLabel = sidebarLabelKey;
    sidebarButton.setAttribute("aria-label", getTranslation(sidebarLabelKey, language));
  }

  document.querySelectorAll(".contacts-list .contact-item").forEach((item, index) => {
    const contact = siteProfile.contacts.find(({ id }) => id === item.dataset.contactId)
      || siteProfile.contacts[index];
    if (!contact) return;

    const label = item.querySelector(".contact-title");
    if (label) {
      label.textContent = contact.labelKey
        ? getTranslation(contact.labelKey, language)
        : contact.label;
    }

    if (contact.id === "location") {
      const address = item.querySelector("address");
      if (address) {
        address.textContent = getLocalizedProfileValue(siteProfile.location, language);
      }
      return;
    }

    const link = item.querySelector(".contact-link");
    if (link) {
      link.textContent = contact.value;
      link.setAttribute("href", contact.href);
    }
  });

  setText(".back-to-top", "footer.backToTop", language);

  const copyright = document.querySelector(".copyright");
  if (copyright) {
    copyright.textContent = `© ${siteProfile.copyrightYear} ${siteProfile.fullName} (${siteProfile.name})`;
  }
}

function getCurrentProjectPageKey() {
  const projectRoot = document.querySelector("[data-project-key]");
  if (projectRoot?.dataset.projectKey) {
    return projectRoot.dataset.projectKey;
  }

  const pageName = window.location.pathname.split("/").pop().replace(".html", "");
  return projectPageAliases[pageName] || pageName;
}

function renderTranslatedProjectContent(container, content) {
  // The generated HTML already has responsive media from the image manifest.
  // Keep that metadata keyed by original source, rather than image order or alt text.
  let mediaBySource = projectMediaByContainer.get(container);
  const mediaAttributes = ['src', 'srcset', 'sizes', 'width', 'height', 'loading', 'decoding', 'data-media-source'];
  if (!mediaBySource) {
    mediaBySource = new Map();
    container.querySelectorAll('img[data-media-source]').forEach((image) => {
      const source = new URL(image.dataset.mediaSource, document.baseURI).href;
      mediaBySource.set(source, image);
    });
    projectMediaByContainer.set(container, mediaBySource);
  }

  // Template contents are inert: never insert original image URLs into the live
  // document before restoring their optimized candidates (even for one frame).
  const template = document.createElement('template');
  template.innerHTML = content;
  template.content.querySelectorAll('img').forEach((image) => {
    const source = image.getAttribute('data-media-source') || image.getAttribute('src');
    const optimized = source && mediaBySource.get(new URL(source, document.baseURI).href);
    if (optimized) {
      mediaAttributes.forEach((name) => {
        const value = optimized.getAttribute(name);
        if (value !== null) image.setAttribute(name, value);
      });
    }
    if (!image.hasAttribute('loading')) image.setAttribute('loading', 'lazy');
    if (!image.hasAttribute('decoding')) image.setAttribute('decoding', 'async');
  });
  template.content.querySelectorAll('iframe').forEach((frame) => {
    frame.setAttribute('loading', 'lazy');
  });
  container.replaceChildren(template.content);
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
    document.title = `${projectCopy.title} | ${siteProfile.fullName}`;
  }

  if (overviewTitle) {
    overviewTitle.textContent = getTranslation("project.overview", language);
  }

  if (projectContent) {
    renderTranslatedProjectContent(projectContent, projectCopy.content);
  }
}

function getNextLanguage(language = currentLanguage) {
  return language === "en" ? "zhHant" : "en";
}

function updateLanguageButton() {
  const langButton = document.querySelector("[data-lang-btn]");
  const langLabel = document.querySelector("[data-lang-label]");
  if (!langButton || !langLabel) return;

  const isEnglish = currentLanguage === "en";
  const labelKey = isEnglish ? "language.switchToZhHant" : "language.switchToEnglish";

  langLabel.textContent = isEnglish ? "\u7e41" : "EN";
  langLabel.setAttribute("lang", isEnglish ? "zh-Hant" : "en");
  langButton.dataset.i18nAriaLabel = labelKey;
  langButton.setAttribute("aria-label", getTranslation(labelKey));
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
    const imageMedia = post.imageMedia;
    const imageAttributes = imageMedia
      ? `src="${imageMedia.src}" srcset="${imageMedia.srcset}" sizes="${imageMedia.sizes}" width="${imageMedia.width}" height="${imageMedia.height}" data-media-source="${imageMedia.source}"`
      : `src="${post.image}"`;

    const li = document.createElement('li');
    li.className = 'blog-post-item tilt-card fade-seed';

    li.innerHTML = `
      <a href="${post.url || `blog-post.html?post=${post.filename}`}" class="magnetic" data-magnetic>
        ${post.image ? `<figure class="blog-banner-box"><img ${imageAttributes} alt="${title}" loading="lazy" decoding="async"></figure>` : ''}
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
  if (typeof syncFilterControls === "function") {
    syncFilterControls();
    return;
  }

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
