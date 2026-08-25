/**
 * STACKLY ERP - ENTERPRISE SIGNUP CONTROLLER
 * Handles custom non-native role dropdown, registration validation, and seamless login routing
 */

document.addEventListener('DOMContentLoaded', () => {
  initSignupRoleDropdown();
  initSignupForm();
});

let selectedSignupRole = '';

function initSignupRoleDropdown() {
  const triggerBtn = document.getElementById('role-dropdown-trigger');
  const menu = document.getElementById('role-dropdown-menu');
  const options = document.querySelectorAll('.role-dropdown-option');
  const selectedText = document.getElementById('selected-role-text');
  const selectedIcon = document.getElementById('selected-role-icon');
  const roleError = document.getElementById('role-selection-error');

  if (!triggerBtn || !menu) return;

  function toggleDropdown(open) {
    const isOpen = open !== undefined ? open : !menu.classList.contains('show');
    if (isOpen) {
      menu.classList.add('show');
      triggerBtn.classList.add('active');
      triggerBtn.setAttribute('aria-expanded', 'true');
    } else {
      menu.classList.remove('show');
      triggerBtn.classList.remove('active');
      triggerBtn.setAttribute('aria-expanded', 'false');
    }
  }

  triggerBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleDropdown();
  });

  options.forEach(option => {
    option.addEventListener('click', () => {
      const val = option.getAttribute('data-value');
      const icon = option.getAttribute('data-icon');
      const title = option.querySelector('.role-option-title').textContent;

      selectedSignupRole = val;
      selectedText.textContent = title;
      selectedText.classList.remove('placeholder-text');
      selectedText.style.fontWeight = '600';
      selectedText.style.color = 'var(--slate-900)';
      selectedIcon.textContent = icon;

      options.forEach(opt => opt.classList.remove('selected'));
      option.classList.add('selected');

      if (roleError) roleError.style.display = 'none';
      triggerBtn.classList.remove('input-error');

      toggleDropdown(false);
    });
  });

  document.addEventListener('click', (e) => {
    if (!triggerBtn.contains(e.target) && !menu.contains(e.target)) {
      toggleDropdown(false);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('show')) {
      toggleDropdown(false);
      triggerBtn.focus();
    }
  });
}

function initSignupForm() {
  const form = document.getElementById('erp-signup-form');
  const submitBtn = document.getElementById('signup-submit-btn');

  if (!form) return;

  const nameInput = document.getElementById('signup-name');
  const emailInput = document.getElementById('signup-email');
  const companyInput = document.getElementById('signup-company');
  const passInput = document.getElementById('signup-password');
  const confirmPassInput = document.getElementById('signup-confirm-password');

  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const companyError = document.getElementById('company-error');
  const roleError = document.getElementById('role-selection-error');
  const passError = document.getElementById('password-error');
  const confirmPassError = document.getElementById('confirm-password-error');
  const triggerBtn = document.getElementById('role-dropdown-trigger');

  // Attach live input feedback
  [
    { input: nameInput, err: nameError },
    { input: emailInput, err: emailError },
    { input: companyInput, err: companyError },
    { input: passInput, err: passError },
    { input: confirmPassInput, err: confirmPassError }
  ].forEach(item => {
    if (item.input) {
      item.input.addEventListener('input', () => {
        if (item.input.value.trim()) {
          item.input.style.borderColor = 'var(--slate-300)';
          if (item.err) item.err.style.display = 'none';
        }
      });
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Reset error states
    [nameError, emailError, companyError, roleError, passError, confirmPassError].forEach(el => {
      if (el) el.style.display = 'none';
    });
    [nameInput, emailInput, companyInput, passInput, confirmPassInput].forEach(inp => {
      if (inp) inp.style.borderColor = 'var(--slate-300)';
    });

    let isValid = true;

    // Validate Name
    if (!nameInput.value.trim()) {
      nameInput.style.borderColor = 'var(--danger)';
      if (nameError) nameError.style.display = 'flex';
      isValid = false;
    }

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
      emailInput.style.borderColor = 'var(--danger)';
      if (emailError) emailError.style.display = 'flex';
      isValid = false;
    }

    // Validate Company
    if (!companyInput.value.trim()) {
      companyInput.style.borderColor = 'var(--danger)';
      if (companyError) companyError.style.display = 'flex';
      isValid = false;
    }

    // Validate Role
    if (!selectedSignupRole) {
      if (roleError) roleError.style.display = 'flex';
      if (triggerBtn) triggerBtn.classList.add('input-error');
      isValid = false;
    }

    // Validate Password
    if (!passInput.value || passInput.value.length < 8) {
      passInput.style.borderColor = 'var(--danger)';
      if (passError) passError.style.display = 'flex';
      isValid = false;
    }

    // Validate Confirm Password
    if (!confirmPassInput.value || passInput.value !== confirmPassInput.value) {
      confirmPassInput.style.borderColor = 'var(--danger)';
      if (confirmPassError) confirmPassError.style.display = 'flex';
      isValid = false;
    }

    if (!isValid) {
      showToast('warning', 'Validation Incomplete', 'Please review the highlighted fields to proceed.');
      return;
    }

    // Submission Success Feedback & Redirection
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <span class="material-symbols-outlined" style="animation: spinRadar 1s linear infinite;">sync</span>
      <span>Activating Enterprise Profile...</span>
    `;

    showToast('success', 'Account Provisioned Successfully', `Welcome ${nameInput.value.trim()}! Redirecting to Sign In portal...`, 3000);

    setTimeout(() => {
      window.location.href = 'login.html';
    }, 1200);
  });
}
