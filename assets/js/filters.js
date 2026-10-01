'use strict';

const getFilterValue = function (element) {
  return element?.dataset.filterValue || element?.textContent.trim().toLowerCase() || "all";
};

const syncFilterControlGroup = function ({ buttons, selectItems, selectValue, activeValue }) {
  const controls = [...buttons, ...selectItems];

  controls.forEach((control) => {
    control.classList.toggle("active", getFilterValue(control) === activeValue);
  });
  buttons.forEach((button) => {
    button.setAttribute("aria-pressed", String(getFilterValue(button) === activeValue));
  });
  selectItems.forEach((item) => {
    item.setAttribute("aria-checked", String(getFilterValue(item) === activeValue));
  });

  const labelSource = controls.find((control) => getFilterValue(control) === activeValue);
  if (selectValue && labelSource) {
    selectValue.textContent = labelSource.textContent.trim();
  }
};

function initFilterSelect(trigger, selectItems, onSelect, menuId) {
  const menu = trigger?.nextElementSibling;
  const wrapper = trigger?.parentElement;
  const items = [...selectItems];
  if (!trigger || !menu || !wrapper || !items.length) return;

  if (!menu.id) menu.id = menuId;
  trigger.setAttribute("aria-haspopup", "menu");
  trigger.setAttribute("aria-controls", menu.id);
  menu.setAttribute("role", "menu");
  menu.dataset.i18nAriaLabel = "filters.selectCategory";
  menu.setAttribute("aria-label", typeof getTranslation === "function" ? getTranslation("filters.selectCategory") : "Select category");
  menu.querySelectorAll("li").forEach((item) => item.setAttribute("role", "none"));
  items.forEach((item) => {
    item.setAttribute("role", "menuitemradio");
    item.tabIndex = -1;
  });
  let focusFrame;

  const focusItem = (index) => {
    items.forEach((item, itemIndex) => { item.tabIndex = itemIndex === index ? 0 : -1; });
    items[index].focus();
  };

  const setOpen = (open, { focusIndex = null, restoreFocus = false } = {}) => {
    cancelAnimationFrame(focusFrame);
    trigger.classList.toggle("active", open);
    trigger.setAttribute("aria-expanded", String(open));
    menu.inert = !open;
    menu.setAttribute("aria-hidden", String(!open));
    if (open && focusIndex !== null) {
      // Focus after the visibility transition has entered its visible state.
      focusFrame = requestAnimationFrame(() => {
        focusFrame = requestAnimationFrame(() => {
          if (trigger.classList.contains("active")) focusItem(focusIndex);
        });
      });
    }
    if (!open) items.forEach((item) => { item.tabIndex = -1; });
    if (restoreFocus) trigger.focus();
  };

  trigger.addEventListener("click", () => {
    const open = !trigger.classList.contains("active");
    const selectedIndex = Math.max(0, items.findIndex((item) => item.classList.contains("active")));
    setOpen(open, { focusIndex: open ? selectedIndex : null });
  });

  trigger.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    event.preventDefault();
    setOpen(true, { focusIndex: event.key === "ArrowUp" ? items.length - 1 : 0 });
  });

  wrapper.addEventListener("keydown", (event) => {
    if (!trigger.classList.contains("active")) return;
    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false, { restoreFocus: true });
      return;
    }
    if (!menu.contains(event.target)) return;
    const currentIndex = Math.max(0, items.indexOf(document.activeElement));
    const targetIndex = {
      ArrowDown: (currentIndex + 1) % items.length,
      ArrowUp: (currentIndex + items.length - 1) % items.length,
      Home: 0,
      End: items.length - 1
    }[event.key];
    if (targetIndex === undefined) return;
    event.preventDefault();
    focusItem(targetIndex);
  });

  items.forEach((item) => {
    item.addEventListener("click", () => {
      onSelect(getFilterValue(item));
      setOpen(false, { restoreFocus: true });
    });
  });

  document.addEventListener("pointerdown", (event) => {
    if (!wrapper.contains(event.target)) setOpen(false);
  });
  wrapper.addEventListener("focusout", (event) => {
    if (!wrapper.contains(event.relatedTarget)) setOpen(false);
  });
  document.addEventListener("site:page-activated", () => setOpen(false));
  setOpen(false);
}

// project filters
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");
const filterItems = document.querySelectorAll("[data-filter-item]");
let activeProjectFilterValue = getFilterValue(document.querySelector("[data-filter-btn].active"));

const syncProjectFilterControls = function () {
  syncFilterControlGroup({
    buttons: filterBtn,
    selectItems,
    selectValue,
    activeValue: activeProjectFilterValue
  });
};

const filterFunc = function (selectedValue) {
  activeProjectFilterValue = selectedValue;
  syncProjectFilterControls();

  for (let i = 0; i < filterItems.length; i++) {
    if (selectedValue === "all" || selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }
  }

  refreshFadeAnimations();
};

initFilterSelect(select, selectItems, filterFunc, "project-filter-options");

for (let i = 0; i < filterBtn.length; i++) {
  filterBtn[i].addEventListener("click", function () {
    filterFunc(getFilterValue(this));
  });
}

// publication filters
const publicationSelect = document.querySelector("[data-publication-select]");
const publicationSelectItems = document.querySelectorAll("[data-publication-select-item]");
const publicationSelectValue = document.querySelector("[data-publication-select-value]");
const publicationFilterBtn = document.querySelectorAll("[data-publication-filter-btn]");
const publicationFilterItems = document.querySelectorAll("[data-publication-filter-item]");
const publicationEmpty = document.querySelector("[data-publication-empty]");
let activePublicationFilterValue = getFilterValue(
  document.querySelector("[data-publication-filter-btn].active")
);

const syncPublicationFilterControls = function () {
  syncFilterControlGroup({
    buttons: publicationFilterBtn,
    selectItems: publicationSelectItems,
    selectValue: publicationSelectValue,
    activeValue: activePublicationFilterValue
  });
};

const publicationFilterFunc = function (selectedValue) {
  activePublicationFilterValue = selectedValue;
  syncPublicationFilterControls();
  let visibleCount = 0;

  for (let i = 0; i < publicationFilterItems.length; i++) {
    if (
      selectedValue === "all"
      || selectedValue === publicationFilterItems[i].dataset.publicationCategory
    ) {
      publicationFilterItems[i].classList.add("active");
      visibleCount += 1;
    } else {
      publicationFilterItems[i].classList.remove("active");
    }
  }

  if (publicationEmpty) publicationEmpty.hidden = visibleCount > 0;
  refreshFadeAnimations();
};

initFilterSelect(publicationSelect, publicationSelectItems, publicationFilterFunc, "publication-filter-options");

for (let i = 0; i < publicationFilterBtn.length; i++) {
  publicationFilterBtn[i].addEventListener("click", function () {
    publicationFilterFunc(getFilterValue(this));
  });
}

function syncFilterControls() {
  syncProjectFilterControls();
  syncPublicationFilterControls();
}
