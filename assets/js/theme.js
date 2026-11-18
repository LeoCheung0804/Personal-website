'use strict';

function updateThemeIcons(isLight) {
  const switchableIcons = ["icon-design", "icon-dev", "icon-Project-Management", "icon-research"];
  const iconImages = document.querySelectorAll('.service-icon-box img');
  
  iconImages.forEach(img => {
    const original = img.getAttribute("src");
    if (!original) return;
    let src = original;
    
    switchableIcons.forEach(iconName => {
      if (isLight && src.includes(`${iconName}.svg`)) {
        src = src.replace(`${iconName}.svg`, `${iconName}-silver.svg`);
      } else if (!isLight && src.includes(`${iconName}-silver.svg`)) {
        src = src.replace(`${iconName}-silver.svg`, `${iconName}.svg`);
      }
    });
    if (src !== original) img.setAttribute("src", src);
  });
}

const themeBtn = document.querySelector("[data-theme-btn]");

function applyTheme(isLight) {
  document.documentElement.classList.toggle("light-theme", isLight);
  themeBtn?.setAttribute("aria-checked", String(isLight));
  updateThemeIcons(isLight);
}

applyTheme(readPreference("theme") === "light");
bindPreferenceSwitch(themeBtn, () => {
  const isLight = !document.documentElement.classList.contains("light-theme");
  applyTheme(isLight);
  writePreference("theme", isLight ? "light" : "dark");
});
