const fs = require('fs');
const path = require('path');

const siteUrl = 'https://leocml.com';
const postsDir = path.join(__dirname, 'posts');
const blogDir = path.join(__dirname, 'blog');
const outputFile = path.join(__dirname, 'assets', 'data', 'posts.json');
const sitemapFile = path.join(__dirname, 'sitemap.xml');

const staticSitemapPages = [
  { path: '', lastmod: '2026-05-05', changefreq: 'weekly', priority: '1.0' },
  { path: 'tapper.html', lastmod: '2026-05-05', changefreq: 'monthly', priority: '0.8' },
  { path: 'yes.html', lastmod: '2026-05-05', changefreq: 'monthly', priority: '0.8' },
  { path: 'spray.html', lastmod: '2026-05-05', changefreq: 'monthly', priority: '0.8' },
  { path: 'knowtouch.html', lastmod: '2026-05-05', changefreq: 'monthly', priority: '0.8' },
  { path: 'exoskeleton.html', lastmod: '2026-05-05', changefreq: 'monthly', priority: '0.8' },
  { path: 'borderless.html', lastmod: '2026-05-05', changefreq: 'monthly', priority: '0.8' },
  { path: 'microwave.html', lastmod: '2026-05-05', changefreq: 'monthly', priority: '0.8' },
  { path: 'retractable.html', lastmod: '2026-05-05', changefreq: 'monthly', priority: '0.8' },
  { path: 'footcontroller.html', lastmod: '2026-05-05', changefreq: 'monthly', priority: '0.8' }
];

function ensureDirectory(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function prepareBlogDirectory() {
  const resolvedBlogDir = path.resolve(blogDir);
  const resolvedWorkspace = path.resolve(__dirname);

  if (!resolvedBlogDir.startsWith(`${resolvedWorkspace}${path.sep}`)) {
    throw new Error(`Refusing to clean blog output outside workspace: ${resolvedBlogDir}`);
  }

  ensureDirectory(blogDir);

  fs.readdirSync(blogDir)
    .filter(file => file.endsWith('.html'))
    .forEach(file => fs.unlinkSync(path.join(blogDir, file)));
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
  if (/<[a-z][\s\S]*>/i.test(body)) return body;

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
        return `<h1>${escapeHtml(trimmed.replace(/^#\s+/, ''))}</h1>`;
      }

      return `<p>${escapeHtml(trimmed).replace(/\n/g, '<br>')}</p>`;
    })
    .filter(Boolean)
    .join('\n');
}

function generateJsonLd(post) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title || post.filename,
    alternativeHeadline: post.titleZhHant || undefined,
    description: post.summary || undefined,
    image: post.image ? [toAbsoluteUrl(post.image)] : undefined,
    datePublished: post.date || undefined,
    dateModified: post.date || undefined,
    author: {
      '@type': 'Person',
      name: 'Leo Cheung',
      url: siteUrl
    },
    publisher: {
      '@type': 'Person',
      name: 'Leo Cheung',
      url: siteUrl
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/blog/${post.slug}.html`
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
  const dateEn = formatDate(post.date, 'en-US');
  const dateZhHant = formatDate(post.date, 'zh-HK');
  const titleWithSite = `${title} | Leo Cheung`;
  const postBody = renderPostBody(post.body);

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(titleWithSite)}</title>
    <meta name="description" content="${escapeHtml(summary)}" />
    <meta name="author" content="Leo Cheung" />
    <link rel="canonical" href="${escapeHtml(canonicalUrl)}" />
    <meta property="og:title" content="${escapeHtml(titleWithSite)}" />
    <meta property="og:description" content="${escapeHtml(summary)}" />
    ${imageUrl ? `<meta property="og:image" content="${escapeHtml(imageUrl)}" />` : ''}
    <meta property="og:url" content="${escapeHtml(canonicalUrl)}" />
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="Leo Cheung Portfolio" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(titleWithSite)}" />
    <meta name="twitter:description" content="${escapeHtml(summary)}" />
    ${imageUrl ? `<meta name="twitter:image" content="${escapeHtml(imageUrl)}" />` : ''}
    ${post.date ? `<meta property="article:published_time" content="${escapeHtml(post.date)}" />` : ''}
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
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&family=Noto+Sans+TC:wght@400;500;700&family=Noto+Serif+TC:wght@400;500;700&display=swap"
      rel="stylesheet"
    />
  </head>
  <body>
    <main>
      <aside class="sidebar" data-sidebar>
        <div class="sidebar-info">
          <figure class="avatar-box">
            <img src="../assets/images/profile.jpg" alt="Leo Cheung" width="80" />
          </figure>
          <div class="info-content">
            <h1 class="name" title="Leo Cheung">Leo Cheung</h1>
            <p class="title">Robotic Engineer</p>
          </div>
          <button class="info_more-btn" data-sidebar-btn>
            <span>Show Contacts</span>
            <ion-icon name="chevron-down"></ion-icon>
          </button>
        </div>
        <div class="sidebar-info_more">
          <div class="separator"></div>
          <ul class="contacts-list">
            <li class="contact-item">
              <div class="icon-box">
                <ion-icon name="mail-outline"></ion-icon>
              </div>
              <div class="contact-info">
                <p class="contact-title">Email</p>
                <a href="mailto:leocheung0804@gmail.com" class="contact-link">leocheung0804@gmail.com</a>
              </div>
            </li>
            <li class="contact-item">
              <div class="icon-box">
                <ion-icon name="location-outline"></ion-icon>
              </div>
              <div class="contact-info">
                <p class="contact-title">Location</p>
                <address>Hong Kong</address>
              </div>
            </li>
            <li class="contact-item">
              <div class="icon-box">
                <ion-icon name="business-outline"></ion-icon>
              </div>
              <div class="contact-info">
                <p class="contact-title">Employer</p>
                <a href="https://www.c3robotics.com.hk" class="contact-link">C3 Construction Robotics Limited</a>
              </div>
            </li>
            <li class="contact-item">
              <div class="icon-box">
                <ion-icon name="link-outline"></ion-icon>
              </div>
              <div class="contact-info">
                <p class="contact-title">Organization</p>
                <a href="https://c3robolab.mae.cuhk.edu.hk/" class="contact-link">C3 Robotics Lab</a>
              </div>
            </li>
            <li class="contact-item">
              <div class="icon-box">
                <ion-icon name="logo-octocat"></ion-icon>
              </div>
              <div class="contact-info">
                <p class="contact-title">GitHub</p>
                <a href="https://github.com/LeoCheung0804" class="contact-link">LeoCheung0804</a>
              </div>
            </li>
            <li class="contact-item">
              <div class="icon-box">
                <ion-icon name="logo-linkedin"></ion-icon>
              </div>
              <div class="contact-info">
                <p class="contact-title">LinkedIn</p>
                <a href="https://www.linkedin.com/in/leocheung0804" class="contact-link">leocheung0804</a>
              </div>
            </li>
            <li class="contact-item">
              <div class="icon-box">
                <ion-icon name="book-outline"></ion-icon>
              </div>
              <div class="contact-info">
                <p class="contact-title">ORCID</p>
                <a href="https://orcid.org/0009-0003-1691-6603" class="contact-link">0009-0003-1691-6603</a>
              </div>
            </li>
          </ul>
          <div class="separator"></div>
          <ul class="social-list">
            <li class="social-item">
              <a href="#" class="social-link" aria-label="Facebook">
                <ion-icon name="logo-facebook"></ion-icon>
              </a>
            </li>
            <li class="social-item">
              <a href="#" class="social-link" aria-label="Twitter">
                <ion-icon name="logo-twitter"></ion-icon>
              </a>
            </li>
            <li class="social-item">
              <a href="#" class="social-link" aria-label="Instagram">
                <ion-icon name="logo-instagram"></ion-icon>
              </a>
            </li>
          </ul>
        </div>
      </aside>

      <div class="main-content">
        <nav class="navbar">
          <ul class="navbar-list">
            <li class="navbar-item">
              <a href="../index.html#about" class="navbar-link" data-nav-link data-i18n="nav.about">About</a>
            </li>
            <li class="navbar-item">
              <a href="../index.html#resume" class="navbar-link" data-nav-link data-i18n="nav.resume">Resume</a>
            </li>
            <li class="navbar-item">
              <a href="../index.html#portfolio" class="navbar-link" data-nav-link data-i18n="nav.projects">Projects</a>
            </li>
            <li class="navbar-item">
              <a href="../index.html#publications" class="navbar-link" data-nav-link data-i18n="nav.publications">Publications</a>
            </li>
            <li class="navbar-item">
              <a href="../index.html#blog" class="navbar-link active" data-nav-link data-i18n="nav.blog">Blog</a>
            </li>
            <li class="navbar-item">
              <a href="../index.html#contact" class="navbar-link" data-nav-link data-i18n="nav.contact">Contact</a>
            </li>
            <li class="navbar-item navbar-action-item">
              <button class="navbar-link lang-btn" aria-label="Switch language" data-i18n-aria-label="language.toggle" data-lang-btn>
                <span data-lang-label>ZH</span>
              </button>
            </li>
            <li class="navbar-item navbar-action-item">
              <button class="navbar-link theme-btn" aria-label="Toggle theme" data-theme-btn data-i18n-aria-label="theme.toggle" style="display:flex; justify-content:center; align-items:center;">
                <ion-icon name="sunny-outline" class="light-icon"></ion-icon>
              </button>
            </li>
          </ul>
        </nav>

        <article class="blog-post-full active" data-page="blog-post">
          <header>
            <a href="../index.html#blog" class="btn-back" data-i18n="blog.backToBlog">Back to Blog</a>
            <h2 class="h2 article-title">
              <span data-lang="en">${escapeHtml(title)}</span>
              <span data-lang="zhHant">${escapeHtml(titleZhHant)}</span>
            </h2>
            <div class="blog-meta">
              <p class="blog-category">
                <span data-lang="en">${escapeHtml(category)}</span>
                <span data-lang="zhHant">${escapeHtml(categoryZhHant)}</span>
              </p>
              <span class="dot"></span>
              <time datetime="${escapeHtml(post.date || '')}">
                <span data-lang="en">${escapeHtml(dateEn)}</span>
                <span data-lang="zhHant">${escapeHtml(dateZhHant)}</span>
              </time>
            </div>
          </header>
          ${imagePath ? `<figure class="blog-banner-box">
            <img src="${escapeHtml(imagePath)}" alt="${escapeHtml(title)}" loading="eager" />
          </figure>` : ''}
          <div class="blog-content">
${postBody}
          </div>
        </article>

        <footer class="footer">
          <p class="copyright">&copy; 2025 Leo Cheung</p>
          <a href="#" class="back-to-top">Back to Top</a>
        </footer>
      </div>
    </main>

    <script src="../assets/js/site-data.js"></script>
    <script src="../assets/js/i18n.js"></script>
    <script src="../assets/js/theme.js"></script>
    <script src="../assets/js/motion.js"></script>
    <script src="../assets/js/ui-interactions.js"></script>
    <script src="../assets/js/filters.js"></script>
    <script src="../assets/js/contact-form.js"></script>
    <script src="../assets/js/navigation.js"></script>
    <script src="../assets/js/app-init.js"></script>
    <script type="module" src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js"></script>
    <script nomodule src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js"></script>
  </body>
</html>
`;
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
      lastmod: post.date || '2026-05-05',
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

ensureDirectory(path.dirname(outputFile));
prepareBlogDirectory();

const files = fs.readdirSync(postsDir).filter(file => file.endsWith('.md'));

const posts = files.map(file => {
  const content = fs.readFileSync(path.join(postsDir, file), 'utf-8');
  const { metadata, body } = parseFrontMatter(content);
  const filename = file.replace(/\.md$/, '');
  const slug = slugify(filename);
  const summary = buildSummary(metadata, body);

  return {
    filename,
    slug,
    url: `./blog/${slug}.html`,
    ...metadata,
    summary,
    body
  };
});

posts.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

posts.forEach(post => {
  fs.writeFileSync(path.join(blogDir, `${post.slug}.html`), generateBlogPage(post));
});

const postIndex = posts.map(({ body, ...post }) => post);

fs.writeFileSync(outputFile, `${JSON.stringify(postIndex, null, 2)}\n`);
fs.writeFileSync(sitemapFile, buildSitemap(posts));

console.log(`Generated index and ${posts.length} blog pages at ${blogDir}`);
