'use strict';

const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

if (select) {
  select.addEventListener("click", function () { elementToggleFunc(this); });
}

// add event in all select items
if (selectItems.length > 0) {
  for (let i = 0; i < selectItems.length; i++) {
    selectItems[i].addEventListener("click", function () {

      let selectedValue = this.dataset.filterValue || this.innerText.toLowerCase();
      selectValue.innerText = this.innerText;
      elementToggleFunc(select);
      filterFunc(selectedValue);

    });
  }
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {

  for (let i = 0; i < filterItems.length; i++) {

    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }

  }

  refreshFadeAnimations();

}

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

if (filterBtn.length > 0) {
  for (let i = 0; i < filterBtn.length; i++) {

    filterBtn[i].addEventListener("click", function () {

      let selectedValue = this.dataset.filterValue || this.innerText.toLowerCase();
      selectValue.innerText = this.innerText;
      filterFunc(selectedValue);

      lastClickedBtn.classList.remove("active");
      this.classList.add("active");
      lastClickedBtn = this;

    });

  }
}

// publications filter variables
const publicationSelect = document.querySelector("[data-publication-select]");
const publicationSelectItems = document.querySelectorAll("[data-publication-select-item]");
const publicationSelectValue = document.querySelector("[data-publication-select-value]");
const publicationFilterBtn = document.querySelectorAll("[data-publication-filter-btn]");
const publicationFilterItems = document.querySelectorAll("[data-publication-filter-item]");
const getPublicationFilterValue = function (elem) {
  return elem.dataset.filterValue || elem.textContent.trim().toLowerCase();
}

if (publicationSelect) {
  publicationSelect.addEventListener("click", function () { elementToggleFunc(this); });
}

const publicationFilterFunc = function (selectedValue) {

  for (let i = 0; i < publicationFilterItems.length; i++) {

    if (selectedValue === "all") {
      publicationFilterItems[i].classList.add("active");
    } else if (selectedValue === publicationFilterItems[i].dataset.publicationCategory) {
      publicationFilterItems[i].classList.add("active");
    } else {
      publicationFilterItems[i].classList.remove("active");
    }

  }

  refreshFadeAnimations();

}

if (publicationSelectItems.length > 0) {
  for (let i = 0; i < publicationSelectItems.length; i++) {
    publicationSelectItems[i].addEventListener("click", function () {

      let selectedValue = getPublicationFilterValue(this);
      publicationSelectValue.innerText = this.textContent.trim();
      elementToggleFunc(publicationSelect);
      publicationFilterFunc(selectedValue);

    });
  }
}

let lastClickedPublicationBtn = publicationFilterBtn[0];

if (publicationFilterBtn.length > 0) {
  for (let i = 0; i < publicationFilterBtn.length; i++) {

    publicationFilterBtn[i].addEventListener("click", function () {

      let selectedValue = getPublicationFilterValue(this);
      publicationSelectValue.innerText = this.textContent.trim();
      publicationFilterFunc(selectedValue);

      lastClickedPublicationBtn.classList.remove("active");
      this.classList.add("active");
      lastClickedPublicationBtn = this;

    });

  }
}
