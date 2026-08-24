/**
 * STACKLY ERP - GLOBAL APPLICATION CONTROLLER
 * Handles navigation, toast notifications, scroll animations, counters, and global UX
 */

/* ==========================================================================
   GLOBAL PAGE PRELOADER CONTROLLER (1.5s Minimum Rotating Logo Display)
   ========================================================================== */
(function initGlobalPreloader() {
  let startTime = Date.now();
  const MIN_DISPLAY_TIME = 1500; // Minimum 1.5 seconds

  function hidePreloader() {
    const preloader = document.getElementById('global-preloader');
    if (!preloader) return;

    const elapsedTime = Date.now() - startTime;
    const remainingTime = Math.max(0, MIN_DISPLAY_TIME - elapsedTime);

    setTimeout(() => {
      preloader.classList.add('fade-out');
      setTimeout(() => {
        if (preloader) {
          preloader.style.display = 'none';
        }
      }, 520);
    }, remainingTime);
  }

  // Initial window load
  if (document.readyState === 'complete') {
    hidePreloader();
  } else {
    window.addEventListener('load', hidePreloader);
  }

  // Handle Back-Forward Cache (bfcache) navigation (e.g. Go Back button / browser back)
  window.addEventListener('pageshow', (event) => {
    const preloader = document.getElementById('global-preloader');
    if (!preloader) return;

    if (event.persisted) {
      startTime = Date.now();
      preloader.style.display = 'flex';
      preloader.classList.remove('fade-out');
    }
    hidePreloader();
  });
})();

/**
 * Universal Safe Go-Back Navigation Handler
 */
function handleGoBack() {
  if (window.history.length > 1 && document.referrer) {
    window.history.back();
  } else {
    window.location.href = 'index.html';
  }
}
window.handleGoBack = handleGoBack;


document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileDrawer();
  initHeroSlider();
  initScrollReveals();
  initCounters();
  initNewsletter();
  initContactForm();
  initTabs();
  initRoiCalculator();
  initWhitepaperDownloads();
  initExecutiveNewsletter();
  initDeploymentFlipCards();
  initLeadershipSlider();
  initTestimonialsMarquee();
  initGSAPAnimations();
});

/* ==========================================================================
   HERO 5-IMAGE CONTINUOUS FULL-WIDTH SLIDER (2.0s Interval)
   ========================================================================== */
function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-bg-slide, .hero-slide');
  const dots = document.querySelectorAll('.hero-bg-dot, .hero-slider-dot');
  if (!slides.length) return;

  let currentSlide = 0;
  const totalSlides = slides.length;
  const slideIntervalTime = 2000; // 2 seconds continuous rotation
  let slideTimer = null;

  function goToSlide(index) {
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));

    currentSlide = (index + totalSlides) % totalSlides;
    slides[currentSlide].classList.add('active');
    if (dots[currentSlide]) {
      dots[currentSlide].classList.add('active');
    }
  }

  function startAutoSlide() {
    if (slideTimer) clearInterval(slideTimer);
    slideTimer = setInterval(() => {
      goToSlide(currentSlide + 1);
    }, slideIntervalTime);
  }

  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = parseInt(dot.getAttribute('data-slide-index'), 10);
      goToSlide(idx);
      startAutoSlide();
    });
  });

  startAutoSlide();
}

/* ==========================================================================
   TOAST NOTIFICATION ENGINE
   ========================================================================== */
function showToast(type = 'info', title = 'Notification', message = '', duration = 4000) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const icons = {
    success: 'check_circle',
    warning: 'warning',
    danger: 'error',
    info: 'info'
  };

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span class="material-symbols-outlined toast-icon">${icons[type] || 'info'}</span>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-message">${message}</div>
    </div>
    <button class="toast-close" aria-label="Close">
      <span class="material-symbols-outlined" style="font-size: 16px;">close</span>
    </button>
    <div class="toast-progress" style="animation-duration: ${duration}ms;"></div>
  `;

  container.appendChild(toast);

  const closeBtn = toast.querySelector('.toast-close');
  const removeToast = () => {
    toast.style.animation = 'toastSlideIn 0.25s reverse forwards';
    setTimeout(() => toast.remove(), 250);
  };

  closeBtn.addEventListener('click', removeToast);
  const timer = setTimeout(removeToast, duration);
}
window.showToast = showToast;

/* ==========================================================================
   NAVBAR & STICKY BEHAVIOR
   ========================================================================== */
function initNavbar() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Set active link based on current path
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/* ==========================================================================
   MOBILE NAVIGATION DRAWER
   ========================================================================== */
function initMobileDrawer() {
  const toggleBtns = document.querySelectorAll('.mobile-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  const backdrop = document.querySelector('.mobile-nav-backdrop');
  const closeBtns = document.querySelectorAll('.mobile-drawer-close');

  if (!drawer) return;

  const openDrawer = (e) => {
    if (e) e.preventDefault();
    drawer.classList.add('open');
    if (backdrop) backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = (e) => {
    if (e) e.preventDefault();
    drawer.classList.remove('open');
    if (backdrop) backdrop.classList.remove('open');
    document.body.style.overflow = '';
  };

  toggleBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (drawer.classList.contains('open')) {
        closeDrawer(e);
      } else {
        openDrawer(e);
      }
    });
  });

  closeBtns.forEach(btn => btn.addEventListener('click', closeDrawer));
  if (backdrop) backdrop.addEventListener('click', closeDrawer);

  const links = drawer.querySelectorAll('.nav-link, a');
  links.forEach(l => l.addEventListener('click', () => {
    closeDrawer();
  }));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeDrawer(e);
    }
  });
}

/* ==========================================================================
   SCROLL REVEALS & 3D GRID ENTRANCE OBSERVERS
   ========================================================================== */
function initScrollReveals() {
  const reveals = document.querySelectorAll('.reveal-init');
  if (reveals.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach(el => observer.observe(el));
  }

  // 3D Staggered Modules Grid Observer
  const grids3d = document.querySelectorAll('.modules-grid-3d');
  if (grids3d.length) {
    const gridObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          gridObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    grids3d.forEach(grid => gridObserver.observe(grid));
  }

  // Content + Visual Section Observer
  const contentVisualSections = document.querySelectorAll('.content-visual-section');
  if (contentVisualSections.length) {
    const cvObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          cvObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    contentVisualSections.forEach(sec => cvObserver.observe(sec));
  }

  // Horizontal Card Rows: Shuffle & Settle Observer
  const horizontalCardSections = document.querySelectorAll('.horizontal-cards-section');
  if (horizontalCardSections.length) {
    const hcObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          hcObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    horizontalCardSections.forEach(sec => hcObserver.observe(sec));
  }

  // Pre-Footer CTA Section Observer
  const prefooterSections = document.querySelectorAll('.prefooter-cta-section');
  if (prefooterSections.length) {
    const pfObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          pfObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    prefooterSections.forEach(sec => pfObserver.observe(sec));
  }

  // Global Footprint Hubs: Center-First Observer
  const footprintSections = document.querySelectorAll('.footprint-cards-section');
  if (footprintSections.length) {
    const fpObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          fpObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    footprintSections.forEach(sec => fpObserver.observe(sec));
  }

  // Milestone Timeline: Center-First, Top-Down, Bottom-Up Observer
  const timelineSections = document.querySelectorAll('.timeline-animation-section');
  if (timelineSections.length) {
    const tlObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          tlObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    timelineSections.forEach(sec => tlObserver.observe(sec));
  }

  // Deployment Architecture Flip Cards: Center-First Observer
  const deploymentSections = document.querySelectorAll('.deployment-flip-section');
  if (deploymentSections.length) {
    const dpObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          dpObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    deploymentSections.forEach(sec => dpObserver.observe(sec));
  }

  // Ecosystem Connectors: Outer-to-Inner Observer
  const connectorSections = document.querySelectorAll('.connectors-animation-section');
  if (connectorSections.length) {
    const cnObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          cnObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    connectorSections.forEach(sec => cnObserver.observe(sec));
  }

  // Blog Featured Hero Article Directional Observer
  const featuredBlogCards = document.querySelectorAll('.blog-featured-hero-card');
  if (featuredBlogCards.length) {
    const fbObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          fbObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.10, rootMargin: '0px 0px -30px 0px' });

    featuredBlogCards.forEach(card => fbObserver.observe(card));
  }

  // Blog Articles Grid: Center-First (Center -> Left -> Right) Observer
  const blogGridSections = document.querySelectorAll('.blog-grid-animation-section');
  if (blogGridSections.length) {
    const bgObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          bgObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.10, rootMargin: '0px 0px -30px 0px' });

    blogGridSections.forEach(sec => bgObserver.observe(sec));
  }

  // Contact Consultation Section Directional Observer
  const contactSections = document.querySelectorAll('.contact-consultation-section');
  if (contactSections.length) {
    const ccObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          ccObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });

    contactSections.forEach(sec => ccObserver.observe(sec));
  }
}

/* ==========================================================================
   GSAP INTEGRATIONS & SCROLLTRIGGER ENTRANCE
   ========================================================================== */
function initGSAPAnimations() {
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    const connectorGrid = document.querySelector('.connectors-animation-section .connectors-grid');
    if (connectorGrid) {
      const cards = [
        connectorGrid.querySelector('.connector-card-r1-c1'), // Top-Left
        connectorGrid.querySelector('.connector-card-r1-c4'), // Top-Right
        connectorGrid.querySelector('.connector-card-r1-c2'), // R1 Mid-Left
        connectorGrid.querySelector('.connector-card-r1-c3'), // R1 Mid-Right
        connectorGrid.querySelector('.connector-card-r2-c1'), // Bottom-Left
        connectorGrid.querySelector('.connector-card-r2-c4'), // Bottom-Right
        connectorGrid.querySelector('.connector-card-r2-c2'), // R2 Mid-Left
        connectorGrid.querySelector('.connector-card-r2-c3'), // R2 Mid-Right
      ].filter(Boolean);

      if (cards.length) {
        gsap.fromTo(cards, 
          { opacity: 0, y: 30, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.75,
            ease: "power3.out",
            stagger: 0.11,
            scrollTrigger: {
              trigger: connectorGrid,
              start: "top 85%",
              once: true,
              onEnter: () => {
                const section = connectorGrid.closest('.connectors-animation-section');
                if (section) section.classList.add('revealed');
              }
            }
          }
        );
      }
    }

    // Salem Global HQ Campus Tab GSAP ScrollTrigger Sequence
    const salemHqCard = document.querySelector('#loc-salem');
    if (salemHqCard) {
      const heading = salemHqCard.querySelector('.salem-hq-title');
      const desc = salemHqCard.querySelector('.salem-hq-desc');
      const contactItems = salemHqCard.querySelectorAll('.salem-hq-contact-item');
      const imgBox = salemHqCard.querySelector('.salem-hq-img-box');

      const salemTl = gsap.timeline({
        scrollTrigger: {
          trigger: salemHqCard,
          start: "top 85%",
          once: true,
          onEnter: () => {
            salemHqCard.classList.add('revealed');
          }
        }
      });

      // 1. Main Heading -> enters from LEFT (x: -60px -> 0)
      if (heading) {
        salemTl.fromTo(heading, 
          { opacity: 0, x: -60 },
          { opacity: 1, x: 0, duration: 0.75, ease: "power3.out" },
          0
        );
      }

      // 2. Description Paragraph -> enters from RIGHT (x: 60px -> 0)
      if (desc) {
        salemTl.fromTo(desc,
          { opacity: 0, x: 60 },
          { opacity: 1, x: 0, duration: 0.75, ease: "power3.out" },
          0.15
        );
      }

      // 3. Direct / Timezone / Address -> enter from BOTTOM with sequential stagger (y: 40px -> 0)
      if (contactItems && contactItems.length) {
        salemTl.fromTo(contactItems,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.65, ease: "power3.out", stagger: 0.12 },
          0.30
        );
      }

      // 4. Right-Side Image -> enters from BOTTOM (y: 70px -> 0, scale: 0.96 -> 1)
      if (imgBox) {
        salemTl.fromTo(imgBox,
          { opacity: 0, y: 70, scale: 0.96 },
          { opacity: 1, y: 0, scale: 1, duration: 0.85, ease: "power3.out" },
          0.45
        );
      }
    }
  }
}

/* ==========================================================================
   DEPLOYMENT 3D FLIP CARDS INTERACTION (TOUCH & ACCESSIBILITY)
   ========================================================================== */
function initDeploymentFlipCards() {
  const flipWrappers = document.querySelectorAll('.deployment-flip-wrapper');
  if (!flipWrappers.length) return;

  flipWrappers.forEach(wrapper => {
    const card = wrapper.querySelector('.deployment-flip-card');
    if (!card) return;

    // Tap/click toggle for touch & mobile devices
    card.addEventListener('click', (e) => {
      // Don't toggle flip if clicking an actual link or button on the back
      if (e.target.closest('a') || e.target.closest('button')) {
        return;
      }
      card.classList.toggle('flipped');
    });

    // Keyboard enter/space toggle
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        if (!e.target.closest('a') && !e.target.closest('button')) {
          e.preventDefault();
          card.classList.toggle('flipped');
        }
      }
    });

    // Reset flipped state on mouseleave
    wrapper.addEventListener('mouseleave', () => {
      card.classList.remove('flipped');
    });
  });
}

/* ==========================================================================
   ANIMATED NUMBER COUNTERS
   ========================================================================== */
function initCounters() {
  const counters = document.querySelectorAll('.counter-value[data-target]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.getAttribute('data-target'));
        const prefix = el.getAttribute('data-prefix') || '';
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 1800;
        const startTime = performance.now();

        const updateCount = (currentTime) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easeOut = 1 - Math.pow(1 - progress, 3);
          const current = Math.floor(easeOut * target);

          el.textContent = `${prefix}${current.toLocaleString()}${suffix}`;

          if (progress < 1) {
            requestAnimationFrame(updateCount);
          } else {
            el.textContent = `${prefix}${target.toLocaleString()}${suffix}`;
          }
        };

        requestAnimationFrame(updateCount);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

/* ==========================================================================
   NEWSLETTER SUBSCRIPTION
   ========================================================================== */
function initNewsletter() {
  const forms = document.querySelectorAll('.footer-newsletter-form');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      if (input && input.value.trim()) {
        showToast('success', 'Subscribed Successfully', `Thank you! Enterprise updates will be sent to ${input.value.trim()}.`);
        input.value = '';
      }
    });
  });
}

/* ==========================================================================
   CONTACT FORM VALIDATION & SUBMISSION
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('enterprise-contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    const fields = ['full-name', 'work-email', 'company-name', 'message-body'];
    fields.forEach(id => {
      const el = document.getElementById(id);
      const errEl = document.getElementById(`${id}-error`);
      if (!el) return;

      if (!el.value.trim()) {
        el.style.borderColor = 'var(--danger)';
        if (errEl) errEl.style.display = 'block';
        isValid = false;
      } else {
        el.style.borderColor = 'var(--slate-300)';
        if (errEl) errEl.style.display = 'none';
      }
    });

    if (isValid) {
      // Redirect to 404 page upon submitting contact details
      window.location.href = '404.html';
    } else {
      showToast('warning', 'Incomplete Form', 'Please fill in all mandatory enterprise fields to continue.');
    }
  });
}

/* ==========================================================================
   INTERACTIVE TABS
   ========================================================================== */
function initTabs() {
  const tabButtons = document.querySelectorAll('[data-tab-target]');
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab-target');
      const container = btn.closest('.tab-container') || document;
      
      container.querySelectorAll('[data-tab-target]').forEach(b => {
        b.classList.remove('active', 'btn-primary');
        b.classList.add('btn-outline');
      });
      container.querySelectorAll('.tab-pane').forEach(p => {
        p.classList.remove('active');
        p.style.display = 'none';
      });

      btn.classList.add('active', 'btn-primary');
      btn.classList.remove('btn-outline');
      const pane = document.getElementById(targetId);
      if (pane) {
        pane.classList.add('active');
        pane.style.display = 'grid';
      }
    });
  });
}

/* ==========================================================================
   INTERACTIVE ENTERPRISE ROI CALCULATOR
   ========================================================================== */
function initRoiCalculator() {
  const employeeSlider = document.getElementById('roi-employees');
  const revenueSlider = document.getElementById('roi-revenue');
  const empValDisplay = document.getElementById('roi-emp-val');
  const revValDisplay = document.getElementById('roi-rev-val');
  const savingsDisplay = document.getElementById('roi-savings-result');
  const hoursDisplay = document.getElementById('roi-hours-result');
  const paybackDisplay = document.getElementById('roi-payback-result');

  if (!employeeSlider || !revenueSlider) return;

  function calculateROI() {
    const employees = parseInt(employeeSlider.value, 10);
    const revenue = parseInt(revenueSlider.value, 10);

    if (empValDisplay) empValDisplay.textContent = `${employees.toLocaleString()} Users`;
    if (revValDisplay) revValDisplay.textContent = `$${revenue}M`;

    // Formula based on enterprise productivity gains
    const annualSavings = Math.round((employees * 1850) + (revenue * 24000));
    const hoursSaved = Math.round(employees * 142);
    const paybackMonths = Math.max(1.8, (4.2 - (employees / 2000))).toFixed(1);

    if (savingsDisplay) {
      if (annualSavings >= 1000000) {
        savingsDisplay.textContent = `$${(annualSavings / 1000000).toFixed(2)}M`;
      } else {
        savingsDisplay.textContent = `$${(annualSavings / 1000).toFixed(0)}k`;
      }
    }
    if (hoursDisplay) hoursDisplay.textContent = `${hoursSaved.toLocaleString()} hrs/yr`;
    if (paybackDisplay) paybackDisplay.textContent = `${paybackMonths} Months`;
  }

  employeeSlider.addEventListener('input', calculateROI);
  revenueSlider.addEventListener('input', calculateROI);
  calculateROI();

  const auditBtn = document.getElementById('btn-roi-audit') || document.querySelector('.roi-output-btn');
  if (auditBtn) {
    auditBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = '404.html';
    });
  }
}

/* ==========================================================================
   WHITEPAPERS & TECHNICAL DOWNLOADS
   ========================================================================== */
function initWhitepaperDownloads() {
  const downloadBtns = document.querySelectorAll('.whitepaper-download-btn');
  downloadBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const title = btn.getAttribute('data-paper-title') || 'Enterprise Technical Blueprint';
      showToast('success', 'Document Dispatched', `Generating your instant access copy for: "${title}". Check your downloads.`);
    });
  });
}

/* ==========================================================================
   EXECUTIVE NEWSLETTER FORM
   ========================================================================== */
function initExecutiveNewsletter() {
  const form = document.getElementById('executive-newsletter-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailInput = form.querySelector('input[type="email"]');
    if (!emailInput || !emailInput.value.trim()) {
      showToast('warning', 'Email Required', 'Please provide a valid corporate email address.');
      return;
    }

    // Redirect to 404 page upon submitting email
    window.location.href = '404.html';
  });
}

/* ==========================================================================
   EXECUTIVE LEADERSHIP RESPONSIVE MOBILE SLIDER & DESKTOP MARQUEE
   ========================================================================== */
function initLeadershipSlider() {
  const container = document.querySelector('.leadership-slider-container');
  const track = document.querySelector('.leadership-track');
  if (!container || !track) return;

  const originalCards = Array.from(track.querySelectorAll('.leadership-card:not([aria-hidden="true"])'));
  if (!originalCards.length) return;

  let currentIndex = 0;
  let autoSlideTimer = null;
  let isMobile = window.innerWidth <= 768;
  let startX = 0;
  let startY = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;
  let isDragging = false;
  let isHorizontalSwipe = null;

  // Create or retrieve mobile dots container
  let dotsContainer = container.parentElement.querySelector('.leadership-dots-container');
  if (!dotsContainer) {
    dotsContainer = document.createElement('div');
    dotsContainer.className = 'leadership-dots-container';
    originalCards.forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.className = `leadership-dot ${idx === 0 ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Leadership Slide ${idx + 1}`);
      dot.setAttribute('type', 'button');
      dot.addEventListener('click', () => {
        goToCard(idx);
        restartAutoSlide();
      });
      dotsContainer.appendChild(dot);
    });
    container.parentNode.insertBefore(dotsContainer, container.nextSibling);
  }

  function getCardStep() {
    if (!originalCards[0]) return 0;
    const cardRect = originalCards[0].getBoundingClientRect();
    const gap = 16;
    return cardRect.width + gap;
  }

  function updateDots() {
    if (!dotsContainer) return;
    const dots = dotsContainer.querySelectorAll('.leadership-dot');
    dots.forEach((d, idx) => {
      d.classList.toggle('active', idx === currentIndex);
    });
  }

  function goToCard(index) {
    if (!isMobile) return;
    const maxIndex = originalCards.length - 1;
    currentIndex = Math.max(0, Math.min(index, maxIndex));
    const step = getCardStep();
    currentTranslate = -currentIndex * step;
    prevTranslate = currentTranslate;
    track.style.transition = 'transform 0.38s cubic-bezier(0.25, 1, 0.5, 1)';
    track.style.transform = `translate3d(${currentTranslate}px, 0, 0)`;
    updateDots();
  }

  function startAutoSlide() {
    if (!isMobile) return;
    stopAutoSlide();
    autoSlideTimer = setInterval(() => {
      if (!isMobile) return;
      const nextIndex = (currentIndex + 1) % originalCards.length;
      goToCard(nextIndex);
    }, 4000);
  }

  function stopAutoSlide() {
    if (autoSlideTimer) {
      clearInterval(autoSlideTimer);
      autoSlideTimer = null;
    }
  }

  function restartAutoSlide() {
    stopAutoSlide();
    startAutoSlide();
  }

  // Touch & Swipe Event Handlers for Mobile
  function onTouchStart(e) {
    if (!isMobile) return;
    stopAutoSlide();
    isDragging = true;
    isHorizontalSwipe = null;
    const touch = e.touches ? e.touches[0] : e;
    startX = touch.clientX;
    startY = touch.clientY;
    track.style.transition = 'none';
  }

  function onTouchMove(e) {
    if (!isMobile || !isDragging) return;
    const touch = e.touches ? e.touches[0] : e;
    const diffX = touch.clientX - startX;
    const diffY = touch.clientY - startY;

    if (isHorizontalSwipe === null) {
      if (Math.abs(diffX) > 6 || Math.abs(diffY) > 6) {
        isHorizontalSwipe = Math.abs(diffX) > Math.abs(diffY);
      }
    }

    if (isHorizontalSwipe) {
      if (e.cancelable) e.preventDefault();
      const currentPos = prevTranslate + diffX;
      const maxTranslate = 0;
      const minTranslate = -(originalCards.length - 1) * getCardStep();
      let boundedPos = currentPos;

      // Soft edge spring resistance
      if (currentPos > maxTranslate) {
        boundedPos = maxTranslate + (currentPos - maxTranslate) * 0.28;
      } else if (currentPos < minTranslate) {
        boundedPos = minTranslate + (currentPos - minTranslate) * 0.28;
      }

      track.style.transform = `translate3d(${boundedPos}px, 0, 0)`;
      currentTranslate = boundedPos;
    }
  }

  function onTouchEnd(e) {
    if (!isMobile || !isDragging) return;
    isDragging = false;
    const diffX = currentTranslate - prevTranslate;
    const threshold = 40;

    if (diffX < -threshold) {
      goToCard(currentIndex + 1);
    } else if (diffX > threshold) {
      goToCard(currentIndex - 1);
    } else {
      goToCard(currentIndex);
    }

    restartAutoSlide();
  }

  // Touch event listeners
  container.addEventListener('touchstart', onTouchStart, { passive: true });
  container.addEventListener('touchmove', onTouchMove, { passive: false });
  container.addEventListener('touchend', onTouchEnd, { passive: true });

  // Mouse drag support for desktop responsive emulation mode
  container.addEventListener('mousedown', onTouchStart);
  window.addEventListener('mousemove', onTouchMove);
  window.addEventListener('mouseup', onTouchEnd);

  // Resize & Breakpoint Handling
  function handleResize() {
    isMobile = window.innerWidth <= 768;

    if (isMobile) {
      if (dotsContainer) dotsContainer.style.display = 'flex';
      goToCard(currentIndex);
      startAutoSlide();
    } else {
      stopAutoSlide();
      if (dotsContainer) dotsContainer.style.display = 'none';
      track.style.transition = '';
      track.style.transform = '';
    }
  }

  window.addEventListener('resize', handleResize);
  handleResize();
}

/* ==========================================================================
   TESTIMONIALS CONTINUOUS HORIZONTAL MARQUEE CONTROLLER
   ========================================================================== */
function initTestimonialsMarquee() {
  const container = document.querySelector('.testimonials-slider-container');
  const track = document.querySelector('.testimonials-track');
  if (!container || !track) return;

  container.addEventListener('touchstart', () => {
    track.style.animationPlayState = 'paused';
  }, { passive: true });

  container.addEventListener('touchend', () => {
    track.style.animationPlayState = 'running';
  }, { passive: true });
}
