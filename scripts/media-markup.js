'use strict';

const path = require('path');
const mediaManifest = require('../assets/data/media-manifest.json');

const THUMB_SIZES = '(min-width: 1180px) 112px, 96px';
const AVATAR_SIZES = '(min-width: 1250px) 260px, 72px';
const CARD_SIZES = '(min-width: 1250px) 220px, (min-width: 760px) 42vw, 88vw';
const CONTENT_SIZES = '(min-width: 1250px) 760px, 92vw';

function escapeAttribute(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function getAttribute(openTag, attributeName) {
  const escapedName = attributeName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = openTag.match(new RegExp(`\\s${escapedName}\\s*=\\s*(["'])([\\s\\S]*?)\\1`, 'i'));
  return match ? match[2] : null;
}

function setAttribute(openTag, attributeName, value) {
  const escapedName = attributeName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`(\\s${escapedName}\\s*=\\s*)(["'])([\\s\\S]*?)\\2`, 'i');
  const rendered = escapeAttribute(value);
  if (pattern.test(openTag)) {
    return openTag.replace(pattern, (match, prefix) => `${prefix}"${rendered}"`);
  }
  return openTag.replace(/(\s*\/?>)$/, ` ${attributeName}="${rendered}"$1`);
}

function removeAttribute(openTag, attributeName) {
  const escapedName = attributeName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return openTag.replace(
    new RegExp(`\\s${escapedName}\\s*=\\s*(["'])[\\s\\S]*?\\1`, 'i'),
    ''
  );
}

function normalizeRootPath(source, pagePath) {
  if (!source || /^(?:data:|https?:|\/\/)/i.test(source)) return null;
  const cleanSource = source.split(/[?#]/, 1)[0].replace(/\\/g, '/');
  const pageDirectory = path.posix.dirname(`/${pagePath.replace(/\\/g, '/')}`);
  return path.posix.normalize(path.posix.join(pageDirectory, cleanSource)).replace(/^\/+/, '');
}

function relativeToPage(rootPath, pagePath) {
  const pageDirectory = path.posix.dirname(pagePath.replace(/\\/g, '/'));
  const relative = path.posix.relative(pageDirectory === '.' ? '' : pageDirectory, rootPath);
  return relative.startsWith('.') ? relative : `./${relative}`;
}

function nearestVariant(variants, preferredWidth) {
  return variants.find((variant) => variant.width >= preferredWidth) || variants.at(-1);
}

function responsiveMedia(source, pagePath, { thumbnail = false, sizes = CONTENT_SIZES } = {}) {
  const rootSource = normalizeRootPath(source, pagePath);
  const entry = rootSource && mediaManifest[rootSource];
  if (!entry) return null;

  const variants = [...entry.variants].sort((left, right) => left.width - right.width);
  const fallback = nearestVariant(variants, thumbnail ? 240 : 960);

  if (thumbnail) {
    return {
      source: rootSource,
      src: relativeToPage(fallback.path, pagePath),
      width: entry.width,
      height: entry.height,
      sizes: THUMB_SIZES
    };
  }

  return {
    source: rootSource,
    src: relativeToPage(fallback.path, pagePath),
    srcset: variants
      .map((variant) => `${relativeToPage(variant.path, pagePath)} ${variant.width}w`)
      .join(', '),
    width: entry.width,
    height: entry.height,
    sizes
  };
}

function isInsideThumbnail(html, index) {
  const before = html.slice(Math.max(0, index - 900), index);
  return before.lastIndexOf('photo-sequence__thumb') > before.lastIndexOf('</label>');
}

function isInsideCard(html, index) {
  const before = html.slice(Math.max(0, index - 1000), index);
  const cardStart = Math.max(
    before.lastIndexOf('project-preview-img-box'),
    before.lastIndexOf('class="project-img"'),
    before.lastIndexOf("class='project-img'")
  );
  return cardStart > before.lastIndexOf('</figure>');
}

function optimizeImageTags(html, pagePath) {
  const matches = [...html.matchAll(/<img\b[^>]*>/gi)];
  let output = html;

  for (let index = matches.length - 1; index >= 0; index -= 1) {
    const match = matches[index];
    const openTag = match[0];
    const source = getAttribute(openTag, 'data-media-source') || getAttribute(openTag, 'src');
    const thumbnail = isInsideThumbnail(html, match.index);
    const profile = /(?:^|\/)profile\.jpg$/i.test(source || '');
    const card = isInsideCard(html, match.index);
    const dataPhoto = getAttribute(openTag, 'data-photo');
    const media = responsiveMedia(source, pagePath, {
      thumbnail,
      sizes: profile ? AVATAR_SIZES : card ? CARD_SIZES : CONTENT_SIZES
    });

    if (!media) continue;

    let updatedTag = openTag;
    updatedTag = setAttribute(updatedTag, 'data-media-source', media.source);
    updatedTag = setAttribute(updatedTag, 'width', media.width);
    updatedTag = setAttribute(updatedTag, 'height', media.height);
    updatedTag = setAttribute(updatedTag, 'decoding', 'async');

    const deferGalleryImage = Boolean(dataPhoto && dataPhoto !== '1' && !thumbnail);
    if (deferGalleryImage) {
      updatedTag = setAttribute(updatedTag, 'data-src', media.src);
      updatedTag = setAttribute(updatedTag, 'data-srcset', media.srcset || '');
      updatedTag = setAttribute(updatedTag, 'data-sizes', media.sizes);
      updatedTag = removeAttribute(updatedTag, 'src');
      updatedTag = removeAttribute(updatedTag, 'srcset');
      updatedTag = removeAttribute(updatedTag, 'sizes');
      updatedTag = setAttribute(updatedTag, 'loading', 'lazy');
    } else {
      updatedTag = setAttribute(updatedTag, 'src', media.src);
      if (media.srcset) updatedTag = setAttribute(updatedTag, 'srcset', media.srcset);
      updatedTag = setAttribute(updatedTag, 'sizes', media.sizes);
      updatedTag = removeAttribute(updatedTag, 'data-src');
      updatedTag = removeAttribute(updatedTag, 'data-srcset');
      updatedTag = removeAttribute(updatedTag, 'data-sizes');

      if (thumbnail) {
        updatedTag = setAttribute(updatedTag, 'loading', 'lazy');
      } else if (dataPhoto === '1' || profile) {
        updatedTag = setAttribute(updatedTag, 'loading', 'eager');
      } else if (!getAttribute(updatedTag, 'loading')) {
        updatedTag = setAttribute(updatedTag, 'loading', 'lazy');
      }
    }

    updatedTag = updatedTag.replace(/^[ \t]+$/gm, '');
    output = output.slice(0, match.index) + updatedTag + output.slice(match.index + openTag.length);
  }

  return output;
}

function optimizeIframes(html) {
  return html.replace(/<iframe\b[^>]*>/gi, (openTag) => {
    let updatedTag = setAttribute(openTag, 'loading', 'lazy');
    const dataPhoto = getAttribute(updatedTag, 'data-photo');
    const source = getAttribute(updatedTag, 'src');

    if (dataPhoto && source && /youtube(?:-nocookie)?\.com\/embed\//i.test(source)) {
      updatedTag = setAttribute(updatedTag, 'data-src', source);
      updatedTag = removeAttribute(updatedTag, 'src');
    }

    return updatedTag.replace(/^[ \t]+$/gm, '');
  });
}

function optimizeMediaMarkup(html, pagePath) {
  return optimizeIframes(optimizeImageTags(html, pagePath));
}

module.exports = {
  CARD_SIZES,
  CONTENT_SIZES,
  optimizeMediaMarkup,
  responsiveMedia
};
