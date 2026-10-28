'use strict';

// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");
const sidebarDetails = sidebar && sidebar.querySelector(".sidebar-info_more");
const desktopSidebarQuery = window.matchMedia("(min-width: 1180px)");
let sidebarDetailsHadFocus = false;

function updateSidebarButtonState(expanded) {
  if (!sidebarBtn) return;

  const labelKey = expanded ? "sidebar.hideContacts" : "sidebar.showContacts";
  const label = typeof getTranslation === "function" ? getTranslation(labelKey) : expanded ? "Hide Contacts" : "Show Contacts";
  const visibleLabelKey = expanded ? "sidebar.closeContacts" : "sidebar.contacts";
  const compactLabel = typeof getTranslation === "function" ? getTranslation(visibleLabelKey) : expanded ? "Close" : "Contact";
  const visibleLabel = sidebarBtn.querySelector("span");

  sidebarBtn.setAttribute("aria-expanded", String(expanded));
  sidebarBtn.setAttribute("aria-label", label);
  sidebarBtn.dataset.i18nAriaLabel = labelKey;

  if (visibleLabel) {
    visibleLabel.dataset.i18n = visibleLabelKey;
    visibleLabel.textContent = compactLabel;
  }
}

function setSidebarExpanded(expanded) {
  if (!sidebar || !sidebarBtn || !sidebarDetails) return;
  sidebar.classList.toggle("active", expanded);
  syncSidebarVisibility();
}

function syncSidebarVisibility() {
  if (!sidebar || !sidebarDetails) return;
  const expanded = desktopSidebarQuery.matches || sidebar.classList.contains("active");
  // Update layout, keyboard access, and announced state together, without a height timer.
  if (!expanded && (sidebarDetails.contains(document.activeElement) || sidebarDetailsHadFocus)) {
    sidebarBtn.focus({ preventScroll: true });
  }
  sidebarDetails.hidden = !expanded;
  updateSidebarButtonState(expanded);
}

// sidebar toggle functionality for mobile
if (sidebar && sidebarBtn) {
  if (sidebarDetails) {
    if (!sidebarDetails.id) sidebarDetails.id = "sidebar-contact-details";
    sidebarBtn.setAttribute("aria-controls", sidebarDetails.id);
  }

  syncSidebarVisibility();
  // A breakpoint can hide the focused link before the media-query event runs.
  document.addEventListener("focusin", (event) => {
    if (event.target !== document.body) {
      sidebarDetailsHadFocus = sidebarDetails?.contains(event.target) || false;
    }
  });
  document.addEventListener("pointerdown", (event) => {
    if (!sidebarDetails?.contains(event.target)) sidebarDetailsHadFocus = false;
  });
  sidebarBtn.addEventListener("click", function () {
    setSidebarExpanded(!sidebar.classList.contains("active"));
  });

  sidebar.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || desktopSidebarQuery.matches || !sidebar.classList.contains("active")) return;
    event.preventDefault();
    sidebarBtn.focus({ preventScroll: true });
    setSidebarExpanded(false);
  });
  desktopSidebarQuery.addEventListener("change", syncSidebarVisibility);
  window.addEventListener("site-language-change", syncSidebarVisibility);
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
  const selectedRadio = sequence.querySelector('input[type="radio"]:checked');
  const selectedPhoto = selectedRadio?.id.match(/-(\d+)$/)?.[1];

  sequence.querySelectorAll(".photo-sequence__stage [data-photo]").forEach((media) => {
    const isSelected = media.dataset.photo === selectedPhoto;
    media.inert = !isSelected;
    media.setAttribute("aria-hidden", String(!isSelected));

    if (media.tagName === "IFRAME") {
      media.tabIndex = isSelected ? 0 : -1;
      // An inert, transparent player can still play audio. Unload inactive
      // players, retaining their URL for the next deliberate selection.
      const source = media.getAttribute("src");
      if (!isSelected && source) {
        media.dataset.src = source;
        media.removeAttribute("src");
      }
    }
  });

  thumbnails.forEach((thumbnail) => {
    const radioId = thumbnail.getAttribute("for");
    const radio = radioId && document.getElementById(radioId);
    const isSelected = Boolean(radio && radio.checked);
    thumbnail.setAttribute("aria-pressed", String(isSelected));
    thumbnail.tabIndex = isSelected ? 0 : -1;
  });

  const position = sequence.querySelector(".photo-sequence__position");
  if (position) {
    const current = Math.max(1, [...thumbnails].findIndex((thumbnail) => thumbnail.getAttribute("for") === selectedRadio?.id) + 1);
    const total = thumbnails.length;
    const template = typeof getTranslation === "function" ? getTranslation("gallery.position") : "Item {current} of {total}";
    const label = (template === "gallery.position" ? "Item {current} of {total}" : template)
      .replace("{current}", String(current)).replace("{total}", String(total));
    position.textContent = `${String(current).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
    position.setAttribute("aria-label", label);
  }
}

function initPhotoSequenceControls() {
  const sequences = document.querySelectorAll(".photo-sequence");

  sequences.forEach((sequence) => {
    if (sequence.dataset.photoControlsReady === "true") return;
    sequence.dataset.photoControlsReady = "true";
    const thumbnailGroup = sequence.querySelector(".photo-sequence__thumbs");
    const thumbnails = sequence.querySelectorAll(".photo-sequence__thumb");
    const position = document.createElement("output");
    position.className = "photo-sequence__position";
    position.setAttribute("role", "status");
    position.setAttribute("aria-live", "polite");
    position.setAttribute("aria-atomic", "true");
    sequence.appendChild(position);

    if (thumbnailGroup) {
      thumbnailGroup.setAttribute("role", "group");
      thumbnailGroup.setAttribute(
        "aria-label",
        sequence.getAttribute("aria-label") || "Project gallery thumbnails"
      );
    }

    thumbnails.forEach((thumbnail, index) => {
      const radioId = thumbnail.getAttribute("for");
      const radio = radioId && document.getElementById(radioId);

      thumbnail.setAttribute("role", "button");
      thumbnail.tabIndex = 0;

      if (!radio) return;

      radio.tabIndex = -1;
      radio.setAttribute("aria-hidden", "true");

      thumbnail.addEventListener("keydown", (event) => {
        const lastIndex = thumbnails.length - 1;
        const targetIndex = {
          ArrowLeft: (index + lastIndex) % thumbnails.length,
          ArrowRight: (index + 1) % thumbnails.length,
          Home: 0,
          End: lastIndex
        }[event.key];
        const isActivation = event.key === "Enter" || event.key === " " || event.key === "Spacebar";
        if (targetIndex === undefined && !isActivation) return;
        event.preventDefault();
        const targetThumbnail = targetIndex === undefined ? thumbnail : thumbnails[targetIndex];
        const targetRadio = document.getElementById(targetThumbnail.getAttribute("for"));
        if (!targetRadio) return;
        targetRadio.click();
        hydratePhotoSequenceMedia(sequence, targetRadio);
        syncPhotoSequenceState(sequence);
        targetThumbnail.focus({ preventScroll: true });
        targetThumbnail.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "auto" });
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

window.addEventListener("site-language-change", () => {
  document.querySelectorAll(".photo-sequence").forEach(syncPhotoSequenceState);
});
