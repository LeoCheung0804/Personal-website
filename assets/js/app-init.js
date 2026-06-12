'use strict';

window.addEventListener('DOMContentLoaded', () => {
  applyTranslations(currentLanguage);
  updateLanguageButton();
  syncSelectLabels();
});

// kick off interactions after DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  applyRandomFade();
  initMagneticButtons();
  initTiltCards();
  filterFunc('all');
});

// Language Toggle logic
const langBtn = document.querySelector("[data-lang-btn]");

if (langBtn) {
  langBtn.addEventListener("click", function () {
    setLanguage(getNextLanguage());
  });
}


// --- Dynamic Blog Loading ---
document.addEventListener('DOMContentLoaded', async () => {
  const blogList = document.getElementById('dynamic-blog-list');
  if (!blogList) return;

  try {
    const fetchUrl = `./assets/data/posts.json?t=${Date.now()}`;
    const response = await fetch(fetchUrl);
    if (!response.ok) throw new Error('Network response was not ok');
    const posts = await response.json();

    loadedBlogPosts = posts;
    renderBlogPosts(loadedBlogPosts);

  } catch (error) {
    console.error('Error loading blog posts:', error);
    blogList.innerHTML = `<li><p>${getTranslation("blog.failed")}</p></li>`;
  }
});
