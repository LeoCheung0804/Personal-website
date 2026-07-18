'use strict';

const getFilterValue = function (element) {
  return element?.dataset.filterValue || element?.textContent.trim().toLowerCase() || "all";
};

const syncFilterControlGroup = function ({ buttons, selectItems, selectValue, activeValue }) {
  const controls = [...buttons, ...selectItems];

  controls.forEach((control) => {
    control.classList.toggle("active", getFilterValue(control) === activeValue);
  });

  const labelSource = controls.find((control) => getFilterValue(control) === activeValue);
  if (selectValue && labelSource) {
    selectValue.textContent = labelSource.textContent.trim();
  }
};

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

if (select) {
  select.addEventListener("click", function () { elementToggleFunc(this); });
}

for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {
    elementToggleFunc(select);
    filterFunc(getFilterValue(this));
  });
}

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

  for (let i = 0; i < publicationFilterItems.length; i++) {
    if (
      selectedValue === "all"
      || selectedValue === publicationFilterItems[i].dataset.publicationCategory
    ) {
      publicationFilterItems[i].classList.add("active");
    } else {
      publicationFilterItems[i].classList.remove("active");
    }
  }

  refreshFadeAnimations();
};

if (publicationSelect) {
  publicationSelect.addEventListener("click", function () { elementToggleFunc(this); });
}

for (let i = 0; i < publicationSelectItems.length; i++) {
  publicationSelectItems[i].addEventListener("click", function () {
    elementToggleFunc(publicationSelect);
    publicationFilterFunc(getFilterValue(this));
  });
}

for (let i = 0; i < publicationFilterBtn.length; i++) {
  publicationFilterBtn[i].addEventListener("click", function () {
    publicationFilterFunc(getFilterValue(this));
  });
}

function syncFilterControls() {
  syncProjectFilterControls();
  syncPublicationFilterControls();
}
