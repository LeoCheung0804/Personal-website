'use strict';

const fs = require('fs');
const path = require('path');
const { commitFileTransaction } = require('./scripts/generation-transaction.js');
const {
  siteProfile,
  siteProjects,
  translations,
  validateSiteData
} = require('./assets/js/site-data.js');

validateSiteData();

const rootDir = __dirname;
const checkMode = process.argv.includes('--check');
const listMode = process.argv.includes('--list-files');
const changedFiles = [];
const pendingWrites = [];

const projectPages = Object.entries(siteProjects).map(([key, project]) => ({
  key,
  ...project
}));

const requiredIndexTranslationCounts = Object.fromEntries(`
  about.paragraph1 about.paragraph2 about.title blog.title
  contact.and contact.apply contact.email contact.employer contact.formTitle
  contact.hongKong contact.location contact.organization contact.privacyPolicy
  contact.recaptchaIntro contact.sendMessage contact.terms contact.title
  footer.backToTop nav.about nav.blog nav.contact nav.projects nav.publications
  nav.resume profile.title project.borderless.title project.cuBrick.title
  project.exoskeleton.title project.footController.title project.knowTouch.title
  project.microwave.title project.retractable.title project.spray.title
  project.tapper.title projectPreview.title projects.title
  publications.cuBrick.abstract publications.cuBrick.info publications.cuBrick.title
  publications.title resume.bsc.project resume.bsc.title resume.education
  resume.experience resume.graduateExecutive resume.graduateExecutive.project
  resume.mechanicalEngineer resume.mechanicalEngineer.projects resume.msc.project
  resume.msc.title resume.projectEngineer resume.projectEngineer.projects
  resume.summerInternship resume.summerInternship.project resume.title
  service.hardware.text service.hardware.title service.management.text
  service.management.title service.research.text service.research.title
  service.software.text service.software.title service.title sidebar.showContacts
`.trim().split(/\s+/).map((key) => [key, 1]));

Object.assign(requiredIndexTranslationCounts, {
  'filters.all': 4,
  'filters.hardware': 6,
  'filters.management': 6,
  'filters.selectCategory': 2,
  'filters.software': 3,
  'projectPreview.cuBrick': 2,
  'projectPreview.exoskeleton': 2,
  'projectPreview.knowTouch': 2,
  'projectPreview.spray': 2,
  'projectPreview.tapper': 2,
  'publications.filters.conference': 2,
  'publications.filters.journal': 2
});

const voidElements = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
  'link', 'meta', 'param', 'source', 'track', 'wbr'
]);

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeAttribute(value) {
  return escapeHtml(value).replace(/"/g, '&quot;');
}

function getAttribute(openTag, attributeName) {
  const pattern = new RegExp(
    `\\s${escapeRegExp(attributeName)}\\s*=\\s*(["'])([\\s\\S]*?)\\1`,
    'i'
  );
  const match = openTag.match(pattern);
  return match ? match[2] : null;
}

function setAttribute(openTag, attributeName, value) {
  const escapedValue = escapeAttribute(value);
  const pattern = new RegExp(
    `(\\s${escapeRegExp(attributeName)}\\s*=\\s*)(["'])([\\s\\S]*?)\\2`,
    'i'
  );

  if (pattern.test(openTag)) {
    return openTag.replace(pattern, (match, prefix) => `${prefix}"${escapedValue}"`);
  }

  return openTag.replace(/(\s*\/?>)$/, ` ${attributeName}="${escapedValue}"$1`);
}

function hasClass(openTag, className) {
  const classValue = getAttribute(openTag, 'class');
  return classValue ? classValue.split(/\s+/).includes(className) : false;
}

function findOpeningTags(html, predicate) {
  const matches = [];
  const pattern = /<([A-Za-z][\w:-]*)\b[^>]*>/g;
  let match;

  while ((match = pattern.exec(html)) !== null) {
    if (predicate(match[0], match[1])) {
      matches.push({
        tagName: match[1].toLowerCase(),
        openStart: match.index,
        openEnd: pattern.lastIndex,
        openTag: match[0]
      });
    }
  }

  return matches;
}

function findElementRange(html, opening) {
  if (voidElements.has(opening.tagName) || /\/\s*>$/.test(opening.openTag)) {
    return { ...opening, closeStart: opening.openEnd, closeEnd: opening.openEnd };
  }

  const tagPattern = new RegExp(
    `<\\/?${escapeRegExp(opening.tagName)}\\b[^>]*>`,
    'gi'
  );
  tagPattern.lastIndex = opening.openEnd;
  let depth = 1;
  let match;

  while ((match = tagPattern.exec(html)) !== null) {
    const isClosingTag = /^<\s*\//.test(match[0]);
    const isSelfClosingTag = /\/\s*>$/.test(match[0]);

    if (isClosingTag) {
      depth -= 1;
      if (depth === 0) {
        return {
          ...opening,
          closeStart: match.index,
          closeEnd: tagPattern.lastIndex
        };
      }
    } else if (!isSelfClosingTag) {
      depth += 1;
    }
  }

  throw new Error(`Could not find closing </${opening.tagName}> tag.`);
}

function findElements(html, predicate) {
  return findOpeningTags(html, predicate).map((opening) => findElementRange(html, opening));
}

function replaceElements(html, predicate, expectedCount, updateElement, label) {
  const elements = findElements(html, predicate);
  if (elements.length !== expectedCount) {
    throw new Error(`${label}: expected ${expectedCount} element(s), found ${elements.length}.`);
  }

  let output = html;
  for (let index = elements.length - 1; index >= 0; index -= 1) {
    const element = elements[index];
    const closingTag = output.slice(element.closeStart, element.closeEnd);
    const currentInner = output.slice(element.openEnd, element.closeStart);
    const updated = updateElement({
      index,
      openTag: element.openTag,
      inner: currentInner,
      closingTag
    });
    const replacement = `${updated.openTag ?? element.openTag}${updated.inner ?? currentInner}${closingTag}`;
    output = output.slice(0, element.openStart) + replacement + output.slice(element.closeEnd);
  }

  return output;
}

function replaceElementsByClass(html, tagName, className, expectedCount, updateElement, label) {
  return replaceElements(
    html,
    (openTag, foundTagName) =>
      (!tagName || foundTagName.toLowerCase() === tagName.toLowerCase()) && hasClass(openTag, className),
    expectedCount,
    updateElement,
    label
  );
}

function lineIndentAt(html, index) {
  const lineStart = html.lastIndexOf('\n', index - 1) + 1;
  return html.slice(lineStart, index).match(/^\s*/)[0];
}

function dedent(value) {
  const lines = String(value).replace(/\r\n/g, '\n').split('\n');
  while (lines.length && !lines[0].trim()) lines.shift();
  while (lines.length && !lines[lines.length - 1].trim()) lines.pop();
  const indents = lines
    .filter((line) => line.trim())
    .map((line) => line.match(/^\s*/)[0].length);
  const minimumIndent = indents.length ? Math.min(...indents) : 0;
  return lines.map((line) => line.slice(minimumIndent)).join('\n');
}

function formatBlock(value, parentIndent, eol, generatedComment) {
  const source = generatedComment
    ? `<!-- ${generatedComment} -->\n${dedent(value)}`
    : dedent(value);
  const childIndent = `${parentIndent}  `;
  const body = source
    .split('\n')
    .map((line) => `${childIndent}${line}`)
    .join(eol);
  return `${eol}${body}${eol}${parentIndent}`;
}

function renderTranslation(value) {
  return /<\/?[A-Za-z][^>]*>/.test(value) ? value : escapeHtml(value);
}

function validateCanonicalData() {
  const projectFiles = projectPages.map(({ file }) => file);
  if (new Set(projectFiles).size !== projectFiles.length) {
    throw new Error('siteProjects contains duplicate project files.');
  }

  for (const project of projectPages) {
    if (!project.file || !project.title?.en || !project.title?.zhHant) {
      throw new Error(`siteProjects.${project.key} is missing a file or localized title.`);
    }

    const requiredSeoFields = [
      'description', 'ogDescription', 'twitterDescription', 'image',
      'structuredDescription', 'keywords', 'lastmod'
    ];
    const missingSeoFields = requiredSeoFields.filter((field) => !project.seo?.[field]);
    if (missingSeoFields.length) {
      throw new Error(`siteProjects.${project.key}.seo is missing ${missingSeoFields.join(', ')}.`);
    }

    for (const language of ['en', 'zhHant']) {
      const copy = project.copy?.[language];
      if (!copy?.content || copy.title !== project.title[language]) {
        throw new Error(`Project copy mismatch for ${project.key}.${language}.`);
      }
    }
  }
}

function validateIndexTranslationStructure(html, fileLabel) {
  const actualCounts = {};
  findOpeningTags(html, (openTag) => getAttribute(openTag, 'data-i18n') !== null)
    .forEach(({ openTag }) => {
      const key = getAttribute(openTag, 'data-i18n');
      actualCounts[key] = (actualCounts[key] || 0) + 1;
    });

  for (const [key, expectedCount] of Object.entries(requiredIndexTranslationCounts)) {
    const actualCount = actualCounts[key] || 0;
    if (actualCount !== expectedCount) {
      throw new Error(`${fileLabel}: expected ${expectedCount} data-i18n="${key}" element(s), found ${actualCount}.`);
    }
  }

  const requiredAttributeCounts = {
    'data-i18n-placeholder': {
      'contact.emailAddress': 1,
      'contact.fullName': 1,
      'contact.message': 1
    },
    'data-i18n-aria-label': {
      'language.toggle': 1,
      'theme.toggle': 1
    }
  };

  for (const [attributeName, requiredCounts] of Object.entries(requiredAttributeCounts)) {
    const attributeCounts = {};
    findOpeningTags(html, (openTag) => getAttribute(openTag, attributeName) !== null)
      .forEach(({ openTag }) => {
        const key = getAttribute(openTag, attributeName);
        attributeCounts[key] = (attributeCounts[key] || 0) + 1;
      });
    for (const [key, expectedCount] of Object.entries(requiredCounts)) {
      if ((attributeCounts[key] || 0) !== expectedCount) {
        throw new Error(`${fileLabel}: expected ${expectedCount} ${attributeName}="${key}" element(s).`);
      }
    }
  }
}

function validateSecondaryPageStructure(html, fileLabel, pageType) {
  const requiredKeys = [
    'nav.about', 'nav.resume', 'nav.projects',
    'nav.publications', 'nav.blog', 'nav.contact'
  ];

  if (pageType === 'project') {
    requiredKeys.push('projects.back', 'project.overview');
  } else if (pageType === 'blog') {
    requiredKeys.push('blog.backToBlog');
    if (fileLabel === 'blog-post.html') requiredKeys.push('blog.loadError');
  }

  const keyCounts = {};
  findOpeningTags(html, (openTag) => getAttribute(openTag, 'data-i18n') !== null)
    .forEach(({ openTag }) => {
      const key = getAttribute(openTag, 'data-i18n');
      keyCounts[key] = (keyCounts[key] || 0) + 1;
    });

  requiredKeys.forEach((key) => {
    if ((keyCounts[key] || 0) !== 1) {
      throw new Error(`${fileLabel}: expected one data-i18n="${key}" element.`);
    }
  });

  for (const key of ['language.toggle', 'theme.toggle']) {
    const count = findOpeningTags(
      html,
      (openTag) => getAttribute(openTag, 'data-i18n-aria-label') === key
    ).length;
    if (count !== 1) {
      throw new Error(`${fileLabel}: expected one data-i18n-aria-label="${key}" element.`);
    }
  }
}

function syncDataI18n(html, fileLabel) {
  const allElements = findElements(
    html,
    (openTag) => getAttribute(openTag, 'data-i18n') !== null
  );
  const elements = allElements.filter((element) => !allElements.some((parent) =>
    parent.openStart < element.openStart && parent.closeEnd > element.closeEnd
  ));
  let output = html;

  for (let index = elements.length - 1; index >= 0; index -= 1) {
    const element = elements[index];
    if (voidElements.has(element.tagName)) continue;

    const key = getAttribute(element.openTag, 'data-i18n');
    const value = translations.en[key];
    if (value === undefined) {
      throw new Error(`${fileLabel}: missing English translation for ${key}.`);
    }

    const renderedValue = key === 'projects.back'
      ? `&larr; ${renderTranslation(value)}`
      : renderTranslation(value);

    output = output.slice(0, element.openEnd)
      + renderedValue
      + output.slice(element.closeStart);
  }

  return output;
}

function syncTranslatedAttribute(html, fileLabel, dataAttribute, outputAttribute) {
  const openings = findOpeningTags(
    html,
    (openTag) => getAttribute(openTag, dataAttribute) !== null
  );
  let output = html;

  for (let index = openings.length - 1; index >= 0; index -= 1) {
    const opening = openings[index];
    const key = getAttribute(opening.openTag, dataAttribute);
    const value = translations.en[key];
    if (value === undefined) {
      throw new Error(`${fileLabel}: missing English translation for ${key}.`);
    }
    const updatedTag = setAttribute(opening.openTag, outputAttribute, value);
    output = output.slice(0, opening.openStart) + updatedTag + output.slice(opening.openEnd);
  }

  return output;
}

function getContactLabel(contact) {
  return contact.labelKey ? translations.en[contact.labelKey] : contact.label;
}

function syncSharedShell(html, fileLabel) {
  const contactIds = siteProfile.contacts.map(({ id }) => id);
  if (new Set(contactIds).size !== contactIds.length) {
    throw new Error('siteProfile.contacts contains duplicate IDs.');
  }

  html = replaceElements(
    html,
    (openTag, tagName) => {
      const src = getAttribute(openTag, 'src') || '';
      return tagName.toLowerCase() === 'img' && /assets\/images\/profile\.jpg$/i.test(src);
    },
    1,
    ({ openTag }) => ({ openTag: setAttribute(openTag, 'alt', siteProfile.name) }),
    `${fileLabel} profile image`
  );

  html = replaceElementsByClass(
    html,
    'h1',
    'name',
    1,
    ({ openTag }) => ({
      openTag: setAttribute(openTag, 'title', siteProfile.name),
      inner: escapeHtml(siteProfile.name)
    }),
    `${fileLabel} profile name`
  );

  html = replaceElementsByClass(
    html,
    'p',
    'title',
    1,
    () => ({ inner: escapeHtml(siteProfile.role.en) }),
    `${fileLabel} profile role`
  );

  const contactItems = findElements(
    html,
    (openTag, tagName) => tagName.toLowerCase() === 'li' && hasClass(openTag, 'contact-item')
  );
  if (contactItems.length !== siteProfile.contacts.length) {
    throw new Error(`${fileLabel}: expected ${siteProfile.contacts.length} contact items.`);
  }

  const itemIds = contactItems.map(({ openTag }) => getAttribute(openTag, 'data-contact-id'));
  if (itemIds.some((id) => !id) || new Set(itemIds).size !== itemIds.length) {
    throw new Error(`${fileLabel}: contact items require unique data-contact-id values.`);
  }
  const unexpectedIds = itemIds.filter((id) => !contactIds.includes(id));
  const missingIds = contactIds.filter((id) => !itemIds.includes(id));
  if (unexpectedIds.length || missingIds.length) {
    throw new Error(`${fileLabel}: contact IDs do not match siteProfile.contacts.`);
  }

  for (let index = contactItems.length - 1; index >= 0; index -= 1) {
    const item = contactItems[index];
    const contactId = getAttribute(item.openTag, 'data-contact-id');
    const contact = siteProfile.contacts.find(({ id }) => id === contactId);
    let itemHtml = html.slice(item.openStart, item.closeEnd);

    itemHtml = replaceElementsByClass(
      itemHtml,
      'p',
      'contact-title',
      1,
      () => ({ inner: escapeHtml(getContactLabel(contact)) }),
      `${fileLabel} ${contactId} label`
    );

    if (contact.id === 'location') {
      itemHtml = replaceElements(
        itemHtml,
        (openTag, tagName) => tagName.toLowerCase() === 'address',
        1,
        () => ({ inner: escapeHtml(siteProfile.location.en) }),
        `${fileLabel} location value`
      );
    } else {
      itemHtml = replaceElementsByClass(
        itemHtml,
        'a',
        'contact-link',
        1,
        ({ openTag }) => ({
          openTag: setAttribute(openTag, 'href', contact.href),
          inner: escapeHtml(contact.value)
        }),
        `${fileLabel} ${contactId} link`
      );
    }

    html = html.slice(0, item.openStart) + itemHtml + html.slice(item.closeEnd);
  }

  html = replaceElementsByClass(
    html,
    'p',
    'copyright',
    1,
    () => ({ inner: `&copy; ${siteProfile.copyrightYear} ${escapeHtml(siteProfile.name)}` }),
    `${fileLabel} copyright`
  );

  html = replaceElementsByClass(
    html,
    null,
    'back-to-top',
    1,
    () => ({ inner: escapeHtml(translations.en['footer.backToTop']) }),
    `${fileLabel} back-to-top link`
  );

  html = replaceOptionalMetaContent(html, fileLabel, 'name', 'author', siteProfile.name);

  return html;
}

function replaceMetaContent(html, fileLabel, attributeName, attributeValue, content) {
  const openings = findOpeningTags(
    html,
    (openTag, tagName) =>
      tagName.toLowerCase() === 'meta' && getAttribute(openTag, attributeName) === attributeValue
  );
  if (openings.length !== 1) {
    throw new Error(`${fileLabel}: expected one meta[${attributeName}="${attributeValue}"].`);
  }
  const opening = openings[0];
  const updatedTag = setAttribute(opening.openTag, 'content', content);
  return html.slice(0, opening.openStart) + updatedTag + html.slice(opening.openEnd);
}

function replaceOptionalMetaContent(html, fileLabel, attributeName, attributeValue, content) {
  const openings = findOpeningTags(
    html,
    (openTag, tagName) =>
      tagName.toLowerCase() === 'meta' && getAttribute(openTag, attributeName) === attributeValue
  );
  if (openings.length > 1) {
    throw new Error(`${fileLabel}: expected at most one meta[${attributeName}="${attributeValue}"].`);
  }
  if (!openings.length) return html;
  const opening = openings[0];
  const updatedTag = setAttribute(opening.openTag, 'content', content);
  return html.slice(0, opening.openStart) + updatedTag + html.slice(opening.openEnd);
}

function replaceLinkHref(html, fileLabel, rel, href) {
  const openings = findOpeningTags(
    html,
    (openTag, tagName) =>
      tagName.toLowerCase() === 'link' && getAttribute(openTag, 'rel') === rel
  );
  if (openings.length !== 1) {
    throw new Error(`${fileLabel}: expected one link[rel="${rel}"].`);
  }
  const opening = openings[0];
  const updatedTag = setAttribute(opening.openTag, 'href', href);
  return html.slice(0, opening.openStart) + updatedTag + html.slice(opening.openEnd);
}

function absoluteSiteUrl(sitePath = '') {
  return new URL(sitePath, `${siteProfile.siteUrl}/`).toString();
}

function replaceJsonLdByType(html, fileLabel, schemaType, updateData, eol) {
  const elements = findElements(
    html,
    (openTag, tagName) =>
      tagName.toLowerCase() === 'script' && getAttribute(openTag, 'type') === 'application/ld+json',
  );

  const candidates = elements.map((element) => {
    let data;
    try {
      data = JSON.parse(html.slice(element.openEnd, element.closeStart).trim());
    } catch (error) {
      throw new Error(`${fileLabel}: invalid JSON-LD (${error.message}).`);
    }
    return { element, data };
  }).filter(({ data }) => data['@type'] === schemaType);

  if (candidates.length !== 1) {
    throw new Error(`${fileLabel}: expected one ${schemaType} JSON-LD block, found ${candidates.length}.`);
  }

  const { element, data } = candidates[0];
  const updatedData = updateData(data) || data;
  const parentIndent = lineIndentAt(html, element.openStart);
  const updatedInner = formatBlock(JSON.stringify(updatedData, null, 2), parentIndent, eol);
  return html.slice(0, element.openEnd) + updatedInner + html.slice(element.closeStart);
}

function syncProjectJsonLd(html, fileLabel, project, eol) {
  return replaceJsonLdByType(html, fileLabel, 'CreativeWork', (data) => {
    data.headline = project.title.en;
    data.name = project.title.en;
    data.url = absoluteSiteUrl(project.file);
    data.image = absoluteSiteUrl(project.seo.image);
    data.description = project.seo.structuredDescription;
    data.keywords = project.seo.keywords;
    if (data.author && typeof data.author === 'object') {
      data.author.name = siteProfile.name;
      data.author.url = `${siteProfile.siteUrl}/`;
    }
    return data;
  }, eol);
}

function syncHomepageProjectLinks(html, fileLabel) {
  const projectLinks = findElements(
    html,
    (openTag, tagName) => tagName.toLowerCase() === 'a'
  ).map((element) => {
    const inner = html.slice(element.openEnd, element.closeStart);
    const previewMatch = inner.match(/data-i18n=["']projectPreview\.([^"']+)["']/);
    const cardMatch = inner.match(/data-i18n=["']project\.([^"']+)\.title["']/);
    return {
      element,
      key: previewMatch?.[1] || cardMatch?.[1] || null
    };
  }).filter(({ key }) => key);

  const actualCounts = {};
  projectLinks.forEach(({ key }) => {
    actualCounts[key] = (actualCounts[key] || 0) + 1;
  });

  for (const project of projectPages) {
    const expectedCount = project.previewTitle ? 3 : 1;
    if ((actualCounts[project.key] || 0) !== expectedCount) {
      throw new Error(`${fileLabel}: expected ${expectedCount} link(s) for project ${project.key}.`);
    }
  }

  let output = html;
  for (let index = projectLinks.length - 1; index >= 0; index -= 1) {
    const { element, key } = projectLinks[index];
    const project = siteProjects[key];
    if (!project) {
      throw new Error(`${fileLabel}: unknown project link key ${key}.`);
    }
    const updatedTag = setAttribute(element.openTag, 'href', project.file);
    output = output.slice(0, element.openStart) + updatedTag + output.slice(element.openEnd);
  }

  return output;
}

function syncHomepageMetadata(html, fileLabel, eol) {
  const canonicalUrl = `${siteProfile.siteUrl}/`;
  const imageUrl = absoluteSiteUrl(siteProfile.seo.image);

  html = syncHomepageProjectLinks(html, fileLabel);

  html = replaceElements(
    html,
    (openTag, tagName) => tagName.toLowerCase() === 'title',
    1,
    () => ({ inner: escapeHtml(siteProfile.seo.title) }),
    `${fileLabel} document title`
  );
  html = replaceMetaContent(html, fileLabel, 'name', 'description', siteProfile.seo.description);
  html = replaceMetaContent(html, fileLabel, 'name', 'keywords', siteProfile.seo.keywords);
  html = replaceMetaContent(html, fileLabel, 'name', 'author', siteProfile.name);
  html = replaceLinkHref(html, fileLabel, 'canonical', canonicalUrl);
  html = replaceMetaContent(html, fileLabel, 'property', 'og:title', siteProfile.seo.title);
  html = replaceMetaContent(html, fileLabel, 'property', 'og:description', siteProfile.seo.ogDescription);
  html = replaceMetaContent(html, fileLabel, 'property', 'og:image', imageUrl);
  html = replaceMetaContent(html, fileLabel, 'property', 'og:url', canonicalUrl);
  html = replaceMetaContent(html, fileLabel, 'property', 'og:site_name', `${siteProfile.name} Portfolio`);
  html = replaceMetaContent(html, fileLabel, 'name', 'twitter:title', siteProfile.seo.title);
  html = replaceMetaContent(html, fileLabel, 'name', 'twitter:description', siteProfile.seo.twitterDescription);
  html = replaceMetaContent(html, fileLabel, 'name', 'twitter:image', imageUrl);

  html = replaceJsonLdByType(html, fileLabel, 'ProfilePage', (data) => {
    data.name = siteProfile.seo.schemaName;
    data.url = canonicalUrl;
    data.description = siteProfile.seo.schemaDescription;
    data.mainEntity = {
      ...(data.mainEntity || {}),
      '@type': 'Person',
      name: siteProfile.name,
      jobTitle: siteProfile.role.en,
      url: canonicalUrl,
      image: imageUrl,
      address: {
        '@type': 'PostalAddress',
        addressLocality: siteProfile.location.en
      },
      sameAs: siteProfile.contacts
        .filter(({ id }) => ['github', 'linkedin', 'orcid'].includes(id))
        .map(({ href }) => href),
      knowsAbout: siteProfile.seo.knowsAbout
    };
    return data;
  }, eol);

  html = replaceJsonLdByType(html, fileLabel, 'ItemList', (data) => {
    data.name = `Robotics and Engineering Projects by ${siteProfile.name}`;
    data.itemListElement = projectPages.map((project, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: absoluteSiteUrl(project.file),
      name: project.title.en,
      description: project.seo.structuredDescription
    }));
    return data;
  }, eol);

  return html;
}

function syncProjectPage(html, project, fileLabel, eol) {
  const copy = project.copy?.en;
  if (!copy) {
    throw new Error(`${fileLabel}: missing English project content for ${project.key}.`);
  }
  if (copy.title !== project.title.en) {
    throw new Error(`${fileLabel}: project translation title does not match siteProjects.${project.key}.`);
  }

  html = replaceElementsByClass(
    html,
    'article',
    'portfolio',
    1,
    ({ openTag }) => ({
      openTag: setAttribute(openTag, 'data-project-key', project.key)
    }),
    `${fileLabel} project article`
  );

  html = replaceElementsByClass(
    html,
    'h2',
    'article-title',
    1,
    () => ({ inner: escapeHtml(project.title.en) }),
    `${fileLabel} project title`
  );

  const contentElements = findElements(
    html,
    (openTag, tagName) => tagName.toLowerCase() === 'div' && hasClass(openTag, 'project-content')
  );
  if (contentElements.length !== 1) {
    throw new Error(`${fileLabel}: expected one project-content element.`);
  }
  const parentIndent = lineIndentAt(html, contentElements[0].openStart);
  html = replaceElementsByClass(
    html,
    'div',
    'project-content',
    1,
    () => ({
      inner: formatBlock(
        copy.content,
        parentIndent,
        eol,
        'Generated from assets/js/site-data.js by generate-site-content.js.'
      )
    }),
    `${fileLabel} project content`
  );

  const documentTitle = `${project.title.en} | ${siteProfile.name}`;
  const canonicalUrl = absoluteSiteUrl(project.file);
  const imageUrl = absoluteSiteUrl(project.seo.image);
  html = replaceElements(
    html,
    (openTag, tagName) => tagName.toLowerCase() === 'title',
    1,
    () => ({ inner: escapeHtml(documentTitle) }),
    `${fileLabel} document title`
  );
  html = replaceMetaContent(html, fileLabel, 'name', 'description', project.seo.description);
  html = replaceMetaContent(html, fileLabel, 'property', 'og:title', documentTitle);
  html = replaceMetaContent(html, fileLabel, 'property', 'og:description', project.seo.ogDescription);
  html = replaceMetaContent(html, fileLabel, 'property', 'og:image', imageUrl);
  html = replaceMetaContent(html, fileLabel, 'property', 'og:url', canonicalUrl);
  html = replaceMetaContent(html, fileLabel, 'name', 'twitter:title', documentTitle);
  html = replaceMetaContent(html, fileLabel, 'name', 'twitter:description', project.seo.twitterDescription);
  html = replaceMetaContent(html, fileLabel, 'name', 'twitter:image', imageUrl);
  html = replaceLinkHref(html, fileLabel, 'canonical', canonicalUrl);
  html = syncProjectJsonLd(html, fileLabel, project, eol);

  return html;
}

function updateFile(relativePath, transform) {
  const absolutePath = path.join(rootDir, relativePath);
  if (!fs.existsSync(absolutePath)) {
    throw new Error(`${relativePath}: file does not exist.`);
  }

  const original = fs.readFileSync(absolutePath, 'utf8');
  const eol = original.includes('\r\n') ? '\r\n' : '\n';
  const updated = transform(original, eol);

  if (updated !== original) {
    changedFiles.push(relativePath.replace(/\\/g, '/'));
    pendingWrites.push({ absolutePath, updated });
  }
}

function getSharedPagePaths() {
  const blogDir = path.join(rootDir, 'blog');
  const blogPages = fs.existsSync(blogDir)
    ? fs.readdirSync(blogDir)
      .filter((file) => file.toLowerCase().endsWith('.html'))
      .sort()
      .map((file) => path.join('blog', file))
    : [];

  return [
    'index.html',
    'blog-post.html',
    ...projectPages.map((project) => project.file),
    ...blogPages
  ];
}

function getGeneratedGitPaths() {
  return [
    'assets/data/posts.json',
    'sitemap.xml',
    'blog',
    'index.html',
    'blog-post.html',
    ...projectPages.map((project) => project.file)
  ];
}

const projectByFile = new Map(projectPages.map((project) => [project.file, project]));

if (listMode) {
  getGeneratedGitPaths().forEach((file) => console.log(file));
} else {
  validateCanonicalData();

  for (const relativePath of getSharedPagePaths()) {
    updateFile(relativePath, (html, eol) => {
      if (relativePath === 'index.html') {
        validateIndexTranslationStructure(html, relativePath);
      } else {
        validateSecondaryPageStructure(
          html,
          relativePath,
          projectByFile.has(relativePath) ? 'project' : 'blog'
        );
      }

      let output = syncDataI18n(html, relativePath);
      output = syncTranslatedAttribute(output, relativePath, 'data-i18n-placeholder', 'placeholder');
      output = syncTranslatedAttribute(output, relativePath, 'data-i18n-aria-label', 'aria-label');
      output = syncSharedShell(output, relativePath);

      if (relativePath === 'index.html') {
        output = syncHomepageMetadata(output, relativePath, eol);
      }

      const project = projectByFile.get(relativePath);
      if (project) {
        output = syncProjectPage(output, project, relativePath, eol);
      }

      return output;
    });
  }

  if (!checkMode) {
    commitFileTransaction(pendingWrites.map(({ absolutePath, updated }) => ({
      targetPath: absolutePath,
      content: updated
    })));
  }

  if (checkMode && changedFiles.length) {
    console.error('Generated site content is out of date:');
    changedFiles.forEach((file) => console.error(`- ${file}`));
    process.exitCode = 1;
  } else if (changedFiles.length) {
    console.log(`Updated ${changedFiles.length} generated site content file(s):`);
    changedFiles.forEach((file) => console.log(`- ${file}`));
  } else {
    console.log('Generated site content is already up to date.');
  }
}
