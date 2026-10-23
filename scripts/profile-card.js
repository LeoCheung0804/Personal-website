'use strict';

function escapeHtml(value) {
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Both generators use the same contact structure; the profile registry owns the values.
function renderProfileContacts(profile, translations, indent = '', eol = '\n') {
  const order = ['location', 'email', 'employer', 'organization', 'github', 'linkedin', 'orcid'];
  const profiles = new Set(['github', 'linkedin', 'orcid']);
  const icons = {
    email: 'mail-outline',
    location: 'location-outline',
    employer: 'business-outline',
    organization: 'link-outline',
    github: 'logo-octocat',
    linkedin: 'logo-linkedin',
    orcid: 'book-outline'
  };
  return order.map(id => {
    const contact = profile.contacts.find(item => item.id === id);
    if (!contact) throw new Error(`Missing profile contact: ${id}`);
    const label = contact.labelKey ? translations[contact.labelKey] : contact.label;
    const labelAttribute = contact.labelKey ? ` data-i18n="${escapeHtml(contact.labelKey)}"` : '';
    const lines = [];

    if (id === 'location') {
      lines.push('<li class="contact-item contact-location" data-contact-id="location">',
        `  <span class="contact-title"${labelAttribute}>${escapeHtml(label)}</span>`,
        '  <ion-icon class="contact-icon" name="location-outline" aria-hidden="true"></ion-icon>',
        `  <address class="contact-value" data-i18n="contact.hongKong">${escapeHtml(profile.location.en)}</address>`,
        '</li>');
    } else {
      const type = id === 'email' ? 'contact-primary' : profiles.has(id) ? 'contact-profile' : 'contact-affiliation';
      const accessibleName = profiles.has(id) ? ` aria-label="${escapeHtml(`${label}: ${contact.value}`)}"` : '';
      lines.push(`<li class="contact-item ${type}" data-contact-id="${id}">`,
        `  <a class="contact-link" href="${escapeHtml(contact.href)}"${accessibleName}>`,
        `    <ion-icon class="contact-icon" name="${icons[id]}" aria-hidden="true"></ion-icon>`,
        `    <span class="contact-title"${labelAttribute}>${escapeHtml(label)}</span>`,
        `    <span class="contact-value">${escapeHtml(contact.value)}</span>`,
        '  </a>', '</li>');
    }
    return lines.map(line => indent + line).join(eol);
  }).join(eol);
}

module.exports = { renderProfileContacts };
