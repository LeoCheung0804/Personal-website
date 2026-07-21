'use strict';

// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");
const sidebarDetails = sidebar && sidebar.querySelector(".sidebar-info_more");
let sidebarHeightTimer;

function updateSidebarButtonState(expanded) {
  if (!sidebarBtn) return;

  const labelKey = expanded ? "sidebar.hideContacts" : "sidebar.showContacts";
  const label = typeof getTranslation === "function" ? getTranslation(labelKey) : expanded ? "Hide Contacts" : "Show Contacts";
  const visibleLabel = sidebarBtn.querySelector("span");

  sidebarBtn.setAttribute("aria-expanded", String(expanded));
  sidebarBtn.setAttribute("aria-label", label);
  sidebarBtn.dataset.i18nAriaLabel = labelKey;

  if (visibleLabel) {
    visibleLabel.dataset.i18n = labelKey;
    visibleLabel.textContent = label;
  }
}

function setSidebarExpanded(expanded) {
  if (!sidebar || !sidebarBtn) return;

  window.clearTimeout(sidebarHeightTimer);
  const startHeight = sidebar.getBoundingClientRect().height;
  sidebar.style.maxHeight = `${startHeight}px`;
  updateSidebarButtonState(expanded);

  if (expanded) {
    sidebar.classList.add("active");

    const expandedHeight = sidebar.scrollHeight;
    sidebar.style.setProperty("--sidebar-expanded-height", `${expandedHeight}px`);
    void sidebar.offsetHeight;

    requestAnimationFrame(() => {
      if (sidebar.classList.contains("active")) {
        sidebar.style.maxHeight = `${sidebar.scrollHeight}px`;
      }
    });

    sidebarHeightTimer = window.setTimeout(() => {
      if (sidebar.classList.contains("active")) {
        sidebar.style.maxHeight = "none";
      }
    }, 600);
  } else {
    sidebar.style.setProperty("--sidebar-expanded-height", `${sidebar.scrollHeight}px`);
    void sidebar.offsetHeight;
    sidebar.classList.remove("active");

    requestAnimationFrame(() => {
      if (!sidebar.classList.contains("active")) {
        sidebar.style.removeProperty("max-height");
      }
    });
  }
}

// sidebar toggle functionality for mobile
if (sidebar && sidebarBtn) {
  if (sidebarDetails) {
    if (!sidebarDetails.id) sidebarDetails.id = "sidebar-contact-details";
    sidebarBtn.setAttribute("aria-controls", sidebarDetails.id);
  }

  updateSidebarButtonState(sidebar.classList.contains("active"));
  sidebarBtn.addEventListener("click", function () {
    setSidebarExpanded(!sidebar.classList.contains("active"));
  });

  sidebar.addEventListener("transitionend", (event) => {
    if (event.target !== sidebar || event.propertyName !== "max-height") return;

    if (sidebar.classList.contains("active")) {
      window.clearTimeout(sidebarHeightTimer);
      sidebar.style.maxHeight = "none";
    }
  });

  window.addEventListener("resize", () => {
    if (!sidebar.classList.contains("active")) return;

    sidebar.style.setProperty("--sidebar-expanded-height", `${sidebar.scrollHeight}px`);
    if (sidebar.style.maxHeight !== "none") {
      sidebar.style.maxHeight = `${sidebar.scrollHeight}px`;
    }
  });

  window.addEventListener("site-language-change", () => {
    updateSidebarButtonState(sidebar.classList.contains("active"));
  });
}


// project photo sequence keyboard and pressed-state support
function hydratePhotoSequenceMedia(sequence, radio) {
  if (!radio) return;

  const photoNumber = radio.id.match(/-(\d+)$/)?.[1];
  if (!photoNumber) return;

  const media = sequence.querySelector(`.photo-sequence__stage [data-photo="${photoNumber}"]`);
  if (!media || !media.dataset.src) return;

  if (media.dataset.srcset) media.setAttribute("srcset", media.dataset.srcset);
  if (media.dataset.sizes) media.setAttribute("sizes", media.dataset.sizes);
  media.setAttribute("src", media.dataset.src);
  delete media.dataset.src;
  delete media.dataset.srcset;
  delete media.dataset.sizes;
}

function syncPhotoSequenceState(sequence) {
  const thumbnails = sequence.querySelectorAll(".photo-sequence__thumb");

  thumbnails.forEach((thumbnail) => {
    const radioId = thumbnail.getAttribute("for");
    const radio = radioId && document.getElementById(radioId);
    thumbnail.setAttribute("aria-pressed", String(Boolean(radio && radio.checked)));
  });
}

function initPhotoSequenceControls() {
  const sequences = document.querySelectorAll(".photo-sequence");

  sequences.forEach((sequence) => {
    const thumbnailGroup = sequence.querySelector(".photo-sequence__thumbs");
    const thumbnails = sequence.querySelectorAll(".photo-sequence__thumb");

    if (thumbnailGroup) {
      thumbnailGroup.setAttribute("role", "group");
      thumbnailGroup.setAttribute(
        "aria-label",
        sequence.getAttribute("aria-label") || "Project gallery thumbnails"
      );
    }

    thumbnails.forEach((thumbnail) => {
      const radioId = thumbnail.getAttribute("for");
      const radio = radioId && document.getElementById(radioId);

      thumbnail.setAttribute("role", "button");
      thumbnail.tabIndex = 0;

      if (!radio) return;

      radio.tabIndex = -1;
      radio.setAttribute("aria-hidden", "true");

      thumbnail.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " " && event.key !== "Spacebar") return;

        event.preventDefault();
        radio.click();
        syncPhotoSequenceState(sequence);
      });

      radio.addEventListener("change", () => {
        hydratePhotoSequenceMedia(sequence, radio);
        syncPhotoSequenceState(sequence);
      });
    });

    hydratePhotoSequenceMedia(sequence, sequence.querySelector('input[type="radio"]:checked'));
    syncPhotoSequenceState(sequence);
  });
}

initPhotoSequenceControls();



// testimonials variables
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

// modal toggle function
const testimonialsModalFunc = function () {
  modalContainer.classList.toggle("active");
  overlay.classList.toggle("active");
}

// add click event to all modal items
if (testimonialsItem.length > 0) {
  for (let i = 0; i < testimonialsItem.length; i++) {

    testimonialsItem[i].addEventListener("click", function () {

      modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
      modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
      modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
      modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;

      testimonialsModalFunc();

    });

  }
}

// add click event to modal close button
if (modalCloseBtn) {
  modalCloseBtn.addEventListener("click", testimonialsModalFunc);
}
if (overlay) {
  overlay.addEventListener("click", testimonialsModalFunc);
}
