'use strict';

// Initialize reCAPTCHA site key for the contact form.
window.recaptchaSiteKey = '6Lc8CRYsAAAAALLR-ZPucEIMyn5hXZrEmZyHKovp';

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
    formBtn.querySelector("span").textContent = getTranslation("contact.sending");
    
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
        formMessage.textContent = getTranslation("contact.success");
        formMessage.style.color = 'var(--orange-yellow-crayola)';
        form.reset();
        formBtn.querySelector("span").textContent = getTranslation("contact.sendMessage");
        
        // Track form submission in Google Analytics
        if (typeof trackFormSubmission === 'function') {
          trackFormSubmission();
        }
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      formStatus.style.display = 'block';
      formMessage.textContent = getTranslation("contact.error");
      formMessage.style.color = 'var(--bittersweet-shimmer)';
      formBtn.removeAttribute("disabled");
      formBtn.querySelector("span").textContent = getTranslation("contact.sendMessage");
    }
  });
}
