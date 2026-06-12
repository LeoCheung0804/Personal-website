'use strict';

function updateThemeIcons(isLight) {
  const switchableIcons = ["icon-design", "icon-dev", "icon-app", "icon-photo", "icon-Project-Management", "icon-research"];
  const iconImages = document.querySelectorAll('.service-icon-box img');
  
  iconImages.forEach(img => {
    let src = img.getAttribute("src");
    if (!src) return;
    
    switchableIcons.forEach(iconName => {
      if (isLight && src.includes(`${iconName}.svg`)) {
        src = src.replace(`${iconName}.svg`, `${iconName}-silver.svg`);
      } else if (!isLight && src.includes(`${iconName}-silver.svg`)) {
        src = src.replace(`${iconName}-silver.svg`, `${iconName}.svg`);
      }
    });
    img.setAttribute("src", src);
  });
}

// Theme initialization (run early to prevent flash of wrong theme and JS errors blocking it)
const isLightTheme = localStorage.getItem("theme") === "light";
if (isLightTheme) {
  document.documentElement.classList.add("light-theme");
  updateThemeIcons(true);
}

// Light/Dark Mode Toggle logic
const themeBtn = document.querySelector("[data-theme-btn]");

if (themeBtn) {
  // initialize button icon on load if already light mode
  const isLightModeInit = document.documentElement.classList.contains("light-theme");
  if (isLightModeInit) {
    themeBtn.querySelector("ion-icon").setAttribute("name", "moon-outline");
    updateThemeIcons(true);
  }

  themeBtn.addEventListener("click", function () {
    document.documentElement.classList.toggle("light-theme");
    const isLight = document.documentElement.classList.contains("light-theme");
    
    updateThemeIcons(isLight);
    
    // update icon
    if (isLight) {
      this.querySelector("ion-icon").setAttribute("name", "moon-outline");
      localStorage.setItem("theme", "light");
    } else {
      this.querySelector("ion-icon").setAttribute("name", "sunny-outline");
      localStorage.setItem("theme", "dark");
    }
  });
}
