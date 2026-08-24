/**
 * STACKLY ERP - CUSTOM LOGIN & ROLE ROUTING CONTROLLER
 * Zero native <select> elements, fully custom dropdown, keyboard accessibility, inline validation
 */

document.addEventListener('DOMContentLoaded', () => {
  initCustomRoleDropdown();
  initLoginForm();
  initDemoShortcuts();
});

let selectedRoleValue = '';

function initCustomRoleDropdown() {
  const dropdownTrigger = document.getElementById('role-dropdown-trigger');
  const dropdownMenu = document.getElementById('role-dropdown-menu');
  const roleText = document.getElementById('selected-role-text');
  const roleIcon = document.getElementById('selected-role-icon');
  const options = document.querySelectorAll('.role-dropdown-option');
  const roleError = document.getElementById('role-selection-error');

  if (!dropdownTrigger || !dropdownMenu) return;

  // Toggle Dropdown
  const toggleDropdown = () => {
    const isExpanded = dropdownTrigger.getAttribute('aria-expanded') === 'true';
    if (isExpanded) {
      closeDropdown();
    } else {
      openDropdown();
    }
  };

  const openDropdown = () => {
    dropdownTrigger.setAttribute('aria-expanded', 'true');
    dropdownMenu.classList.add('show');
    dropdownTrigger.classList.add('active');
  };

  const closeDropdown = () => {
    dropdownTrigger.setAttribute('aria-expanded', 'false');
    dropdownMenu.classList.remove('show');
    dropdownTrigger.classList.remove('active');
  };

  dropdownTrigger.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleDropdown();
  });

  // Select Option
  options.forEach(opt => {
    opt.addEventListener('click', (e) => {
      e.stopPropagation();
      const val = opt.getAttribute('data-value');
      const label = opt.querySelector('.role-option-title').textContent.trim();
      const icon = opt.getAttribute('data-icon') || 'badge';

      selectedRoleValue = val;
      roleText.textContent = label;
      roleText.classList.remove('placeholder-text');
      if (roleIcon) roleIcon.textContent = icon;

      // Update active state in menu
      options.forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');

      // Clear any previous error
      if (roleError) roleError.style.display = 'none';
      dropdownTrigger.classList.remove('input-error');

      closeDropdown();
    });
  });

  // Keyboard navigation
  dropdownTrigger.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
      e.preventDefault();
      openDropdown();
      const firstOpt = options[0];
      if (firstOpt) firstOpt.focus();
    } else if (e.key === 'Escape') {
      closeDropdown();
    }
  });

  // Outside click close
  document.addEventListener('click', (e) => {
    if (!dropdownTrigger.contains(e.target) && !dropdownMenu.contains(e.target)) {
      closeDropdown();
    }
  });
}

function isGmail(email) {
  return /^[a-zA-Z0-9._%+-]+@gmail\.com$/i.test(email);
}

function initLoginForm() {
  const form = document.getElementById('erp-login-form');
  const roleError = document.getElementById('role-selection-error');
  const emailError = document.getElementById('email-validation-error');
  const emailInput = document.getElementById('login-email');
  const passInput = document.getElementById('login-password');
  const dropdownTrigger = document.getElementById('role-dropdown-trigger');
  const submitBtn = document.getElementById('login-submit-btn');

  if (!form) return;

  // Real-time @gmail.com format feedback while typing
  if (emailInput) {
    emailInput.addEventListener('input', () => {
      const val = emailInput.value.trim();
      if (val.length > 0 && val.includes('@') && !isGmail(val)) {
        emailInput.style.borderColor = 'var(--danger)';
        if (emailError) emailError.style.display = 'flex';
      } else {
        emailInput.style.borderColor = 'var(--slate-300)';
        if (emailError) emailError.style.display = 'none';
      }
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = emailInput ? emailInput.value.trim() : '';
    const password = passInput ? passInput.value.trim() : '';

    // Check Email Provided
    if (!email) {
      if (typeof window.showToast === 'function') {
        window.showToast('warning', 'Email Required', 'Please enter your email address.');
      }
      if (emailInput) emailInput.focus();
      return;
    }

    // Check @gmail format requirement
    if (!isGmail(email)) {
      if (emailInput) emailInput.style.borderColor = 'var(--danger)';
      if (emailError) emailError.style.display = 'flex';
      if (typeof window.showToast === 'function') {
        window.showToast('warning', 'Gmail Format Required', 'Email must be in @gmail format (e.g. name@gmail.com).');
      }
      if (emailInput) emailInput.focus();
      return;
    } else {
      if (emailInput) emailInput.style.borderColor = 'var(--slate-300)';
      if (emailError) emailError.style.display = 'none';
    }

    // Check Password Provided
    if (!password) {
      if (typeof window.showToast === 'function') {
        window.showToast('warning', 'Password Required', 'Please enter your password.');
      }
      if (passInput) passInput.focus();
      return;
    }

    // Check Role Selection
    if (!selectedRoleValue) {
      if (roleError) {
        roleError.style.display = 'flex';
      }
      if (dropdownTrigger) {
        dropdownTrigger.classList.add('input-error');
      }
      if (typeof window.showToast === 'function') {
        window.showToast('warning', 'Role Selection Required', 'Please select either Administrator or Operations Manager to access the ERP platform.');
      }
      return;
    }

    // Store entered credentials identifier for dynamic dashboard avatar/profile
    sessionStorage.setItem('erp_user_identifier', email);
    sessionStorage.setItem('erp_user_role', selectedRoleValue);

    // Role is selected -> Process login
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <span class="material-symbols-outlined spin" style="animation: spinRadar 1s linear infinite;">sync</span>
      <span>Authenticating...</span>
    `;

    setTimeout(() => {
      if (selectedRoleValue === 'admin') {
        if (typeof window.showToast === 'function') {
          window.showToast('success', 'Authentication Successful', 'Routing to Administrator Control Center...');
        }
        setTimeout(() => {
          window.location.href = 'admin-dashboard.html';
        }, 600);
      } else if (selectedRoleValue === 'operations') {
        if (typeof window.showToast === 'function') {
          window.showToast('success', 'Authentication Successful', 'Routing to Operations Command Center...');
        }
        setTimeout(() => {
          window.location.href = 'operations-dashboard.html';
        }, 600);
      }
    }, 700);
  });
}

function initDemoShortcuts() {
  const btnDemoAdmin = document.getElementById('btn-demo-admin');
  const btnDemoOps = document.getElementById('btn-demo-ops');
  const emailInput = document.getElementById('login-email');
  const passInput = document.getElementById('login-password');

  if (btnDemoAdmin) {
    btnDemoAdmin.addEventListener('click', () => {
      if (emailInput) emailInput.value = 'admin.stackly@gmail.com';
      if (passInput) passInput.value = '••••••••••••';
      selectRoleProgrammatically('admin');
      if (typeof window.showToast === 'function') {
        window.showToast('info', 'Demo Credentials Loaded', 'Administrator role selected. Click Sign In or authenticate immediately.');
      }
    });
  }

  if (btnDemoOps) {
    btnDemoOps.addEventListener('click', () => {
      if (emailInput) emailInput.value = 'ops.stackly@gmail.com';
      if (passInput) passInput.value = '••••••••••••';
      selectRoleProgrammatically('operations');
      if (typeof window.showToast === 'function') {
        window.showToast('info', 'Demo Credentials Loaded', 'Operations Manager role selected. Click Sign In or authenticate immediately.');
      }
    });
  }
}

function selectRoleProgrammatically(role) {
  const opt = document.querySelector(`.role-dropdown-option[data-value="${role}"]`);
  if (opt) {
    opt.click();
  }
}
