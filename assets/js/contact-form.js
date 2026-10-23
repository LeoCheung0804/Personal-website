'use strict';

// Initialize reCAPTCHA site key for the contact form.
window.recaptchaSiteKey = '6Lc8CRYsAAAAALLR-ZPucEIMyn5hXZrEmZyHKovp';

// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");
let formSubmitting = false;

function syncFormButton() {
  formBtn.disabled = formSubmitting || !form.checkValidity();
  formBtn.setAttribute("aria-busy", String(formSubmitting));
  const label = formBtn.querySelector("span");
  label.dataset.i18n = formSubmitting ? "contact.sending" : "contact.sendMessage";
  label.textContent = getTranslation(label.dataset.i18n);
}

// Handle form submission with Formspree and reCAPTCHA
if (form && formBtn) {
  formInputs.forEach(input => input.addEventListener("input", syncFormButton));
  syncFormButton();

  form.addEventListener("submit", async function(e) {
    e.preventDefault();
    if (formSubmitting || !form.checkValidity()) return;
    
    const formData = new FormData(form);
    const formStatus = document.getElementById('form-status');
    const formMessage = document.getElementById('form-message');
    
    // Disable button during submission
    formSubmitting = true;
    syncFormButton();
    
    try {
      // Get reCAPTCHA token (v3)
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
    } finally {
      formSubmitting = false;
      syncFormButton();
    }
  });
}
