/**
 * LUMORA — Premium Architecture Website JavaScript
 * Handles all interactive functionality with accessibility and performance in mind
 */

(function() {
  'use strict';

  // ==========================================================================
  // Utility Functions
  // ==========================================================================

  const $ = (selector, context = document) => context ? context.querySelector(selector) : null;
  const $$ = (selector, context = document) => context ? Array.from(context.querySelectorAll(selector)) : [];

  const debounce = (fn, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn.apply(this, args), delay);
    };
  };

  const throttle = (fn, limit) => {
    let inThrottle;
    return (...args) => {
      if (!inThrottle) {
        fn.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  };

  const prefersReducedMotion = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ==========================================================================
  // State Management
  // ==========================================================================

  const state = {
    headerScrolled: false,
    navOpen: false,
    currentTestimonial: 0,
    testimonials: [],
    cookieConsentGiven: false
  };

  // ==========================================================================
  // Header & Navigation
  // ==========================================================================

  function initHeader() {
    const header = $('#header');
    const navToggle = $('#navMenuToggle');
    const navLinks = $('#navLinks');

    // Header scroll effect
    const handleScroll = throttle(() => {
      const scrolled = window.scrollY > 20;
      if (scrolled !== state.headerScrolled) {
        state.headerScrolled = scrolled;
        header.classList.toggle('header--scrolled', scrolled);
      }
    }, 16);

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Mobile menu toggle
    if (navToggle && navLinks) {
      navToggle.addEventListener('click', () => {
        state.navOpen = !state.navOpen;
        navToggle.setAttribute('aria-expanded', state.navOpen);
        navToggle.setAttribute('aria-label', state.navOpen ? 'Close menu' : 'Open menu');
        navLinks.classList.toggle('is-open', state.navOpen);

        // Trap focus when open
        if (state.navOpen) {
          trapFocus(navLinks);
        }
      });

      // Close on link click
      $$('.nav__link', navLinks).forEach(link => {
        link.addEventListener('click', () => {
          if (state.navOpen) {
            state.navOpen = false;
            navToggle.setAttribute('aria-expanded', 'false');
            navToggle.setAttribute('aria-label', 'Open menu');
            navLinks.classList.remove('is-open');
          }
        });
      });

      // Close on escape
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && state.navOpen) {
          state.navOpen = false;
          navToggle.setAttribute('aria-expanded', 'false');
          navToggle.setAttribute('aria-label', 'Open menu');
          navLinks.classList.remove('is-open');
          navToggle.focus();
        }
      });

      // Close on outside click
      document.addEventListener('click', (e) => {
        if (state.navOpen && !navLinks.contains(e.target) && !navToggle.contains(e.target)) {
          state.navOpen = false;
          navToggle.setAttribute('aria-expanded', 'false');
          navToggle.setAttribute('aria-label', 'Open menu');
          navLinks.classList.remove('is-open');
        }
      });
    }
  }

  // Focus trap utility
  function trapFocus(element) {
    const focusable = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    const handleTab = (e) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    element.addEventListener('keydown', handleTab);

    // Focus first element
    if (first) first.focus();

    // Return cleanup function
    return () => element.removeEventListener('keydown', handleTab);
  }

  // ==========================================================================
  // Scroll Reveal Animations
  // ==========================================================================

  function initScrollReveal() {
    if (prefersReducedMotion()) {
      // Immediately reveal all elements
      $$('[data-scroll-reveal]').forEach(el => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -10% 0px',
      threshold: 0.1
    });

    $$('[data-scroll-reveal]').forEach(el => observer.observe(el));
  }

  // ==========================================================================
  // Testimonials Slider
  // ==========================================================================

  function initTestimonials() {
    const track = $('[data-slider-track]');
    if (!track) return;
    
    const slides = $$('[data-slide]', track);
    const prevBtn = $('[data-slider-prev]');
    const nextBtn = $('[data-slider-next]');
    const dotsContainer = $('[data-slider-dots]');

    if (slides.length === 0) return;

    state.testimonials = slides;

    // Create dots
    slides.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.className = 'testimonials__dot';
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-selected', index === 0);
      dot.setAttribute('aria-label', `Testimonial ${index + 1}`);
      dot.addEventListener('click', () => goToSlide(index));
      dotsContainer.appendChild(dot);
    });

    const dots = $$('.testimonials__dot', dotsContainer);

    function goToSlide(index) {
      if (index < 0) index = slides.length - 1;
      if (index >= slides.length) index = 0;

      state.currentTestimonial = index;

      // Scroll to slide
      const slide = slides[index];
      slide.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', inline: 'center' });

      // Update dots
      dots.forEach((dot, i) => {
        dot.setAttribute('aria-selected', i === index);
      });
    }

    function nextSlide() {
      goToSlide(state.currentTestimonial + 1);
    }

    function prevSlide() {
      goToSlide(state.currentTestimonial - 1);
    }

    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);

    // Keyboard navigation
    track.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextSlide();
      }
    });

    // Auto-advance (optional)
    let autoAdvanceTimer;

    function startAutoAdvance() {
      if (prefersReducedMotion()) return;
      autoAdvanceTimer = setInterval(nextSlide, 7000);
    }

    function stopAutoAdvance() {
      clearInterval(autoAdvanceTimer);
    }

    track.addEventListener('mouseenter', stopAutoAdvance);
    track.addEventListener('mouseleave', startAutoAdvance);
    track.addEventListener('focusin', stopAutoAdvance);
    track.addEventListener('focusout', startAutoAdvance);

    startAutoAdvance();
  }

  // ==========================================================================
  // Project Card Hover Effects Enhancement
  // ==========================================================================

  function initProjectCardEffects() {
    const items = $$('.project-card');

    items.forEach(item => {
      const wrapper = $('.project-card__image-wrapper', item);
      if (!wrapper) return;

      // Add subtle parallax on mouse move
      if (!prefersReducedMotion()) {
        wrapper.addEventListener('mousemove', (e) => {
          const rect = wrapper.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width - 0.5;
          const y = (e.clientY - rect.top) / rect.height - 0.5;

          const image = $('.project-card__image', wrapper);
          if (image) {
            image.style.transform = `translate(${x * 15}px, ${y * 15}px) scale(1.05)`;
          }
        });

        wrapper.addEventListener('mouseleave', () => {
          const image = $('.project-card__image', wrapper);
          if (image) {
            image.style.transform = '';
          }
        });
      }
    });
  }

  // ==========================================================================
  // Service Card Hover Effects
  // ==========================================================================

  function initServiceCardEffects() {
    const cards = $$('.service-card');

    cards.forEach(card => {
      const icon = $('.service-card__icon', card);
      if (!icon) return;

      card.addEventListener('mouseenter', () => {
        icon.style.transform = 'scale(1.1) rotate(3deg)';
        icon.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
      });

      card.addEventListener('mouseleave', () => {
        icon.style.transform = '';
      });
    });
  }

  // ==========================================================================
  // Philosophy Card Stagger Animation
  // ==========================================================================

  function initPhilosophyCards() {
    const cards = $$('.philosophy-card');

    if (prefersReducedMotion()) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, index * 100);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    cards.forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(30px)';
      card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(card);
    });
  }

  // ==========================================================================
  // Project Filters
  // ==========================================================================

  function initProjectFilters() {
    const filterBtns = $$('.filter-btn');
    const projectCards = $$('[data-projects-grid] [data-category]');

    if (!filterBtns.length || !projectCards.length) return;

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;

        // Update active state
        filterBtns.forEach(b => {
          b.classList.remove('is-active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('is-active');
        btn.setAttribute('aria-pressed', 'true');

        // Filter projects
        projectCards.forEach(card => {
          const category = card.dataset.category;
          const shouldShow = filter === 'all' || category === filter;

          if (shouldShow) {
            card.style.display = '';
            card.hidden = false;
            // Trigger reflow for animation
            card.offsetHeight;
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
              if (!shouldShow) card.hidden = true;
            }, 300);
          }
        });
      });
    });
  }

  // ==========================================================================
  // Contact Form Validation
  // ==========================================================================

  function initContactForm() {
    const form = $('#contactForm');
    const newsletterForm = $('#newsletterForm');

    const initFormValidation = (formEl) => {
      if (!formEl) return;

      const fields = {};
      $$('input[required], select[required], textarea[required]', formEl).forEach(input => {
        fields[input.name] = {
          element: input,
          validate: getValidator(input)
        };
      });

      // Real-time validation
      Object.entries(fields).forEach(([name, config]) => {
        const { element, validate } = config;
        if (!element) return;

        element.addEventListener('blur', () => validateField(name, fields));
        element.addEventListener('input', () => {
          if (element.hasAttribute('aria-invalid')) {
            validateField(name, fields);
          }
        });
      });

      function getValidator(input) {
        const type = input.type;
        const name = input.name;

        if (type === 'email') {
          return v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        }
        if (type === 'tel') {
          return v => !v || /^[\d\s\-+()]{7,}$/.test(v);
        }
        if (name === 'firstName' || name === 'lastName') {
          return v => v.trim().length >= 2;
        }
        if (name === 'message') {
          return v => v.trim().length >= 20;
        }
        if (name === 'location') {
          return v => v.trim().length >= 3;
        }
        if (input.tagName === 'SELECT') {
          return v => v !== '';
        }
        return v => v.trim().length > 0;
      }

      function validateField(name, fieldsObj) {
        const { element, validate } = fieldsObj[name];
        if (!element) return true;

        const value = element.value;
        const isValid = validate(value);
        const errorEl = $(`#${name}Error`);

        element.setAttribute('aria-invalid', !isValid);

        if (!isValid && value) {
          if (errorEl) {
            errorEl.textContent = getErrorMessage(name);
          }
        } else {
          if (errorEl) errorEl.textContent = '';
        }

        return isValid;
      }

      function getErrorMessage(name) {
        const messages = {
          firstName: 'Please enter your first name (at least 2 characters)',
          lastName: 'Please enter your last name (at least 2 characters)',
          email: 'Please enter a valid email address',
          phone: 'Please enter a valid phone number',
          projectType: 'Please select a project type',
          budget: 'Please select a budget range',
          location: 'Please enter the project location (city, country)',
          message: 'Please describe your project vision (at least 20 characters)',
          timeline: 'Please select a timeline'
        };
        return messages[name] || 'This field is required';
      }

      function validateAll(fieldsObj) {
        return Object.keys(fieldsObj).every(name => validateField(name, fieldsObj));
      }

      // Form submission
      formEl.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!validateAll(fields)) {
          const firstInvalid = formEl.querySelector('[aria-invalid="true"]');
          if (firstInvalid) firstInvalid.focus();
          return;
        }

        const submitBtn = $('.form__submit, .newsletter-cta__form .btn--primary', formEl);
        if (submitBtn) {
          submitBtn.setAttribute('aria-busy', 'true');
          submitBtn.disabled = true;
        }

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Success
        if (formEl.id === 'newsletterForm') {
          showToast('success', 'Subscribed', 'Thank you for subscribing to the LUMORA Journal. You\'ll receive our next quarterly edition.');
        } else {
          showToast('success', 'Inquiry Sent', 'Our studio team will review your project and respond within 48 hours.');
        }

        formEl.reset();

        if (submitBtn) {
          submitBtn.setAttribute('aria-busy', 'false');
          submitBtn.disabled = false;
        }
      });
    };

    initFormValidation(form);
    initFormValidation(newsletterForm);
  }

  // ==========================================================================
  // Toast Notifications
  // ==========================================================================

  function initToasts() {
    // Create container if not exists
    if (!$('#toastContainer')) {
      const container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-container';
      container.setAttribute('aria-live', 'polite');
      container.setAttribute('aria-label', 'Notifications');
      document.body.appendChild(container);
    }
  }

  function showToast(type, title, message) {
    const container = $('#toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'polite');

    const icons = {
      success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
      error: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
      info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
    };

    toast.innerHTML = `
      <div class="toast__icon" aria-hidden="true">${icons[type] || icons.info}</div>
      <div class="toast__content">
        <div class="toast__title">${title}</div>
        <p class="toast__message">${message}</p>
      </div>
      <button class="toast__close" aria-label="Dismiss notification">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    `;

    container.appendChild(toast);

    // Auto dismiss
    const dismissTimer = setTimeout(() => dismissToast(toast), 6000);

    // Manual dismiss
    const closeBtn = $('.toast__close', toast);
    closeBtn.addEventListener('click', () => {
      clearTimeout(dismissTimer);
      dismissToast(toast);
    });

    // Pause on hover
    toast.addEventListener('mouseenter', () => clearTimeout(dismissTimer));
    toast.addEventListener('mouseleave', () => {
      const newTimer = setTimeout(() => dismissToast(toast), 3000);
    });
  }

  function dismissToast(toast) {
    toast.style.animation = 'toastIn 0.3s ease reverse';
    setTimeout(() => toast.remove(), 300);
  }

  // ==========================================================================
  // Cookie Consent
  // ==========================================================================

  function initCookieConsent() {
    const consent = $('#cookieConsent');
    const acceptBtn = $('#cookieAccept');
    const rejectBtn = $('#cookieReject');

    if (!consent) return;

    // Check if already consented
    const hasConsented = localStorage.getItem('lumora-cookie-consent');
    if (hasConsented) {
      state.cookieConsentGiven = true;
      return;
    }

    // Show after delay
    setTimeout(() => {
      consent.hidden = false;
    }, 2000);

    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('lumora-cookie-consent', 'accepted');
      state.cookieConsentGiven = true;
      hideConsent();
    });

    rejectBtn.addEventListener('click', () => {
      localStorage.setItem('lumora-cookie-consent', 'rejected');
      state.cookieConsentGiven = true;
      hideConsent();
    });

    function hideConsent() {
      consent.style.animation = 'slideUp 0.3s ease reverse';
      setTimeout(() => {
        consent.hidden = true;
      }, 300);
    }
  }

  // ==========================================================================
  // Smooth Scroll for Anchor Links
  // ==========================================================================

  function initSmoothScroll() {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;

      const href = link.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const headerOffset = 96;
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: targetPosition,
        behavior: prefersReducedMotion() ? 'auto' : 'smooth'
      });

      // Focus target for accessibility
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
      target.removeAttribute('tabindex');
    });
  }

  // ==========================================================================
  // Image Lazy Loading Enhancement
  // ==========================================================================

  function initLazyLoading() {
    if (!('IntersectionObserver' in window)) return;

    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          if (img.dataset.srcset) {
            img.srcset = img.dataset.srcset;
            img.removeAttribute('data-srcset');
          }
          imageObserver.unobserve(img);
        }
      });
    }, {
      rootMargin: '100px 0px',
      threshold: 0.01
    });

    $$('img[data-src]').forEach(img => imageObserver.observe(img));
  }

  // ==========================================================================
  // Performance: Preload Critical Images
  // ==========================================================================

  function preloadCriticalImages() {
    const criticalImages = [
      'assets/hero-desktop.jpg',
      'assets/projects/limestone-residence-desktop.jpg',
      'assets/projects/casa-verde-desktop.jpg',
      'assets/projects/quiet-house-desktop.jpg',
      'assets/studio-atelier-desktop.jpg'
    ];

    criticalImages.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    });
  }

  // ==========================================================================
  // View Transitions (for supported browsers)
  // ==========================================================================

  function initViewTransitions() {
    if (!document.startViewTransition) return;

    // Add view-transition-name to key elements for smooth page transitions
    // This is a progressive enhancement - actual page transitions require
    // multi-page architecture or SPA routing
  }

  // ==========================================================================
  // Initialize Everything
  // ==========================================================================

  function init() {
    // Performance optimizations
    preloadCriticalImages();

    // Core functionality
    initHeader();
    initScrollReveal();
    initTestimonials();
    initProjectCardEffects();
    initServiceCardEffects();
    initPhilosophyCards();
    initProjectFilters();
    initContactForm();
    initToasts();
    initCookieConsent();
    initSmoothScroll();
    initLazyLoading();
    initViewTransitions();

    // Add loaded class for CSS transitions
    document.body.classList.add('js-loaded');

    console.log('LUMORA website initialized');
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose for debugging
  window.LUMORA = {
    showToast,
    state
  };
})();