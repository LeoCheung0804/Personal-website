'use strict';

const fs = require('fs');
const path = require('path');
const {
  siteProfile,
  siteProjects,
  standalonePages,
  validateSiteData
} = require('../assets/js/site-data.js');
const mediaManifest = require('../assets/data/media-manifest.json');

validateSiteData();

const rootDir = path.resolve(__dirname, '..');
const posts = JSON.parse(fs.readFileSync(path.join(rootDir, 'assets/data/posts.json'), 'utf8'));
const errors = [];
let assertionCount = 0;

function check(condition, message) {
  assertionCount += 1;
  if (!condition) errors.push(message);
}

function read(relativePath) {
  const absolutePath = path.join(rootDir, ...relativePath.split('/'));
  check(fs.existsSync(absolutePath), `${relativePath}: file does not exist.`);
  return fs.existsSync(absolutePath) ? fs.readFileSync(absolutePath, 'utf8') : '';
}

function decodeHtml(value = '') {
  return String(value)
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

function stripTags(value = '') {
  return decodeHtml(String(value).replace(/<[^>]*>/g, ' '));
}

function markupOnly(html) {
  return html
    .replace(/<!--([\s\S]*?)-->/g, '')
    .replace(/<script\b[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[\s\S]*?<\/style>/gi, '');
}

function tags(html, tagName) {
  return [...html.matchAll(new RegExp(`<${tagName}\\b[^>]*>`, 'gi'))].map(match => match[0]);
}

function attribute(openTag, name) {
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = openTag.match(new RegExp(`\\s${escapedName}\\s*=\\s*(["'])([\\s\\S]*?)\\1`, 'i'));
  return match ? decodeHtml(match[2]) : null;
}

function matchingTags(html, tagName, attributeName, attributeValue) {
  return tags(html, tagName).filter(tag => attribute(tag, attributeName)?.toLowerCase() === attributeValue.toLowerCase());
}

function oneMeta(html, file, attributeName, attributeValue) {
  const matches = matchingTags(html, 'meta', attributeName, attributeValue);
  check(matches.length === 1, `${file}: expected one meta[${attributeName}="${attributeValue}"], found ${matches.length}.`);
  return matches.length === 1 ? attribute(matches[0], 'content') || '' : '';
}

function oneCanonical(html, file) {
  const matches = matchingTags(html, 'link', 'rel', 'canonical');
  check(matches.length === 1, `${file}: expected one canonical link, found ${matches.length}.`);
  return matches.length === 1 ? attribute(matches[0], 'href') || '' : '';
}

function jsonLdBlocks(html, file) {
  return [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
    .map((match, index) => {
      try {
        return JSON.parse(match[1]);
      } catch (error) {
        check(false, `${file}: JSON-LD block ${index + 1} is invalid (${error.message}).`);
        return null;
      }
    })
    .filter(Boolean);
}

function canonicalFor(relativePath) {
  return relativePath === 'index.html'
    ? `${siteProfile.siteUrl}/`
    : `${siteProfile.siteUrl}/${relativePath}`;
}

const publicPages = [
  {
    file: 'index.html',
    lastmod: siteProfile.seo.lastmod,
    schemaType: 'ProfilePage',
    ogType: 'website'
  },
  ...Object.values(siteProjects).map(project => ({
    file: project.file,
    lastmod: project.seo.lastmod,
    schemaType: 'CreativeWork',
    ogType: 'article'
  })),
  ...Object.values(standalonePages).map(page => ({
    file: page.file,
    lastmod: page.seo.lastmod,
    schemaType: 'WebApplication',
    ogType: 'website'
  })),
  ...posts.map(post => ({
    file: post.url.replace(/^\.\//, ''),
    lastmod: post.updated || post.date,
    published: post.date,
    schemaType: 'BlogPosting',
    ogType: 'article'
  }))
].map(page => ({ ...page, canonical: canonicalFor(page.file) }));

const pageHtml = new Map();
const titleOwners = new Map();
const descriptionOwners = new Map();

for (const page of publicPages) {
  const html = read(page.file);
  const markup = markupOnly(html);
  pageHtml.set(page.file, html);

  const documentTitles = [...html.matchAll(/<title\b[^>]*>([\s\S]*?)<\/title>/gi)].map(match => stripTags(match[1]));
  check(documentTitles.length === 1 && documentTitles[0], `${page.file}: requires one non-empty title.`);
  const title = documentTitles[0] || '';
  check(title.length <= 70, `${page.file}: title is ${title.length} characters; maximum is 70.`);

  const description = oneMeta(html, page.file, 'name', 'description');
  check(description.length >= 50 && description.length <= 160,
    `${page.file}: description is ${description.length} characters; expected 50-160.`);
  check(oneMeta(html, page.file, 'name', 'author') === siteProfile.name,
    `${page.file}: author metadata must match siteProfile.name.`);
  const robots = oneMeta(html, page.file, 'name', 'robots');
  check(/\bindex\b/i.test(robots) && /\bfollow\b/i.test(robots), `${page.file}: robots metadata must allow index and follow.`);
  check(oneCanonical(html, page.file) === page.canonical, `${page.file}: canonical URL does not match ${page.canonical}.`);

  const socialFields = [
    ['property', 'og:title'], ['property', 'og:description'], ['property', 'og:image'],
    ['property', 'og:image:alt'], ['property', 'og:image:width'], ['property', 'og:image:height'],
    ['property', 'og:url'], ['property', 'og:type'], ['property', 'og:site_name'],
    ['name', 'twitter:card'], ['name', 'twitter:title'], ['name', 'twitter:description'],
    ['name', 'twitter:image'], ['name', 'twitter:image:alt']
  ];
  const social = Object.fromEntries(socialFields.map(([attr, value]) => [value, oneMeta(html, page.file, attr, value)]));
  check(social['og:url'] === page.canonical, `${page.file}: og:url must match its canonical.`);
  check(social['og:type'] === page.ogType, `${page.file}: og:type must be ${page.ogType}.`);
  check(social['og:title'] === social['twitter:title'], `${page.file}: Open Graph and Twitter titles differ.`);
  check(social['og:image'] === social['twitter:image'], `${page.file}: Open Graph and Twitter images differ.`);

  try {
    const socialImage = new URL(social['og:image']);
    const manifestPath = decodeURIComponent(socialImage.pathname).replace(/^\/+/, '');
    const media = mediaManifest[manifestPath];
    check(socialImage.origin === siteProfile.siteUrl, `${page.file}: social image must use the canonical site origin.`);
    check(Boolean(media), `${page.file}: social image is missing from the media manifest (${manifestPath}).`);
    if (media) {
      check(Number(social['og:image:width']) === media.width, `${page.file}: og:image:width does not match the source image.`);
      check(Number(social['og:image:height']) === media.height, `${page.file}: og:image:height does not match the source image.`);
    }
  } catch {
    check(false, `${page.file}: og:image is not a valid absolute URL.`);
  }

  const schemas = jsonLdBlocks(html, page.file);
  const schema = schemas.find(item => item['@type'] === page.schemaType);
  check(Boolean(schema), `${page.file}: missing ${page.schemaType} JSON-LD.`);
  if (schema) {
    const schemaPageUrl = schema.mainEntityOfPage?.['@id'] || schema.url;
    check(schemaPageUrl === page.canonical, `${page.file}: structured-data URL does not match its canonical.`);
    check(schema.dateModified === page.lastmod, `${page.file}: structured-data dateModified must be ${page.lastmod}.`);
    check(Array.isArray(schema.inLanguage)
      && schema.inLanguage.includes('en')
      && schema.inLanguage.includes('zh-Hant'), `${page.file}: structured data must declare both site languages.`);
  }

  if (page.ogType === 'article') {
    check(oneMeta(html, page.file, 'property', 'article:modified_time') === page.lastmod,
      `${page.file}: article:modified_time must match its authoritative lastmod.`);
  }
  if (page.schemaType === 'BlogPosting') {
    check(oneMeta(html, page.file, 'property', 'article:published_time') === page.published,
      `${page.file}: article:published_time must match its post date.`);
  }

  const htmlTag = tags(html, 'html')[0] || '';
  check(attribute(htmlTag, 'lang') === 'en', `${page.file}: default html language must be en.`);
  const headings = [...markup.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)];
  check(headings.length === 1 && stripTags(headings[0]?.[1]), `${page.file}: requires exactly one non-empty h1.`);

  for (const image of tags(markup, 'img')) {
    check(attribute(image, 'alt') !== null, `${page.file}: every image requires an alt attribute.`);
  }

  const ids = [...markup.matchAll(/\bid=["']([^"']+)["']/gi)].map(match => match[1]);
  const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
  check(duplicateIds.length === 0, `${page.file}: duplicate id(s): ${[...new Set(duplicateIds)].join(', ')}.`);

  if (titleOwners.has(title)) check(false, `${page.file}: duplicates the title used by ${titleOwners.get(title)}.`);
  else titleOwners.set(title, page.file);
  if (descriptionOwners.has(description)) check(false, `${page.file}: duplicates the description used by ${descriptionOwners.get(description)}.`);
  else descriptionOwners.set(description, page.file);
}

for (const file of ['404.html', 'blog-post.html']) {
  const html = read(file);
  const robots = oneMeta(html, file, 'name', 'robots');
  check(/\bnoindex\b/i.test(robots), `${file}: utility page must remain noindex.`);
  pageHtml.set(file, html);
}

function caseSensitiveFileExists(relativePath) {
  const cleanPath = relativePath.replace(/\\/g, '/').replace(/^\/+/, '');
  const segments = cleanPath.split('/').filter(Boolean);
  let current = rootDir;
  for (const segment of segments) {
    if (!fs.existsSync(current) || !fs.statSync(current).isDirectory()) return false;
    const entries = fs.readdirSync(current);
    if (!entries.includes(segment)) return false;
    current = path.join(current, segment);
  }
  return fs.existsSync(current);
}

function resolveReference(file, value, rootRelative = false) {
  const decoded = decodeURIComponent(value).replace(/\\/g, '/');
  const hashIndex = decoded.indexOf('#');
  const fragment = hashIndex >= 0 ? decoded.slice(hashIndex + 1) : '';
  const withoutFragment = hashIndex >= 0 ? decoded.slice(0, hashIndex) : decoded;
  const cleanPath = withoutFragment.split('?')[0];
  if (!cleanPath) return { target: file, fragment };
  const target = rootRelative || cleanPath.startsWith('/')
    ? cleanPath.replace(/^\/+/, '')
    : path.posix.normalize(path.posix.join(path.posix.dirname(file), cleanPath));
  return { target: target.endsWith('/') ? `${target}index.html` : target, fragment };
}

function isExternalReference(value) {
  return /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(value);
}

function checkReference(file, value, label, rootRelative = false) {
  if (!value || value === '#' || isExternalReference(value)) return;
  let resolved;
  try {
    resolved = resolveReference(file, value, rootRelative);
  } catch {
    check(false, `${file}: ${label} contains an invalid encoded path (${value}).`);
    return;
  }
  check(!resolved.target.startsWith('../'), `${file}: ${label} escapes the site root (${value}).`);
  if (resolved.target.startsWith('../')) return;
  check(caseSensitiveFileExists(resolved.target), `${file}: broken or case-mismatched ${label} (${value} -> ${resolved.target}).`);

  if (resolved.fragment && /\.html?$/i.test(resolved.target) && caseSensitiveFileExists(resolved.target)) {
    const targetHtml = pageHtml.get(resolved.target) || read(resolved.target);
    const escapedFragment = resolved.fragment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    check(new RegExp(`\\bid=["']${escapedFragment}["']`, 'i').test(markupOnly(targetHtml)),
      `${file}: fragment #${resolved.fragment} does not exist in ${resolved.target}.`);
  }
}

for (const [file, html] of pageHtml) {
  const markup = markupOnly(html);
  for (const openTag of [...markup.matchAll(/<[A-Za-z][\w:-]*\b[^>]*>/g)].map(match => match[0])) {
    for (const name of ['href', 'src', 'poster', 'data-src']) {
      const value = attribute(openTag, name);
      if (value !== null) checkReference(file, value, name);
    }
    const mediaSource = attribute(openTag, 'data-media-source');
    if (mediaSource !== null) checkReference(file, mediaSource, 'data-media-source', true);
    for (const name of ['srcset', 'data-srcset']) {
      const value = attribute(openTag, name);
      if (!value) continue;
      value.split(',').map(candidate => candidate.trim().split(/\s+/)[0]).filter(Boolean)
        .forEach(candidate => checkReference(file, candidate, name));
    }
    if (attribute(openTag, 'target') === '_blank') {
      const rel = attribute(openTag, 'rel') || '';
      check(/\bnoopener\b/i.test(rel) && /\bnoreferrer\b/i.test(rel),
        `${file}: target="_blank" link requires rel="noopener noreferrer".`);
    }
  }
}

for (const cssFile of fs.readdirSync(path.join(rootDir, 'assets/css')).filter(file => file.endsWith('.css'))) {
  const relativePath = `assets/css/${cssFile}`;
  const css = read(relativePath).replace(/\/\*[\s\S]*?\*\//g, '');
  for (const match of css.matchAll(/url\(\s*(["']?)(.*?)\1\s*\)/gi)) {
    checkReference(relativePath, match[2], 'CSS url');
  }
}

const sitemap = read('sitemap.xml');
const sitemapEntries = [...sitemap.matchAll(/<url>\s*<loc>(.*?)<\/loc>\s*<lastmod>(.*?)<\/lastmod>[\s\S]*?<\/url>/gi)]
  .map(match => ({ loc: decodeHtml(match[1]), lastmod: decodeHtml(match[2]) }));
const sitemapByUrl = new Map(sitemapEntries.map(entry => [entry.loc, entry]));
check(sitemapByUrl.size === sitemapEntries.length, 'sitemap.xml: duplicate URL entries detected.');
check(sitemapEntries.length === publicPages.length,
  `sitemap.xml: expected ${publicPages.length} indexable URLs, found ${sitemapEntries.length}.`);
for (const page of publicPages) {
  const entry = sitemapByUrl.get(page.canonical);
  check(Boolean(entry), `sitemap.xml: missing ${page.canonical}.`);
  if (entry) check(entry.lastmod === page.lastmod, `sitemap.xml: ${page.canonical} lastmod must be ${page.lastmod}.`);
}

const robots = read('robots.txt');
check(new RegExp(`^Sitemap:\\s*${siteProfile.siteUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\/sitemap\\.xml\\s*$`, 'mi').test(robots),
  'robots.txt: sitemap directive does not match the canonical site URL.');
check(read('CNAME').trim() === new URL(siteProfile.siteUrl).hostname, 'CNAME must match siteProfile.siteUrl.');

const indexMarkup = markupOnly(pageHtml.get('index.html'));
const blogListMatch = indexMarkup.match(/<ul\b[^>]*id=["']dynamic-blog-list["'][^>]*>([\s\S]*?)<\/ul>/i);
check(Boolean(blogListMatch), 'index.html: missing generated blog list.');
if (blogListMatch) {
  const blogLinks = tags(blogListMatch[1], 'a').map(tag => attribute(tag, 'href')).filter(Boolean);
  const expectedLinks = posts.map(post => post.url);
  check(blogLinks.length === expectedLinks.length, `index.html: expected ${expectedLinks.length} static blog links, found ${blogLinks.length}.`);
  for (const link of expectedLinks) check(blogLinks.includes(link), `index.html: missing static blog link ${link}.`);
}

if (errors.length) {
  console.error(`Static site audit failed with ${errors.length} issue(s):`);
  errors.forEach(error => console.error(`- ${error}`));
  process.exitCode = 1;
} else {
  console.log(`Static site audit passed: ${publicPages.length} indexable pages, ${posts.length} static blog cards, ${assertionCount} checks.`);
}
