const fs = require('fs');
const path = require('path');
const { commitFileTransaction } = require('./scripts/generation-transaction.js');
const {
  CARD_SIZES,
  optimizeMediaMarkup,
  responsiveMedia
} = require('./scripts/media-markup.js');
const mediaManifest = require('./assets/data/media-manifest.json');
const {
  siteProfile,
  siteProjects,
  standalonePages,
  translations,
  validateSiteData
} = require('./assets/js/site-data.js');

validateSiteData();

const profileContacts = Object.fromEntries(
  siteProfile.contacts.map(contact => [contact.id, contact])
);

const siteUrl = siteProfile.siteUrl;
const postsDir = path.join(__dirname, 'posts');
const blogDir = path.join(__dirname, 'blog');
const outputFile = path.join(__dirname, 'assets', 'data', 'posts.json');
const sitemapFile = path.join(__dirname, 'sitemap.xml');
const homepageFile = path.join(__dirname, 'index.html');
const checkMode = process.argv.includes('--check');

const staticSitemapPages = [
  { path: '', lastmod: siteProfile.seo.lastmod, changefreq: 'weekly', priority: '1.0' },
  ...Object.values(siteProjects).map(project => ({
    path: project.file,
    lastmod: project.seo.lastmod,
    changefreq: 'monthly',
    priority: '0.8'
  })),
  ...Object.values(standalonePages).map(page => ({
    path: page.file,
    lastmod: page.seo.lastmod,
    changefreq: 'weekly',
    priority: '0.6'
  }))
];

function ensureDirectory(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function removeObsoleteBlogPages(desiredOutputPaths) {
  const resolvedBlogDir = path.resolve(blogDir);
  const resolvedWorkspace = path.resolve(__dirname);

  if (!resolvedBlogDir.startsWith(`${resolvedWorkspace}${path.sep}`)) {
    throw new Error(`Refusing to clean blog output outside workspace: ${resolvedBlogDir}`);
  }

  ensureDirectory(blogDir);

  const desiredFiles = new Set(desiredOutputPaths.map(outputPath => path.resolve(outputPath)));

  fs.readdirSync(blogDir)
    .filter(file => file.endsWith('.html'))
    .map(file => path.resolve(blogDir, file))
    .filter(outputPath => !desiredFiles.has(outputPath))
    .forEach(outputPath => fs.unlinkSync(outputPath));
}

function parseFrontMatter(content) {
  const frontMatterMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  const metadata = {};

  if (!frontMatterMatch) {
    return { metadata, body: content.trim() };
  }

  frontMatterMatch[1].split(/\r?\n/).forEach(line => {
    const match = line.match(/^([^:]+):\s*(.*)$/);
    if (!match) return;

    const key = match[1].trim();
    let value = match[2].trim();
    value = value.replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1');
    metadata[key] = value;
  });

  return {
    metadata,
    body: content.slice(frontMatterMatch[0].length).trim()
  };
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function stripHtml(value = '') {
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function buildSummary(metadata, body) {
  if (metadata.summary) return metadata.summary;
  if (metadata.description) return metadata.description;

  const bodyWithoutHeadings = body.replace(/^#+.*$/gm, '').trim();
  const lines = bodyWithoutHeadings.split(/\r?\n/).filter(line => line.trim().length > 0);
  const firstLine = stripHtml(lines[0] || '');

  if (!firstLine) return '';

  return firstLine.length > 150 ? `${firstLine.substring(0, 150)}...` : firstLine;
}

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeXml(value = '') {
  return escapeHtml(value);
}

function normalizeSitePath(value = '') {
  return value.replace(/^\.\//, '').replace(/^\/+/, '');
}

function toAbsoluteUrl(value = '') {
  if (!value) return '';
  if (/^https?:\/\//i.test(value)) return value;
  return `${siteUrl}/${normalizeSitePath(value)}`;
}

function toBlogPageAssetPath(value = '') {
  if (!value || /^https?:\/\//i.test(value)) return value;
  return `../${normalizeSitePath(value)}`;
}

function mediaEntryFor(value = '') {
  return mediaManifest[normalizeSitePath(value)] || null;
}

function addLanguageAttributes(html) {
  return String(html)
    .replace(/(<[A-Za-z][^>]*\sdata-lang=["']en["'])(?![^>]*\slang=)/g, '$1 lang="en"')
    .replace(/(<[A-Za-z][^>]*\sdata-lang=["']zhHant["'])(?![^>]*\slang=)/g, '$1 lang="zh-Hant"');
}

function formatDate(dateValue, locale) {
  if (!dateValue) return '';

  return new Date(`${dateValue}T00:00:00Z`).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC'
  });
}

function renderPostBody(body) {
  if (/<[a-z][\s\S]*>/i.test(body)) {
    return addLanguageAttributes(body.replace(/<(\/?)h1\b/gi, '<$1h2'));
  }

  return body
    .split(/\n{2,}/)
    .map(block => {
      const trimmed = block.trim();
      if (!trimmed) return '';

      if (/^###\s+/.test(trimmed)) {
        return `<h3>${escapeHtml(trimmed.replace(/^###\s+/, ''))}</h3>`;
      }

      if (/^##\s+/.test(trimmed)) {
        return `<h2>${escapeHtml(trimmed.replace(/^##\s+/, ''))}</h2>`;
      }

      if (/^#\s+/.test(trimmed)) {
        return `<h2>${escapeHtml(trimmed.replace(/^#\s+/, ''))}</h2>`;
      }

      return `<p>${escapeHtml(trimmed).replace(/\n/g, '<br>')}</p>`;
    })
    .filter(Boolean)
    .join('\n');
}

function generateJsonLd(post) {
  const canonicalUrl = `${siteUrl}/blog/${post.slug}.html`;
  const modifiedDate = post.updated || post.date;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${canonicalUrl}#blog-posting`,
    headline: post.title || post.filename,
    alternativeHeadline: post.titleZhHant || undefined,
    description: post.summary || undefined,
    image: post.image ? [toAbsoluteUrl(post.image)] : undefined,
    datePublished: post.date || undefined,
    dateModified: modifiedDate || undefined,
    inLanguage: ['en', 'zh-Hant'],
    url: canonicalUrl,
    author: {
      '@type': 'Person',
      name: siteProfile.name,
      url: siteUrl
    },
    publisher: {
      '@type': 'Person',
      name: siteProfile.name,
      url: siteUrl
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl
    }
  };

  Object.keys(jsonLd).forEach(key => jsonLd[key] === undefined && delete jsonLd[key]);

  return JSON.stringify(jsonLd, null, 6);
}

function generateBlogPage(post) {
  const title = post.title || post.filename;
  const titleZhHant = post.titleZhHant || title;
  const category = post.category || '';
  const categoryZhHant = post.categoryZhHant || category;
  const summary = post.summary || '';
  const canonicalUrl = `${siteUrl}/blog/${post.slug}.html`;
  const imageUrl = toAbsoluteUrl(post.image);
  const imagePath = toBlogPageAssetPath(post.image);
  const imageMedia = mediaEntryFor(post.image);
  const imageAlt = post.imageAlt || title;
  const modifiedDate = post.updated || post.date;
  const dateEn = formatDate(post.date, 'en-US');
  const dateZhHant = formatDate(post.date, 'zh-HK');
  const titleWithSite = `${post.seoTitle || title} | ${siteProfile.name}`;
  const postBody = renderPostBody(post.body);

  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(titleWithSite)}</title>
    <meta name="description" content="${escapeHtml(summary)}" />
    <meta name="author" content="${escapeHtml(siteProfile.name)}" />
    <meta name="robots" content="index, follow, max-image-preview:large" />
    <link rel="canonical" href="${escapeHtml(canonicalUrl)}" />
    <meta property="og:title" content="${escapeHtml(titleWithSite)}" />
    <meta property="og:description" content="${escapeHtml(summary)}" />
    ${imageUrl ? `<meta property="og:image" content="${escapeHtml(imageUrl)}" />
    <meta property="og:image:alt" content="${escapeHtml(imageAlt)}" />
    <meta property="og:image:width" content="${imageMedia.width}" />
    <meta property="og:image:height" content="${imageMedia.height}" />` : ''}
    <meta property="og:url" content="${escapeHtml(canonicalUrl)}" />
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="${escapeHtml(`${siteProfile.name} Portfolio`)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(titleWithSite)}" />
    <meta name="twitter:description" content="${escapeHtml(summary)}" />
    ${imageUrl ? `<meta name="twitter:image" content="${escapeHtml(imageUrl)}" />
    <meta name="twitter:image:alt" content="${escapeHtml(imageAlt)}" />` : ''}
    ${post.date ? `<meta property="article:published_time" content="${escapeHtml(post.date)}" />` : ''}
    ${modifiedDate ? `<meta property="article:modified_time" content="${escapeHtml(modifiedDate)}" />` : ''}
    <script type="application/ld+json">
      ${generateJsonLd(post)}
    </script>

    <script async src="https://www.googletagmanager.com/gtag/js?id=G-LEBDJN7H6D"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag() {
        dataLayer.push(arguments);
      }
      gtag("js", new Date());
      gtag("config", "G-LEBDJN7H6D");
    </script>

    <link rel="shortcut icon" href="../assets/images/icon.ico" type="image/x-icon" />
    <link rel="stylesheet" href="../assets/css/style.css?v=20260606" />
    <link rel="stylesheet" href="../assets/css/field-notes.css?v=20260721-2" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&family=Noto+Sans+TC:wght@400;500;700&family=Noto+Serif+TC:wght@400;500;700&display=swap"
      rel="stylesheet"
    />
  </head>
  <body class="portfolio-site">
    <a class="skip-link" href="#content-start" data-i18n="accessibility.skipToContent">${escapeHtml(translations.en['accessibility.skipToContent'])}</a>
    <main>
      <aside class="sidebar" data-sidebar>
        <div class="sidebar-info">
          <figure class="avatar-box">
            <img src="../assets/images/profile.jpg" alt="${escapeHtml(siteProfile.name)}" width="80" />
          </figure>
          <div class="info-content">
            <p class="name" title="${escapeHtml(siteProfile.name)}">${escapeHtml(siteProfile.name)}</p>
            <p class="title">${escapeHtml(siteProfile.role.en)}</p>
          </div>
          <button class="info_more-btn" data-sidebar-btn="" aria-expanded="false" aria-controls="sidebar-contact-details" aria-label="${escapeHtml(translations.en['sidebar.showContacts'])}" data-i18n-aria-label="sidebar.showContacts">
            <span>${escapeHtml(translations.en['sidebar.showContacts'])}</span>
            <ion-icon name="chevron-down"></ion-icon>
          </button>
        </div>
        <div class="sidebar-info_more" id="sidebar-contact-details">
          <div class="separator"></div>
          <ul class="contacts-list">
            <li class="contact-item" data-contact-id="${escapeHtml(profileContacts.email.id)}">
              <div class="icon-box">
                <ion-icon name="mail-outline"></ion-icon>
              </div>
              <div class="contact-info">
                <p class="contact-title">${escapeHtml(translations.en[profileContacts.email.labelKey])}</p>
                <a href="${escapeHtml(profileContacts.email.href)}" class="contact-link">${escapeHtml(profileContacts.email.value)}</a>
              </div>
            </li>
            <li class="contact-item" data-contact-id="${escapeHtml(profileContacts.location.id)}">
              <div class="icon-box">
                <ion-icon name="location-outline"></ion-icon>
              </div>
              <div class="contact-info">
                <p class="contact-title">${escapeHtml(translations.en[profileContacts.location.labelKey])}</p>
                <address>${escapeHtml(siteProfile.location.en)}</address>
              </div>
            </li>
            <li class="contact-item" data-contact-id="${escapeHtml(profileContacts.employer.id)}">
              <div class="icon-box">
                <ion-icon name="business-outline"></ion-icon>
              </div>
              <div class="contact-info">
                <p class="contact-title">${escapeHtml(translations.en[profileContacts.employer.labelKey])}</p>
                <a href="${escapeHtml(profileContacts.employer.href)}" class="contact-link">${escapeHtml(profileContacts.employer.value)}</a>
              </div>
            </li>
            <li class="contact-item" data-contact-id="${escapeHtml(profileContacts.organization.id)}">
              <div class="icon-box">
                <ion-icon name="link-outline"></ion-icon>
              </div>
              <div class="contact-info">
                <p class="contact-title">${escapeHtml(translations.en[profileContacts.organization.labelKey])}</p>
                <a href="${escapeHtml(profileContacts.organization.href)}" class="contact-link">${escapeHtml(profileContacts.organization.value)}</a>
              </div>
            </li>
            <li class="contact-item" data-contact-id="${escapeHtml(profileContacts.github.id)}">
              <div class="icon-box">
                <ion-icon name="logo-octocat"></ion-icon>
              </div>
              <div class="contact-info">
                <p class="contact-title">${escapeHtml(profileContacts.github.label)}</p>
                <a href="${escapeHtml(profileContacts.github.href)}" class="contact-link">${escapeHtml(profileContacts.github.value)}</a>
              </div>
            </li>
            <li class="contact-item" data-contact-id="${escapeHtml(profileContacts.linkedin.id)}">
              <div class="icon-box">
                <ion-icon name="logo-linkedin"></ion-icon>
              </div>
              <div class="contact-info">
                <p class="contact-title">${escapeHtml(profileContacts.linkedin.label)}</p>
                <a href="${escapeHtml(profileContacts.linkedin.href)}" class="contact-link">${escapeHtml(profileContacts.linkedin.value)}</a>
              </div>
            </li>
            <li class="contact-item" data-contact-id="${escapeHtml(profileContacts.orcid.id)}">
              <div class="icon-box">
                <ion-icon name="book-outline"></ion-icon>
              </div>
              <div class="contact-info">
                <p class="contact-title">${escapeHtml(profileContacts.orcid.label)}</p>
                <a href="${escapeHtml(profileContacts.orcid.href)}" class="contact-link">${escapeHtml(profileContacts.orcid.value)}</a>
              </div>
            </li>
          </ul>
        </div>
      </aside>

      <div class="main-content">
        <nav class="navbar" data-mobile-nav="" data-i18n-aria-label="nav.primary" aria-label="${escapeHtml(translations.en['nav.primary'])}">
          <button class="navbar-menu-btn" type="button" aria-expanded="false" aria-controls="primary-navigation" aria-label="${escapeHtml(translations.en['nav.menu'])}" data-i18n-aria-label="nav.menu" data-mobile-nav-btn="">
            <ion-icon name="menu-outline" aria-hidden="true"></ion-icon>
            <span data-i18n="nav.menu">${escapeHtml(translations.en['nav.menu'])}</span>
          </button>

          <div class="navbar-scroll" id="primary-navigation" data-mobile-nav-panel="">
            <ul class="navbar-list">
            <li class="navbar-item">
              <a href="/#about" class="navbar-link" data-nav-link data-i18n="nav.about">${escapeHtml(translations.en['nav.about'])}</a>
            </li>
            <li class="navbar-item">
              <a href="/#resume" class="navbar-link" data-nav-link data-i18n="nav.resume">${escapeHtml(translations.en['nav.resume'])}</a>
            </li>
            <li class="navbar-item">
              <a href="/#portfolio" class="navbar-link" data-nav-link data-i18n="nav.projects">${escapeHtml(translations.en['nav.projects'])}</a>
            </li>
            <li class="navbar-item">
              <a href="/#publications" class="navbar-link" data-nav-link data-i18n="nav.publications">${escapeHtml(translations.en['nav.publications'])}</a>
            </li>
            <li class="navbar-item">
              <a href="/#blog" class="navbar-link active" data-nav-link data-i18n="nav.blog">${escapeHtml(translations.en['nav.blog'])}</a>
            </li>
            <li class="navbar-item">
              <a href="/#contact" class="navbar-link" data-nav-link data-i18n="nav.contact">${escapeHtml(translations.en['nav.contact'])}</a>
            </li>
            </ul>
          </div>

          <ul class="navbar-actions" aria-label="${escapeHtml(translations.en['nav.preferences'])}" data-i18n-aria-label="nav.preferences">
            <li class="navbar-item navbar-action-item">
              <button class="navbar-link lang-btn" aria-label="${escapeHtml(translations.en['language.toggle'])}" data-i18n-aria-label="language.toggle" data-lang-btn>
                <span data-lang-label>ZH</span>
              </button>
            </li>
            <li class="navbar-item navbar-action-item">
              <button class="navbar-link theme-btn" aria-label="${escapeHtml(translations.en['theme.toggle'])}" data-theme-btn data-i18n-aria-label="theme.toggle" style="display:flex; justify-content:center; align-items:center;">
                <ion-icon name="sunny-outline" class="light-icon"></ion-icon>
              </button>
            </li>
          </ul>
        </nav>

        <span class="content-start" id="content-start" tabindex="-1"></span>

        <article class="blog-post-full active" data-page="blog-post">
          <header>
            <a href="/#blog" class="btn-back" data-i18n="blog.backToBlog">${escapeHtml(translations.en['blog.backToBlog'])}</a>
            <h1 class="h2 article-title">
              <span data-lang="en" lang="en">${escapeHtml(title)}</span>
              <span data-lang="zhHant" lang="zh-Hant">${escapeHtml(titleZhHant)}</span>
            </h1>
            <div class="blog-meta">
              <p class="blog-category">
                <span data-lang="en" lang="en">${escapeHtml(category)}</span>
                <span data-lang="zhHant" lang="zh-Hant">${escapeHtml(categoryZhHant)}</span>
              </p>
              <span class="dot"></span>
              <time datetime="${escapeHtml(post.date || '')}">
                <span data-lang="en" lang="en">${escapeHtml(dateEn)}</span>
                <span data-lang="zhHant" lang="zh-Hant">${escapeHtml(dateZhHant)}</span>
              </time>
            </div>
          </header>
          ${imagePath ? `<figure class="blog-banner-box">
            <img src="${escapeHtml(imagePath)}" alt="${escapeHtml(imageAlt)}" loading="eager" />
          </figure>` : ''}
          <div class="blog-content">
${postBody}
          </div>
        </article>

        <footer class="footer">
          <p class="copyright">&copy; ${siteProfile.copyrightYear} ${escapeHtml(siteProfile.name)}</p>
          <a href="#" class="back-to-top">${escapeHtml(translations.en['footer.backToTop'])}</a>
        </footer>
      </div>
    </main>

    <script src="../assets/js/site-data.js?v=20260721-1"></script>
    <script src="../assets/js/i18n.js?v=20260721-1"></script>
    <script src="../assets/js/theme.js?v=20260716-2"></script>
    <script src="../assets/js/motion.js"></script>
    <script src="../assets/js/ui-interactions.js?v=20260721-1"></script>
    <script src="../assets/js/filters.js"></script>
    <script src="../assets/js/contact-form.js"></script>
    <script src="../assets/js/navigation.js?v=20260721-1"></script>
    <script src="../assets/js/app-init.js"></script>
    <script type="module" src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js"></script>
    <script nomodule src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js"></script>
  </body>
</html>
`;

  return optimizeMediaMarkup(html, `blog/${post.slug}.html`);
}

function formatCardDate(dateValue, locale) {
  if (!dateValue) return '';
  return new Date(`${dateValue}T00:00:00Z`).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    timeZone: 'UTC'
  });
}

function renderHomepageBlogCard(post) {
  const title = post.title || post.filename;
  const titleZhHant = post.titleZhHant || title;
  const category = post.category || '';
  const categoryZhHant = post.categoryZhHant || category;
  const summary = post.summary || '';
  const summaryZhHant = post.summaryZhHant || summary;
  const dateEn = formatCardDate(post.date, 'en-US');
  const dateZhHant = formatCardDate(post.date, 'zh-HK');
  const media = post.imageMedia;
  const imageMarkup = post.image && media
    ? `<figure class="blog-banner-box">
                  <img src="${escapeHtml(media.src)}" srcset="${escapeHtml(media.srcset)}" sizes="${escapeHtml(media.sizes)}" width="${media.width}" height="${media.height}" data-media-source="${escapeHtml(media.source)}" alt="${escapeHtml(post.imageAlt || title)}" loading="lazy" decoding="async" />
                </figure>`
    : '';

  return `              <li class="blog-post-item tilt-card fade-seed">
                <a href="${escapeHtml(post.url)}" class="magnetic" data-magnetic>
                ${imageMarkup}
                  <div class="blog-content">
                    <div class="blog-meta">
                      <p class="blog-category">
                        <span data-lang="en" lang="en">${escapeHtml(category)}</span>
                        <span data-lang="zhHant" lang="zh-Hant">${escapeHtml(categoryZhHant)}</span>
                      </p>
                      <span class="dot"></span>
                      <time datetime="${escapeHtml(post.date || '')}">
                        <span data-lang="en" lang="en">${escapeHtml(dateEn)}</span>
                        <span data-lang="zhHant" lang="zh-Hant">${escapeHtml(dateZhHant)}</span>
                      </time>
                    </div>
                    <h3 class="h3 blog-item-title">
                      <span data-lang="en" lang="en">${escapeHtml(title)}</span>
                      <span data-lang="zhHant" lang="zh-Hant">${escapeHtml(titleZhHant)}</span>
                    </h3>
                    <p class="blog-text">
                      <span data-lang="en" lang="en">${escapeHtml(summary)}</span>
                      <span data-lang="zhHant" lang="zh-Hant">${escapeHtml(summaryZhHant)}</span>
                    </p>
                  </div>
                </a>
              </li>`;
}

function syncHomepageBlogCards(html, posts) {
  const pattern = /(<ul\b[^>]*\bid=["']dynamic-blog-list["'][^>]*>)[\s\S]*?(<\/ul>)/i;
  const matches = html.match(new RegExp(pattern.source, 'gi')) || [];
  if (matches.length !== 1) {
    throw new Error(`index.html: expected one dynamic-blog-list, found ${matches.length}.`);
  }
  const cards = posts.map(renderHomepageBlogCard).join('\n');
  const inner = `\n              <!-- Generated from posts/*.md by generate-blog-index.js. -->\n${cards}\n            `;
  return html.replace(pattern, `$1${inner}$2`);
}

function buildSitemap(posts) {
  const entries = staticSitemapPages.map(page => ({
    loc: `${siteUrl}/${page.path}`,
    lastmod: page.lastmod,
    changefreq: page.changefreq,
    priority: page.priority
  }));

  posts.forEach(post => {
    entries.push({
      loc: `${siteUrl}/blog/${post.slug}.html`,
      lastmod: post.updated || post.date || siteProfile.seo.lastmod,
      changefreq: 'monthly',
      priority: '0.7'
    });
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.map(entry => `  <url>
    <loc>${escapeXml(entry.loc)}</loc>
    <lastmod>${escapeXml(entry.lastmod)}</lastmod>
    <changefreq>${escapeXml(entry.changefreq)}</changefreq>
    <priority>${escapeXml(entry.priority)}</priority>
  </url>`).join('\n')}
</urlset>
`;
}

const files = fs.readdirSync(postsDir).filter(file => file.endsWith('.md'));

const posts = files.map(file => {
  const content = fs.readFileSync(path.join(postsDir, file), 'utf-8');
  const { metadata, body } = parseFrontMatter(content);
  const filename = file.replace(/\.md$/, '');
  const slug = slugify(filename);
  const summary = buildSummary(metadata, body);

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error(`Post filename "${file}" does not produce a safe, non-empty slug.`);
  }

  const post = {
    filename,
    slug,
    url: `./blog/${slug}.html`,
    ...metadata
  };
  Object.assign(post, {
    filename,
    slug,
    url: `./blog/${slug}.html`,
    summary,
    body
  });

  const requiredFields = ['title', 'titleZhHant', 'date', 'category', 'categoryZhHant', 'image', 'summary', 'summaryZhHant'];
  const missingFields = requiredFields.filter(field => !post[field]);
  if (missingFields.length) {
    throw new Error(`${file}: missing required front matter: ${missingFields.join(', ')}.`);
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(post.date)
    || (post.updated && !/^\d{4}-\d{2}-\d{2}$/.test(post.updated))) {
    throw new Error(`${file}: date and updated must use YYYY-MM-DD.`);
  }
  if (post.updated && post.updated < post.date) {
    throw new Error(`${file}: updated cannot be earlier than date.`);
  }
  if (!mediaEntryFor(post.image)) {
    throw new Error(`${file}: image is missing from assets/data/media-manifest.json.`);
  }
  if (`${post.seoTitle || post.title} | ${siteProfile.name}`.length > 70) {
    throw new Error(`${file}: generated SEO title exceeds 70 characters; add a shorter seoTitle.`);
  }
  if (post.summary.length > 160) {
    throw new Error(`${file}: summary exceeds 160 characters.`);
  }
  return post;
});

const duplicateSlugs = posts
  .map(post => post.slug)
  .filter((slug, index, slugs) => slugs.indexOf(slug) !== index);
if (duplicateSlugs.length) {
  throw new Error(`Duplicate blog slug(s): ${[...new Set(duplicateSlugs)].join(', ')}`);
}

posts.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

const postIndex = posts.map(({ body, ...post }) => ({
  ...post,
  imageMedia: post.image
    ? responsiveMedia(post.image, 'index.html', { sizes: CARD_SIZES })
    : null
}));
const resolvedBlogOutputDir = path.resolve(blogDir);
const generatedBlogPages = posts.map(post => {
  const outputPath = path.resolve(blogDir, `${post.slug}.html`);
  if (!outputPath.startsWith(`${resolvedBlogOutputDir}${path.sep}`)) {
    throw new Error(`Refusing to write blog output outside ${resolvedBlogOutputDir}.`);
  }
  return {
    outputPath,
    content: generateBlogPage(post)
  };
});
const generatedPostIndex = `${JSON.stringify(postIndex, null, 2)}\n`;
const generatedSitemap = buildSitemap(posts);
const generatedHomepage = optimizeMediaMarkup(
  syncHomepageBlogCards(fs.readFileSync(homepageFile, 'utf8'), postIndex),
  'index.html'
);
const generatedWrites = [
  ...generatedBlogPages.map(({ outputPath, content }) => ({ targetPath: outputPath, content })),
  { targetPath: outputFile, content: generatedPostIndex },
  { targetPath: sitemapFile, content: generatedSitemap },
  { targetPath: homepageFile, content: generatedHomepage }
];

if (checkMode) {
  const staleFiles = generatedWrites
    .filter(({ targetPath, content }) => !fs.existsSync(targetPath) || fs.readFileSync(targetPath, 'utf8') !== content)
    .map(({ targetPath }) => path.relative(__dirname, targetPath).replace(/\\/g, '/'));
  const desiredBlogFiles = new Set(generatedBlogPages.map(({ outputPath }) => path.resolve(outputPath)));
  const obsoleteBlogFiles = fs.existsSync(blogDir)
    ? fs.readdirSync(blogDir)
      .filter(file => file.endsWith('.html'))
      .map(file => path.resolve(blogDir, file))
      .filter(outputPath => !desiredBlogFiles.has(outputPath))
      .map(outputPath => path.relative(__dirname, outputPath).replace(/\\/g, '/'))
    : [];

  if (staleFiles.length || obsoleteBlogFiles.length) {
    console.error('Generated blog content is out of date:');
    [...staleFiles, ...obsoleteBlogFiles].forEach(file => console.error(`- ${file}`));
    process.exitCode = 1;
  } else {
    console.log(`Generated blog content is current (${posts.length} posts).`);
  }
} else {
  commitFileTransaction(generatedWrites);
  removeObsoleteBlogPages(generatedBlogPages.map(({ outputPath }) => outputPath));
  console.log(`Generated index and ${posts.length} blog pages at ${blogDir}`);
}
