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

// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }



// motion helpers
function applyRandomFade() {
  const fadeItems = document.querySelectorAll('.fade-seed');

  fadeItems.forEach((item) => {
    const delay = 0.1 + Math.random() * 0.5;
    item.style.setProperty('--fade-delay', `${delay.toFixed(2)}s`);
    item.classList.add('fade-ready');
  });
}

function refreshFadeAnimations() {
  const fadeItems = document.querySelectorAll('.fade-seed.fade-ready');

  fadeItems.forEach((item) => {
    item.classList.remove('fade-ready');
    void item.offsetWidth;
    item.classList.add('fade-ready');
  });
}

function initMagneticButtons() {
  const magneticTargets = document.querySelectorAll('[data-magnetic]');

  magneticTargets.forEach((target) => {
    const strength = parseFloat(target.dataset.magneticStrength || '0.25');
    let rafId;

    target.addEventListener('mousemove', (event) => {
      const rect = target.getBoundingClientRect();
      const relX = event.clientX - (rect.left + rect.width / 2);
      const relY = event.clientY - (rect.top + rect.height / 2);
      const moveX = (relX / rect.width) * (strength * 60);
      const moveY = (relY / rect.height) * (strength * 60);

      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        target.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
      });
    });

    target.addEventListener('mouseleave', () => {
      cancelAnimationFrame(rafId);
      target.style.transform = 'translate3d(0, 0, 0)';
    });
  });
}

function initTiltCards() {
  if (window.VanillaTilt && typeof window.VanillaTilt.init === 'function') {
    VanillaTilt.init(document.querySelectorAll('.tilt-card'), {
      max: 8,
      speed: 500,
      glare: true,
      "max-glare": 0.15,
      scale: 1.02,
      reverse: true
    });
  }
}



// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
if (sidebarBtn) {
  sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });
}



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



// custom select variables
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

      let selectedValue = this.innerText.toLowerCase();
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

      let selectedValue = this.innerText.toLowerCase();
      selectValue.innerText = this.innerText;
      filterFunc(selectedValue);

      lastClickedBtn.classList.remove("active");
      this.classList.add("active");
      lastClickedBtn = this;

    });

  }
}



// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
if (formInputs.length > 0) {
  for (let i = 0; i < formInputs.length; i++) {
    formInputs[i].addEventListener("input", function () {

      // check form validation
      if (form.checkValidity()) {
        formBtn.removeAttribute("disabled");
      } else {
        formBtn.setAttribute("disabled", "");
      }

    });
  }
}

// Handle form submission with Formspree and reCAPTCHA
if (form) {
  form.addEventListener("submit", async function(e) {
    e.preventDefault();
    
    const formData = new FormData(form);
    const formStatus = document.getElementById('form-status');
    const formMessage = document.getElementById('form-message');
    
    // Disable button during submission
    formBtn.setAttribute("disabled", "");
    formBtn.querySelector("span").textContent = "Sending...";
    
    try {
      // Get reCAPTCHA token (v3)
      // Note: Replace 'YOUR_RECAPTCHA_SITE_KEY' with your actual site key
      if (typeof grecaptcha !== 'undefined' && window.recaptchaSiteKey) {
        const token = await grecaptcha.execute(window.recaptchaSiteKey, {action: 'submit'});
        document.getElementById('recaptchaResponse').value = token;
        formData.set('g-recaptcha-response', token);
      }
      
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        formStatus.style.display = 'block';
        formMessage.textContent = 'Thanks for your message! I will get back to you soon.';
        formMessage.style.color = 'var(--orange-yellow-crayola)';
        form.reset();
        formBtn.querySelector("span").textContent = "Send Message";
        
        // Track form submission in Google Analytics
        if (typeof trackFormSubmission === 'function') {
          trackFormSubmission();
        }
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      formStatus.style.display = 'block';
      formMessage.textContent = 'Oops! There was a problem submitting your form. Please try again.';
      formMessage.style.color = 'var(--bittersweet-shimmer)';
      formBtn.removeAttribute("disabled");
      formBtn.querySelector("span").textContent = "Send Message";
    }
  });
}




// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {

    // Don't run this logic on the blog post page
    if (document.querySelector('.blog-post-full')) {
      return;
    }

    const targetPage = this.dataset.pageTarget || (this.innerText.toLowerCase() === 'projects' ? 'portfolio' : this.innerText.toLowerCase());

    for (let i = 0; i < pages.length; i++) {
      if (targetPage === pages[i].dataset.page) {
        pages[i].classList.add("active");
        navigationLinks[i].classList.add("active");
        window.scrollTo(0, 0);
        
        // Track page view in Google Analytics
        if (typeof gtag === 'function') {
          gtag('config', 'G-LEBDJN7H6D', {
            'page_title': this.innerHTML,
            'page_path': '/#' + pages[i].dataset.page
          });
        }
      } else {
        pages[i].classList.remove("active");
        navigationLinks[i].classList.remove("active");
      }
    }

  });
}

// add hash-based page activation on page load, and ensure Portfolio remains active
window.addEventListener("DOMContentLoaded", () => {
  const hash = window.location.hash.substring(1).toLowerCase();
  if (hash) {
    for (let i = 0; i < pages.length; i++) {
      if (pages[i].dataset.page === hash) {
        pages[i].classList.add("active");
        navigationLinks[i].classList.add("active");
        window.scrollTo(0, 0);
      } else {
        pages[i].classList.remove("active");
        navigationLinks[i].classList.remove("active");
      }
    }
  } 
});

// Track project link clicks
const projectLinks = document.querySelectorAll('.project-item a');
projectLinks.forEach(link => {
  link.addEventListener('click', function() {
    const projectTitle = this.querySelector('.project-title');
    if (projectTitle && typeof trackProjectView === 'function') {
      trackProjectView(projectTitle.textContent);
    }
  });
});

// Initialize reCAPTCHA site key (replace with your actual key)
window.recaptchaSiteKey = '6Lc8CRYsAAAAALLR-ZPucEIMyn5hXZrEmZyHKovp';

// kick off interactions after DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  applyRandomFade();
  initMagneticButtons();
  initTiltCards();
  filterFunc('all');
});

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


// --- Dynamic Blog Loading ---
document.addEventListener('DOMContentLoaded', async () => {
  const blogList = document.getElementById('dynamic-blog-list');
  if (!blogList) return;

  try {
    const fetchUrl = `./assets/data/posts.json?t=${Date.now()}`;
    const response = await fetch(fetchUrl);
    if (!response.ok) throw new Error('Network response was not ok');
    const posts = await response.json();

    blogList.innerHTML = ''; // Clear layout if any

    posts.forEach(post => {
      const dateStr = post.date ? new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : '';
      
      const li = document.createElement('li');
      li.className = 'blog-post-item tilt-card fade-seed';
      
      li.innerHTML = `
        <a href="blog-post.html?post=${post.filename}" class="magnetic" data-magnetic>
          ${post.image ? `<figure class="blog-banner-box"><img src="${post.image}" alt="${post.title || post.filename}" loading="lazy"></figure>` : ''}
          <div class="blog-content">
            <div class="blog-meta">
              ${post.category ? `<p class="blog-category">${post.category}</p><span class="dot"></span>` : ''}
              ${post.date ? `<time datetime="${post.date}">${dateStr}</time>` : ''}
            </div>
            <h3 class="h3 blog-item-title">${post.title || post.filename}</h3>
            <p class="blog-text">${post.summary || ''}</p>
          </div>
        </a>
      `;
      blogList.appendChild(li);
    });

  } catch (error) {
    console.error('Error loading blog posts:', error);
    blogList.innerHTML = '<li><p>Failed to load posts.</p></li>';
  }
});
