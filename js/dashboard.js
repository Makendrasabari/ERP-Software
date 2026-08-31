/**
 * STACKLY ERP - DASHBOARD ENGINE & DATA VISUALIZATION CONTROLLER
 * High-performance Chart.js integration, module switching, sidebar controls, and table interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  initSidebar();
  initTopPopovers();
  initUserProfile();
  initModuleSwitching();
  initTableSearch();
  initActionHandlers();
  initKpiCardShuffleAndArrangeAnimation();
  initTwoColumnCenterSplitAnimations();
  initThreeCardCenterFirstSpreadAnimations();
  initStackedExtraSectionsAlternatingAnimation();
  
  // Detect current dashboard page and initialize charts
  if (document.getElementById('admin-dashboard-root')) {
    initAdminCharts();
  } else if (document.getElementById('ops-dashboard-root')) {
    initOpsCharts();
  }
});

/* ==========================================================================
   DYNAMIC USER PROFILE & INITIALS CONTROLLER
   ========================================================================== */
function initUserProfile() {
  const storedUser = sessionStorage.getItem('erp_user_identifier') || '';
  const storedRole = sessionStorage.getItem('erp_user_role') || '';
  const parsed = parseUserIdentifier(storedUser);

  const isAdmin = !!document.getElementById('admin-dashboard-root');
  const defaultName = isAdmin ? 'Marcus Vance' : 'Elena Rostova';
  const defaultInitials = isAdmin ? 'MV' : 'ER';
  const defaultEmail = isAdmin ? 'admin@stackly-erp.internal' : 'ops.lead@stackly-erp.internal';
  
  let dynamicRole = '';
  if (storedRole === 'admin' || (isAdmin && !storedRole)) {
    dynamicRole = 'Administrator';
  } else if (storedRole === 'operations' || (!isAdmin && !storedRole)) {
    dynamicRole = 'Operations Manager';
  } else {
    dynamicRole = storedRole.charAt(0).toUpperCase() + storedRole.slice(1);
  }

  const finalName = parsed ? parsed.name : defaultName;
  const finalInitials = parsed ? parsed.initials : defaultInitials;
  const finalEmail = storedUser && storedUser.includes('@') ? storedUser : (parsed ? `${parsed.name.toLowerCase().replace(/\s+/g, '.')}@stackly-erp.internal` : defaultEmail);

  // Update Topbar Profile
  const topbarUserName = document.getElementById('topbar-user-name');
  const topbarAvatarInitials = document.getElementById('topbar-user-avatar-initials');
  if (topbarUserName) topbarUserName.textContent = finalName;
  if (topbarAvatarInitials) topbarAvatarInitials.textContent = finalInitials;

  // Update Profile Popover
  const popoverAvatar = document.getElementById('popover-user-avatar-initials');
  const popoverName = document.getElementById('user-popover-name');
  const popoverEmail = document.getElementById('user-popover-email');
  const popoverRole = document.getElementById('user-popover-role');
  
  if (popoverAvatar) popoverAvatar.textContent = finalInitials;
  if (popoverName) popoverName.textContent = finalName;
  if (popoverEmail) popoverEmail.textContent = finalEmail;
  if (popoverRole) {
    popoverRole.textContent = dynamicRole;
    popoverRole.className = dynamicRole === 'Administrator' ? 'badge badge-primary' : 'badge badge-success';
  }

  // Update Overview Welcome Note Heading
  const welcomeHeadings = document.querySelectorAll('.welcome-heading');
  welcomeHeadings.forEach(heading => {
    heading.textContent = `Welcome back, ${finalName}`;
  });
}

function parseUserIdentifier(raw) {
  if (!raw) return null;
  let text = raw.trim();
  if (text.includes('@')) {
    text = text.split('@')[0].trim();
  }

  // Strip trailing numbers (e.g. mahendrasabari02 -> mahendrasabari, ramesh01 -> ramesh)
  const noTrailingDigits = text.replace(/\d+$/, '');
  if (noTrailingDigits.length > 0) {
    text = noTrailingDigits;
  }

  // Handle dot, underscore, dash, plus separated (e.g. mahendra.sabari, ramesh_gopal)
  if (/[\._\-\+]/.test(text)) {
    let parts = text.split(/[\._\-\+]+/).filter(Boolean);
    parts = parts.map(p => p.replace(/\d+/g, '')).filter(Boolean);
    if (parts.length > 0) {
      let name = parts.map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()).join(' ');
      let initials = parts.map(p => p.charAt(0).toUpperCase()).slice(0, 2).join('');
      return { name, initials };
    }
  }

  // Handle space separated (e.g. "Mahendra Sabari", "Ramesh Gopal")
  if (/\s+/.test(text)) {
    let parts = text.split(/\s+/).filter(Boolean);
    parts = parts.map(p => p.replace(/\d+/g, '')).filter(Boolean);
    if (parts.length > 0) {
      let name = parts.map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()).join(' ');
      let initials = parts.map(p => p.charAt(0).toUpperCase()).slice(0, 2).join('');
      return { name, initials };
    }
  }

  // Handle camelCase (e.g. RameshGopal, mahendraSabari)
  let words = text.replace(/([a-z])([A-Z])/g, '$1 $2').split(' ').filter(Boolean);
  if (words.length > 1) {
    let parts = words.map(w => w.replace(/\d+/g, '')).filter(Boolean);
    if (parts.length > 0) {
      let name = parts.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
      let initials = (parts[0].charAt(0) + (parts[1] ? parts[1].charAt(0) : '')).toUpperCase();
      return { name, initials };
    }
  }

  // Compound name detection for unseparated names (e.g. mahendrasabari, rameshgopal, sureshkumar)
  let lower = text.toLowerCase();
  const commonFirstNames = [
    'mahendra', 'ramesh', 'suresh', 'rajesh', 'dinesh', 'ganesh', 'naresh',
    'vijay', 'ajay', 'sanjay', 'anil', 'sunil', 'rahul', 'rohit', 'amit', 'arun',
    'marcus', 'elena', 'john', 'david', 'michael', 'robert', 'james', 'alex', 'mohammed'
  ];
  for (const fn of commonFirstNames) {
    if (lower.startsWith(fn) && lower.length > fn.length) {
      let p1 = fn.charAt(0).toUpperCase() + fn.slice(1);
      let p2 = lower.slice(fn.length);
      p2 = p2.charAt(0).toUpperCase() + p2.slice(1);
      return { name: p1 + ' ' + p2, initials: (p1.charAt(0) + p2.charAt(0)).toUpperCase() };
    }
  }

  const commonLastNames = [
    'sabari', 'gopal', 'kumar', 'sharma', 'patel', 'singh', 'vance', 'rostova', 'reddy', 'rao'
  ];
  for (const ln of commonLastNames) {
    if (lower.endsWith(ln) && lower.length > ln.length) {
      let p1 = lower.slice(0, lower.length - ln.length);
      p1 = p1.charAt(0).toUpperCase() + p1.slice(1);
      let p2 = ln.charAt(0).toUpperCase() + ln.slice(1);
      return { name: p1 + ' ' + p2, initials: (p1.charAt(0) + p2.charAt(0)).toUpperCase() };
    }
  }

  let name = text.charAt(0).toUpperCase() + text.slice(1);
  let initials = text.length >= 2 ? text.slice(0, 2).toUpperCase() : text.toUpperCase();
  return { name, initials };
}

/* ==========================================================================
   SIDEBAR & MOBILE DRAWER
   ========================================================================== */
function initSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const collapseBtn = document.getElementById('sidebar-collapse-btn');
  const sidebarToggle = document.getElementById('sidebar-toggle');
  const mobileToggle = document.getElementById('mobile-sidebar-toggle');

  const openMobileNav = () => {
    if (!sidebar) return;
    sidebar.classList.add('mobile-open');
    document.body.classList.add('mobile-sidebar-open');
  };

  const closeMobileNav = () => {
    if (!sidebar) return;
    sidebar.classList.remove('mobile-open');
    document.body.classList.remove('mobile-sidebar-open');
  };

  if (collapseBtn && sidebar) {
    collapseBtn.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
    });
  }

  // Sidebar header toggle / close button
  const closeBtn = document.getElementById('sidebar-close-btn');
  if (closeBtn && sidebar) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeMobileNav();
    });
  }

  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (window.innerWidth <= 992) {
        closeMobileNav();
      } else {
        sidebar.classList.toggle('collapsed');
      }
    });
  }

  // Mobile Topbar Hamburger Button
  if (mobileToggle && sidebar) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (sidebar.classList.contains('mobile-open')) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (window.innerWidth <= 992 && sidebar.classList.contains('mobile-open')) {
        if (!sidebar.contains(e.target) && !mobileToggle.contains(e.target)) {
          closeMobileNav();
        }
      }
    });
  }
}

/* ==========================================================================
   TOPBAR POPOVERS (USER PROFILE)
   ========================================================================== */
function initTopPopovers() {
  const userBtn = document.getElementById('topbar-user-btn');
  const userPopover = document.getElementById('user-popover');

  const closeAllPopovers = () => {
    if (userPopover) userPopover.classList.remove('show');
  };

  if (userBtn && userPopover) {
    userBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isShown = userPopover.classList.contains('show');
      closeAllPopovers();
      if (!isShown) userPopover.classList.add('show');
    });
  }

  document.addEventListener('click', closeAllPopovers);
}

/* ==========================================================================
   DYNAMIC MODULE SWITCHING & ACTIVE TOPBAR TITLE
   ========================================================================== */
function initModuleSwitching() {
  const navItems = document.querySelectorAll('.sidebar-nav-item[data-module]');
  const topbarHeading = document.getElementById('topbar-page-heading');
  const topbarIcon = document.getElementById('topbar-page-icon');

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const moduleId = item.getAttribute('data-module');
      const moduleTitle = item.querySelector('.sidebar-link-text')?.textContent.trim() || 'Overview';
      const iconSpan = item.querySelector('.material-symbols-outlined');
      const iconName = iconSpan ? iconSpan.textContent.trim() : 'dashboard';

      // 1. Update active nav item
      navItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      // 2. Update visible module view
      const targetView = document.getElementById(moduleId);
      if (targetView) {
        document.querySelectorAll('.module-view').forEach(v => v.classList.remove('active'));
        targetView.classList.add('active');
      }

      // 3. Update Topbar Active Page Title and Icon
      if (topbarHeading) {
        topbarHeading.textContent = moduleTitle;
      }
      if (topbarIcon) {
        topbarIcon.textContent = iconName;
      }

      // 4. Close mobile sidebar and restore body scroll if open
      const sidebar = document.querySelector('.sidebar');
      if (sidebar) {
        sidebar.classList.remove('mobile-open');
        document.body.classList.remove('mobile-sidebar-open');
      }

      // 5. Reset viewport scroll to top
      window.scrollTo({ top: 0, behavior: 'instant' });

      // Trigger resize for Chart.js canvases to recompute layout
      window.dispatchEvent(new Event('resize'));

      // Trigger card shuffle & arrange animation for 4-card KPI grid in newly opened module
      if (typeof window.triggerKpiShuffleAndArrange === 'function') {
        setTimeout(() => {
          window.triggerKpiShuffleAndArrange(moduleId);
        }, 50);
      }

      // Trigger 2-column center-to-separate animation for newly opened module
      if (typeof window.triggerTwoColumnSplitAnimations === 'function') {
        setTimeout(() => {
          window.triggerTwoColumnSplitAnimations(moduleId);
        }, 80);
      }

      // Trigger 3-card center-first spread animation for newly opened module
      if (typeof window.triggerThreeCardSpreadAnimations === 'function') {
        setTimeout(() => {
          window.triggerThreeCardSpreadAnimations(moduleId);
        }, 110);
      }

      // Trigger stacked alternating left/right entrance animation for newly opened module
      if (typeof window.triggerStackedAlternatingAnimations === 'function') {
        setTimeout(() => {
          window.triggerStackedAlternatingAnimations(moduleId);
        }, 140);
      }

      // Trigger sequential rising bar animation when Inventory module is opened
      if (moduleId === 'module-inventory' && window.inventoryCapacityChartInstance) {
        setTimeout(() => {
          window.inventoryCapacityChartInstance.reset();
          window.inventoryCapacityChartInstance.update();
        }, 120);
      }
    });
  });
}

/* ==========================================================================
   4-CARDS KPI SHUFFLE & ARRANGE ANIMATION (GSAP + SCROLLTRIGGER)
   Cards start in a shuffled/fanned cluster in center, then deal and arrange into slots
   ========================================================================== */
function initKpiCardShuffleAndArrangeAnimation() {
  if (typeof gsap === 'undefined') return;
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  function playShuffleAndArrange(cards) {
    if (!cards || cards.length === 0) return;

    const shuffleOffsets = [
      { x: 100, y: -8, rot: -4 },
      { x: 35, y: 6, rot: -1.5 },
      { x: -35, y: -6, rot: 1.5 },
      { x: -100, y: 8, rot: 4 }
    ];

    cards.forEach((card, i) => {
      const offset = shuffleOffsets[i] || { x: 0, y: 0, rot: 0 };
      gsap.fromTo(card,
        {
          opacity: 0,
          scale: 0.94,
          x: offset.x,
          y: 20 + offset.y,
          rotation: offset.rot
        },
        {
          opacity: 1,
          scale: 1,
          x: 0,
          y: 0,
          rotation: 0,
          duration: 0.85,
          delay: i * 0.08,
          ease: 'expo.out',
          clearProps: 'transform,opacity',
          overwrite: 'auto'
        }
      );
    });
  }

  const kpiGridList = Array.from(document.querySelectorAll('.kpi-grid'));

  kpiGridList.forEach(parent => {
    const cards = Array.from(parent.querySelectorAll('.kpi-card'));
    if (cards.length === 0) return;

    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.create({
        trigger: parent,
        start: 'top 92%',
        once: true,
        onEnter: () => {
          if (!parent.dataset.shuffled) {
            parent.dataset.shuffled = 'true';
            playShuffleAndArrange(cards);
          }
        }
      });
    }

    const activeModule = parent.closest('.module-view.active');
    if (activeModule && !parent.dataset.shuffled) {
      parent.dataset.shuffled = 'true';
      setTimeout(() => {
        playShuffleAndArrange(cards);
      }, 100);
    }
  });

  window.triggerKpiShuffleAndArrange = function(moduleId) {
    const activeModule = document.getElementById(moduleId);
    if (!activeModule) return;

    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
    }

    const targetKpiGrid = activeModule.querySelector('.kpi-grid');
    if (targetKpiGrid) {
      const cards = Array.from(targetKpiGrid.querySelectorAll('.kpi-card'));
      if (cards.length > 0) {
        playShuffleAndArrange(cards);
      }
    }
  };
}

/* ==========================================================================
   STACKED EXTRA SECTIONS ALTERNATING ENTRANCE (GSAP + SCROLLTRIGGER)
   Bottom Section (Shift Energy Sustainability) comes from Right first
   Top Section (OEE Tri-Factor Decomposition) comes from Left second
   ========================================================================== */
function initStackedExtraSectionsAlternatingAnimation() {
  if (typeof gsap === 'undefined') return;
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  function playStackedAlternatingEntrance(topSection, bottomSection) {
    if (!topSection || !bottomSection) return;

    const tl = gsap.timeline({
      defaults: { ease: 'expo.out' },
      onComplete: () => {
        gsap.set([topSection, bottomSection], { clearProps: 'transform,opacity' });
      }
    });

    // 1. Bottom section (Shift Energy Sustainability) comes from the RIGHT first at t = 0.0s
    tl.fromTo(bottomSection,
      {
        opacity: 0,
        scale: 0.96,
        x: 70,
        y: 15
      },
      {
        opacity: 1,
        scale: 1,
        x: 0,
        y: 0,
        duration: 0.82
      },
      0
    );

    // 2. Top section (OEE Tri-Factor Decomposition) comes from the LEFT second at t = 0.22s
    tl.fromTo(topSection,
      {
        opacity: 0,
        scale: 0.96,
        x: -70,
        y: 15
      },
      {
        opacity: 1,
        scale: 1,
        x: 0,
        y: 0,
        duration: 0.82
      },
      0.22
    );
  }

  // Find all modules with stacked .module-extra-section pairs
  const modulesWithPairs = [];

  document.querySelectorAll('.module-view').forEach(mod => {
    const extraSections = Array.from(mod.querySelectorAll(':scope > .module-extra-section'));
    if (extraSections.length >= 2) {
      const topSection = extraSections[0];
      const bottomSection = extraSections[1];
      modulesWithPairs.push({ mod, topSection, bottomSection });
    }
  });

  modulesWithPairs.forEach(({ mod, topSection, bottomSection }) => {
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.create({
        trigger: topSection,
        start: 'top 90%',
        once: true,
        onEnter: () => {
          if (!topSection.dataset.altAnimated) {
            topSection.dataset.altAnimated = 'true';
            bottomSection.dataset.altAnimated = 'true';
            playStackedAlternatingEntrance(topSection, bottomSection);
          }
        }
      });
    }

    if (mod.classList.contains('active') && !topSection.dataset.altAnimated) {
      const rect = topSection.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        topSection.dataset.altAnimated = 'true';
        bottomSection.dataset.altAnimated = 'true';
        setTimeout(() => {
          playStackedAlternatingEntrance(topSection, bottomSection);
        }, 150);
      }
    }
  });

  // Module switcher dispatcher
  window.triggerStackedAlternatingAnimations = function(moduleId) {
    const activeModule = document.getElementById(moduleId);
    if (!activeModule) return;

    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
    }

    modulesWithPairs.forEach(({ mod, topSection, bottomSection }) => {
      if (mod === activeModule) {
        playStackedAlternatingEntrance(topSection, bottomSection);
      }
    });
  };
}

/* ==========================================================================
   3-CARD SECTIONS CENTER-FIRST SPREAD ANIMATION (GSAP + SCROLLTRIGGER)
   Center card appears first -> Left & Right cards spread simultaneously to sides
   ========================================================================== */
function initThreeCardCenterFirstSpreadAnimations() {
  if (typeof gsap === 'undefined') return;
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  function playCenterFirstSpread(cards) {
    if (!cards || cards.length !== 3) return;
    const [leftCard, centerCard, rightCard] = cards;

    const tl = gsap.timeline({
      defaults: { ease: 'expo.out' },
      onComplete: () => {
        gsap.set([leftCard, centerCard, rightCard], { clearProps: 'transform,opacity' });
      }
    });

    // 1. Center card comes in first at t = 0.0s
    tl.fromTo(centerCard,
      {
        opacity: 0,
        scale: 0.92,
        y: 35,
        x: 0
      },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        x: 0,
        duration: 0.8
      },
      0
    );

    // 2. Left and Right cards come in simultaneously at their respective positions at t = 0.22s
    tl.fromTo(leftCard,
      {
        opacity: 0,
        scale: 0.93,
        x: -45,
        y: 25
      },
      {
        opacity: 1,
        scale: 1,
        x: 0,
        y: 0,
        duration: 0.8
      },
      0.22
    );

    tl.fromTo(rightCard,
      {
        opacity: 0,
        scale: 0.93,
        x: 45,
        y: 25
      },
      {
        opacity: 1,
        scale: 1,
        x: 0,
        y: 0,
        duration: 0.8
      },
      0.22
    );
  }

  // Find all 3-card grid containers throughout dashboard
  const threeCardContainers = [];

  document.querySelectorAll('div[style*="grid-template-columns"]').forEach(container => {
    const cards = Array.from(container.children).filter(el => el.nodeType === 1);
    if (cards.length === 3) {
      threeCardContainers.push({ container, cards });
    }
  });

  threeCardContainers.forEach(({ container, cards }) => {
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.create({
        trigger: container,
        start: 'top 88%',
        once: true,
        onEnter: () => {
          if (!container.dataset.centerSpreadAnimated) {
            container.dataset.centerSpreadAnimated = 'true';
            playCenterFirstSpread(cards);
          }
        }
      });
    }

    const activeModule = container.closest('.module-view.active');
    if (activeModule && !container.dataset.centerSpreadAnimated) {
      const rect = container.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        container.dataset.centerSpreadAnimated = 'true';
        setTimeout(() => {
          playCenterFirstSpread(cards);
        }, 120);
      }
    }
  });

  // Module switcher dispatcher
  window.triggerThreeCardSpreadAnimations = function(moduleId) {
    const activeModule = document.getElementById(moduleId);
    if (!activeModule) return;

    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
    }

    threeCardContainers.forEach(({ container, cards }) => {
      if (activeModule.contains(container)) {
        playCenterFirstSpread(cards);
      }
    });
  };
}

/* ==========================================================================
   2-COLUMN DUAL CARDS CENTER-TO-SEPARATE ANIMATION (GSAP + SCROLLTRIGGER)
   Left & Right sections start at center, then separate outward to their positions
   ========================================================================== */
function initTwoColumnCenterSplitAnimations() {
  if (typeof gsap === 'undefined') return;
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // Animates left & right cards starting together in center, then smoothly separating outward
  function playCenterSeparateAnimation(leftCard, rightCard) {
    if (!leftCard || !rightCard) return;

    // Left card comes from center-right; Right card comes from center-left
    gsap.fromTo(leftCard,
      {
        opacity: 0,
        scale: 0.94,
        x: 65,
        y: 25
      },
      {
        opacity: 1,
        scale: 1,
        x: 0,
        y: 0,
        duration: 0.85,
        ease: 'expo.out',
        clearProps: 'transform,opacity',
        overwrite: 'auto'
      }
    );

    gsap.fromTo(rightCard,
      {
        opacity: 0,
        scale: 0.94,
        x: -65,
        y: 25
      },
      {
        opacity: 1,
        scale: 1,
        x: 0,
        y: 0,
        duration: 0.85,
        ease: 'expo.out',
        clearProps: 'transform,opacity',
        overwrite: 'auto'
      }
    );
  }

  const twoColumnGrids = Array.from(document.querySelectorAll('.dashboard-grid-2, .dashboard-grid-equal'));

  twoColumnGrids.forEach(grid => {
    const children = Array.from(grid.children).filter(el => el.nodeType === 1);
    if (children.length !== 2) return;
    const [leftCard, rightCard] = children;

    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.create({
        trigger: grid,
        start: 'top 88%',
        once: true,
        onEnter: () => {
          if (!grid.dataset.splitAnimated) {
            grid.dataset.splitAnimated = 'true';
            playCenterSeparateAnimation(leftCard, rightCard);
          }
        }
      });
    }

    const activeModule = grid.closest('.module-view.active');
    if (activeModule && !grid.dataset.splitAnimated) {
      const rect = grid.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        grid.dataset.splitAnimated = 'true';
        setTimeout(() => {
          playCenterSeparateAnimation(leftCard, rightCard);
        }, 150);
      }
    }
  });

  // Module switcher helper: plays center-to-separate animation for newly visible module
  window.triggerTwoColumnSplitAnimations = function(moduleId) {
    const activeModule = document.getElementById(moduleId);
    if (!activeModule) return;

    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
    }

    const grids = activeModule.querySelectorAll('.dashboard-grid-2, .dashboard-grid-equal');
    grids.forEach(grid => {
      const children = Array.from(grid.children).filter(el => el.nodeType === 1);
      if (children.length === 2) {
        const [leftCard, rightCard] = children;
        playCenterSeparateAnimation(leftCard, rightCard);
      }
    });
  };
}

/* ==========================================================================
   4-CARDS KPI REVERSE-ORDER SHUFFLE & ARRANGE ANIMATION (GSAP + SCROLLTRIGGER)
   ========================================================================== */
function initNestedCardShuffleAnimations() {
  if (typeof gsap === 'undefined') return;
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // Smooth reverse-order shuffle & arrangement animation: 4 -> 3 -> 2 -> 1 -> proper order
  function playReverseShuffleAnimation(cards) {
    if (!cards || cards.length === 0) return;

    const total = cards.length;

    // Visual sequence: Card 4 starts -> Card 3 -> Card 2 -> Card 1 -> settle into final position
    gsap.fromTo(cards,
      {
        opacity: 0,
        scale: 0.93,
        y: 32,
        x: (index) => {
          if (total <= 1) return 0;
          const norm = (index - (total - 1) / 2);
          return norm * 26; // Dynamic horizontal fanning simulating card deck shuffle
        }
      },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        x: 0,
        duration: 0.78,
        ease: 'expo.out',
        stagger: {
          each: 0.13,
          from: 'end' // Reverse-order arrangement: 4 -> 3 -> 2 -> 1
        },
        clearProps: 'transform,opacity', // Locks cleanly into exact original CSS layout
        overwrite: 'auto'
      }
    );
  }

  // Find all 4-card KPI grids in Overview, Human Resources, Finance, Inventory, etc.
  const kpiGridList = Array.from(document.querySelectorAll('.kpi-grid'));

  // Attach ScrollTrigger and initial animation
  kpiGridList.forEach(parent => {
    const cards = Array.from(parent.querySelectorAll('.kpi-card'));
    if (cards.length === 0) return;

    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.create({
        trigger: parent,
        start: 'top 92%',
        once: true,
        onEnter: () => {
          if (!parent.dataset.shuffled) {
            parent.dataset.shuffled = 'true';
            playReverseShuffleAnimation(cards);
          }
        }
      });
    }

    // If active module on load, animate immediately
    const activeModule = parent.closest('.module-view.active');
    if (activeModule && !parent.dataset.shuffled) {
      parent.dataset.shuffled = 'true';
      setTimeout(() => {
        playReverseShuffleAnimation(cards);
      }, 100);
    }
  });

  // Module switcher dispatcher: runs reverse shuffle animation whenever user switches to a module
  window.triggerModuleShuffleAnimations = function(moduleId) {
    const activeModule = document.getElementById(moduleId);
    if (!activeModule) return;

    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
    }

    const targetKpiGrid = activeModule.querySelector('.kpi-grid');
    if (targetKpiGrid) {
      const cards = Array.from(targetKpiGrid.querySelectorAll('.kpi-card'));
      if (cards.length > 0) {
        playReverseShuffleAnimation(cards);
      }
    }
  };
}

/* ==========================================================================
   LIVE TABLE SEARCH
   ========================================================================== */
function initTableSearch() {
  const searchInputs = document.querySelectorAll('.table-search-input');
  searchInputs.forEach(input => {
    input.addEventListener('input', () => {
      const query = input.value.toLowerCase().trim();
      const tableCard = input.closest('.table-card');
      if (!tableCard) return;

      const rows = tableCard.querySelectorAll('.erp-table tbody tr');
      rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(query) ? '' : 'none';
      });
    });
  });
}

/* ==========================================================================
   ACTION HANDLERS & MODAL TRIGGERS
   ========================================================================== */
function initActionHandlers() {
  document.addEventListener('click', (e) => {
    // Action triggers routed to 404 page
    const actionBtn = e.target.closest('.btn-export-action, .date-selector-pill, .btn-po-approve, .btn-quick-reorder');
    if (actionBtn) {
      e.preventDefault();
      window.location.href = '404.html';
    }
  });
}

/* ==========================================================================
   ADMINISTRATOR DASHBOARD CHARTS (CHART.JS)
   ========================================================================== */
function initAdminCharts() {
  if (typeof Chart === 'undefined') return;

  // Chart defaults for enterprise theme
  Chart.defaults.font.family = "'Plus Jakarta Sans', sans-serif";
  Chart.defaults.font.size = 12;
  Chart.defaults.color = '#64748b';

  // 1. Overview: Revenue Multi-Series Line Chart
  const revCtx = document.getElementById('adminRevenueChart');
  if (revCtx) {
    const ctx = revCtx.getContext('2d');
    const grad1 = ctx.createLinearGradient(0, 0, 0, 300);
    grad1.addColorStop(0, 'rgba(255, 92, 1, 0.35)');
    grad1.addColorStop(1, 'rgba(255, 92, 1, 0.0)');

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            label: 'Actual Revenue ($M)',
            data: [1.8, 2.1, 2.4, 2.2, 2.9, 3.2, 3.8, 4.1, 4.4, 4.2, 4.8, 5.2],
            borderColor: '#ff5c01',
            backgroundColor: grad1,
            fill: true,
            tension: 0.4,
            borderWidth: 3,
            pointBackgroundColor: '#ff5c01',
            pointRadius: 4
          },
          {
            label: 'Target ($M)',
            data: [1.6, 1.9, 2.2, 2.5, 2.7, 3.0, 3.3, 3.6, 3.9, 4.1, 4.5, 4.9],
            borderColor: '#6366f1',
            borderDash: [5, 5],
            borderWidth: 2,
            fill: false,
            tension: 0.4,
            pointRadius: 0
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'top', align: 'end' } },
        scales: {
          y: { grid: { color: 'rgba(226, 232, 240, 0.6)' }, ticks: { callback: v => '$' + v + 'M' } },
          x: { grid: { display: false } }
        }
      }
    });
  }

  // 2. Overview: Business Performance Unit Chart
  const perfCtx = document.getElementById('adminPerformanceChart');
  if (perfCtx) {
    new Chart(perfCtx.getContext('2d'), {
      type: 'bar',
      data: {
        labels: ['North America', 'EMEA', 'APAC', 'LATAM'],
        datasets: [
          { label: 'Q1 Performance', data: [88, 76, 92, 64], backgroundColor: '#0f172a', borderRadius: 6 },
          { label: 'Q2 Performance', data: [94, 82, 98, 74], backgroundColor: '#ff5c01', borderRadius: 6 }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'top', align: 'end' } },
        scales: {
          y: { max: 100, ticks: { callback: v => v + '%' }, grid: { color: 'rgba(226, 232, 240, 0.6)' } },
          x: { grid: { display: false } }
        }
      }
    });
  }

  // 3. HR: Department Distribution Donut Chart
  const hrDeptCtx = document.getElementById('hrDeptChart');
  if (hrDeptCtx) {
    new Chart(hrDeptCtx.getContext('2d'), {
      type: 'doughnut',
      data: {
        labels: ['Engineering', 'Sales & CRM', 'Operations', 'Finance', 'Marketing', 'People Ops'],
        datasets: [{
          data: [420, 310, 260, 110, 100, 80],
          backgroundColor: ['#ff5c01', '#6366f1', '#10b981', '#f59e0b', '#0f172a', '#94a3b8'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: { legend: { position: 'right' } }
      }
    });
  }

  // 4. HR: Attendance & Performance Chart
  const hrPerfCtx = document.getElementById('hrPerformanceChart');
  if (hrPerfCtx) {
    new Chart(hrPerfCtx.getContext('2d'), {
      type: 'bar',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        datasets: [
          { label: 'Present', data: [1210, 1225, 1240, 1218, 1195], backgroundColor: '#10b981', borderRadius: 4 },
          { label: 'Remote / Field', data: [52, 40, 30, 48, 70], backgroundColor: '#6366f1', borderRadius: 4 }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { grid: { color: 'rgba(226, 232, 240, 0.6)' } },
          x: { grid: { display: false } }
        }
      }
    });
  }

  // 5. Finance: Gross vs Net Margin Area Chart
  const finCashCtx = document.getElementById('financeCashflowChart');
  if (finCashCtx) {
    const ctx = finCashCtx.getContext('2d');
    const gradG = ctx.createLinearGradient(0, 0, 0, 300);
    gradG.addColorStop(0, 'rgba(16, 185, 129, 0.35)');
    gradG.addColorStop(1, 'rgba(16, 185, 129, 0)');

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Q1', 'Q2', 'Q3', 'Q4', 'Q1 (26)', 'Q2 (26)'],
        datasets: [
          { label: 'Gross Margin ($M)', data: [4.2, 4.8, 5.4, 6.1, 6.8, 7.5], borderColor: '#10b981', backgroundColor: gradG, fill: true, tension: 0.4, borderWidth: 3 },
          { label: 'Net Profit ($M)', data: [1.8, 2.1, 2.6, 3.1, 3.6, 4.2], borderColor: '#ff5c01', borderWidth: 2, fill: false, tension: 0.4 }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { ticks: { callback: v => '$' + v + 'M' }, grid: { color: 'rgba(226, 232, 240, 0.6)' } },
          x: { grid: { display: false } }
        }
      }
    });
  }

  // 6. Finance: Income vs Expense Chart
  const finIncExpCtx = document.getElementById('financeIncomeExpenseChart');
  if (finIncExpCtx) {
    new Chart(finIncExpCtx.getContext('2d'), {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          { label: 'Total Revenue', data: [3.2, 3.5, 3.8, 4.1, 4.4, 4.9], backgroundColor: '#10b981', borderRadius: 6 },
          { label: 'Operating Costs', data: [1.8, 1.9, 2.1, 2.2, 2.3, 2.4], backgroundColor: '#ef4444', borderRadius: 6 }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { ticks: { callback: v => '$' + v + 'M' }, grid: { color: 'rgba(226, 232, 240, 0.6)' } },
          x: { grid: { display: false } }
        }
      }
    });
  }

  // 7. Inventory: Warehouse Capacity Chart with Sequential Rising Bar Animation
  const invCapCtx = document.getElementById('inventoryCapacityChart');
  if (invCapCtx) {
    let delayed = false;
    window.inventoryCapacityChartInstance = new Chart(invCapCtx.getContext('2d'), {
      type: 'bar',
      data: {
        labels: ['Warehouse East', 'Hub Central', 'Warehouse West', 'Euro Logistics Hub'],
        datasets: [
          { label: 'Utilized Capacity (%)', data: [84, 91, 68, 76], backgroundColor: '#ff5c01', borderRadius: 6 },
          { label: 'Buffer Reserve (%)', data: [16, 9, 32, 24], backgroundColor: '#cbd5e1', borderRadius: 6 }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 950,
          easing: 'easeOutQuart',
          onComplete: () => {
            delayed = true;
          },
          delay: (context) => {
            let delay = 0;
            // Sequential rising: Bar 1 (0ms) -> Bar 2 (320ms) -> Bar 3 (640ms) -> Bar 4 (960ms)
            if (context.type === 'data' && context.mode === 'default' && !delayed) {
              delay = context.dataIndex * 320;
            }
            return delay;
          }
        },
        scales: {
          x: { stacked: true, grid: { display: false } },
          y: { stacked: true, max: 100, ticks: { callback: v => v + '%' }, grid: { color: 'rgba(226, 232, 240, 0.6)' } }
        }
      }
    });

    // Viewport ScrollTrigger for sequential bar rising
    const invChartCard = invCapCtx.closest('.chart-card');
    if (invChartCard && typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.create({
        trigger: invChartCard,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          if (window.inventoryCapacityChartInstance) {
            delayed = false;
            window.inventoryCapacityChartInstance.reset();
            window.inventoryCapacityChartInstance.update();
          }
        }
      });
    }
  }

  // 8. Reports: Forecasting Trendline
  const repForecastCtx = document.getElementById('reportsForecastChart');
  if (repForecastCtx) {
    new Chart(repForecastCtx.getContext('2d'), {
      type: 'line',
      data: {
        labels: ['2023', '2024', '2025', '2026 (Est)', '2027 (AI Forecast)'],
        datasets: [
          { label: 'Enterprise Growth ($M)', data: [14.2, 22.8, 34.5, 48.2, 64.0], borderColor: '#ff5c01', borderWidth: 3, tension: 0.3, pointRadius: 5 }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { ticks: { callback: v => '$' + v + 'M' }, grid: { color: 'rgba(226, 232, 240, 0.6)' } },
          x: { grid: { display: false } }
        }
      }
    });
  }
}

/* ==========================================================================
   OPERATIONS MANAGER DASHBOARD CHARTS (CHART.JS)
   ========================================================================== */
function initOpsCharts() {
  if (typeof Chart === 'undefined') return;

  Chart.defaults.font.family = "'Plus Jakarta Sans', sans-serif";
  Chart.defaults.font.size = 12;
  Chart.defaults.color = '#64748b';

  // 1. Ops Overview: Daily Output Throughput
  const opsOutCtx = document.getElementById('opsOutputChart');
  if (opsOutCtx) {
    const ctx = opsOutCtx.getContext('2d');
    const gradO = ctx.createLinearGradient(0, 0, 0, 300);
    gradO.addColorStop(0, 'rgba(255, 92, 1, 0.3)');
    gradO.addColorStop(1, 'rgba(255, 92, 1, 0)');

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'],
        datasets: [
          { label: 'Actual Units/Hr', data: [420, 580, 710, 690, 780, 810, 740, 620], borderColor: '#ff5c01', backgroundColor: gradO, fill: true, tension: 0.4, borderWidth: 3 },
          { label: 'Target Quota', data: [500, 500, 700, 700, 750, 750, 700, 600], borderColor: '#0f172a', borderDash: [4, 4], borderWidth: 2, tension: 0, fill: false }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { grid: { color: 'rgba(226, 232, 240, 0.6)' } },
          x: { grid: { display: false } }
        }
      }
    });
  }

  // 2. Ops Facility Comparison Bar Chart
  const facCtx = document.getElementById('opsFacilityChart');
  if (facCtx) {
    new Chart(facCtx.getContext('2d'), {
      type: 'bar',
      data: {
        labels: ['Assembly Line 1', 'Assembly Line 2', 'Robotics Bay', 'Packaging Line', 'QA Testing Hub'],
        datasets: [{
          label: 'OEE Efficiency Index (%)',
          data: [96.4, 92.1, 98.8, 94.2, 97.5],
          backgroundColor: ['#ff5c01', '#6366f1', '#10b981', '#f59e0b', '#0f172a'],
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { max: 100, ticks: { callback: v => v + '%' }, grid: { color: 'rgba(226, 232, 240, 0.6)' } },
          x: { grid: { display: false } }
        }
      }
    });
  }

  // 3. Sales & Orders Velocity Chart
  const salesVelCtx = document.getElementById('salesVelocityChart');
  if (salesVelCtx) {
    new Chart(salesVelCtx.getContext('2d'), {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
          { label: 'Order Volume ($k)', data: [380, 420, 510, 490, 620, 310, 240], borderColor: '#10b981', borderWidth: 3, tension: 0.3 }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { ticks: { callback: v => '$' + v + 'k' }, grid: { color: 'rgba(226, 232, 240, 0.6)' } },
          x: { grid: { display: false } }
        }
      }
    });
  }

  // 4. Order Status Breakdown Donut
  const orderStatusCtx = document.getElementById('orderStatusChart');
  if (orderStatusCtx) {
    new Chart(orderStatusCtx.getContext('2d'), {
      type: 'doughnut',
      data: {
        labels: ['Delivered', 'In Transit', 'Processing', 'Dispatched'],
        datasets: [{
          data: [640, 280, 190, 130],
          backgroundColor: ['#10b981', '#6366f1', '#f59e0b', '#ff5c01'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: { legend: { position: 'right' } }
      }
    });
  }

  // 5. Procurement Spend Trend Chart
  const procSpendCtx = document.getElementById('procurementSpendChart');
  if (procSpendCtx) {
    new Chart(procSpendCtx.getContext('2d'), {
      type: 'bar',
      data: {
        labels: ['Raw Metals', 'Hydraulics', 'Electronics', 'Packaging', 'Chemicals'],
        datasets: [{
          label: 'Monthly Spend ($M)',
          data: [1.8, 1.2, 2.1, 0.4, 0.8],
          backgroundColor: '#ff5c01',
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { ticks: { callback: v => '$' + v + 'M' }, grid: { color: 'rgba(226, 232, 240, 0.6)' } },
          x: { grid: { display: false } }
        }
      }
    });
  }

  // 6. Vendor Rating Score Bar Chart
  const vendorScoreCtx = document.getElementById('vendorScoreChart');
  if (vendorScoreCtx) {
    new Chart(vendorScoreCtx.getContext('2d'), {
      type: 'bar',
      data: {
        labels: ['AeroTech', 'Global Raw', 'MicroSemi', 'Voltaic Sys'],
        datasets: [{
          label: 'Vendor Quality Score',
          data: [98.4, 96.1, 94.7, 97.8],
          backgroundColor: '#10b981',
          borderRadius: 6
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { max: 100, ticks: { callback: v => v + '%' }, grid: { color: 'rgba(226, 232, 240, 0.6)' } },
          y: { grid: { display: false } }
        }
      }
    });
  }

  // 7. Supply Chain Lead Time Variance
  const leadTimeCtx = document.getElementById('supplyLeadTimeChart');
  if (leadTimeCtx) {
    new Chart(leadTimeCtx.getContext('2d'), {
      type: 'line',
      data: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [
          { label: 'Actual Lead Time (Days)', data: [4.2, 3.8, 4.5, 3.4], borderColor: '#6366f1', borderWidth: 3, tension: 0.3 },
          { label: 'SLA Benchmark (Days)', data: [5.0, 5.0, 5.0, 5.0], borderColor: '#ef4444', borderDash: [4, 4], borderWidth: 2 }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { grid: { color: 'rgba(226, 232, 240, 0.6)' } },
          x: { grid: { display: false } }
        }
      }
    });
  }

  // 8. Warehouse Bay Utilization
  const bayCtx = document.getElementById('warehouseBayChart');
  if (bayCtx) {
    new Chart(bayCtx.getContext('2d'), {
      type: 'bar',
      data: {
        labels: ['Bay 1 (Receiving)', 'Bay 2 (Staging)', 'Bay 3 (Automated Racks)', 'Bay 4 (Outbound)'],
        datasets: [{
          label: 'Throughput Efficiency (%)',
          data: [94, 88, 99, 92],
          backgroundColor: '#0f172a',
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { max: 100, ticks: { callback: v => v + '%' }, grid: { color: 'rgba(226, 232, 240, 0.6)' } },
          x: { grid: { display: false } }
        }
      }
    });
  }
}
