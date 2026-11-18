'use strict';

function renderPreferenceSwitch(kind, translations, indent, eol = '\n') {
  const isLanguage = kind === 'lang';
  const label = isLanguage ? 'language.traditionalChinese' : 'theme.lightMode';
  const name = translations[label].replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  return [
    `<button class="preference-switch" type="button" role="switch" aria-checked="false" aria-label="${name}" data-i18n-aria-label="${label}" data-${kind}-btn>`,
    '  <span class="preference-switch__track" aria-hidden="true">',
    isLanguage ? '    <span class="preference-switch__option" lang="en">EN</span>' : '    <span class="preference-switch__option">☾</span>',
    isLanguage ? '    <span class="preference-switch__option" lang="zh-Hant">繁</span>' : '    <span class="preference-switch__option">☀︎</span>',
    '    <span class="preference-switch__ripple"></span>',
    '  </span>',
    '</button>'
  ].join(eol + indent);
}

module.exports = { renderPreferenceSwitch };
