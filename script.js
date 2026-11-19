/**
 * NOVA — Premium Website JavaScript
 * Handles all interactive functionality with accessibility and performance in mind
 */

(function() {
    'use strict';
    
    // ==========================================================================
    // Utility Functions
    // ==========================================================================
    
    const $ = (selector, context = document) => context.querySelector(selector);
    const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));
    
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
        searchOpen: false,
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
        const searchBtn = $('.nav__search');
        const searchOverlay = $('#searchOverlay');
        const searchClose = $('.nav__search-close');
        const searchInput = $('#searchInput');
        
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
        
        // Search overlay
        if (searchBtn && searchOverlay && searchClose && searchInput) {
            searchBtn.addEventListener('click', () => {
                state.searchOpen = true;
                searchOverlay.setAttribute('aria-hidden', 'false');
                searchBtn.setAttribute('aria-expanded', 'true');
                document.body.style.overflow = 'hidden';
                
                // Focus input after transition
                setTimeout(() => searchInput.focus(), 300);
            });
            
            const closeSearch = () => {
                state.searchOpen = false;
                searchOverlay.setAttribute('aria-hidden', 'true');
                searchBtn.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
                searchBtn.focus();
            };
            
            searchClose.addEventListener('click', closeSearch);
            
            searchOverlay.addEventListener('click', (e) => {
                if (e.target === searchOverlay) closeSearch();
            });
            
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && state.searchOpen) closeSearch();
            });
            
            // Trap focus in search overlay
            searchOverlay.addEventListener('keydown', (e) => {
                if (e.key === 'Tab' && state.searchOpen) {
                    const focusable = searchOverlay.querySelectorAll(
                        'button, input, [href], select, textarea, [tabindex]:not([tabindex="-1"])'
                    );
                    const first = focusable[0];
                    const last = focusable[focusable.length - 1];
                    
                    if (e.shiftKey && document.activeElement === first) {
                        e.preventDefault();
                        last.focus();
                    } else if (!e.shiftKey && document.activeElement === last) {
                        e.preventDefault();
                        first.focus();
                    }
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
    // Counter Animation
    // ==========================================================================
    
    function initCounters() {
        if (prefersReducedMotion()) {
            $$('[data-count]').forEach(el => {
                el.textContent = el.dataset.count;
            });
            return;
        }
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        $$('[data-count]').forEach(el => observer.observe(el));
    }
    
    function animateCounter(element) {
        const target = parseInt(element.dataset.count, 10);
        const duration = 2000;
        const startTime = performance.now();
        
        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing: easeOutCubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(eased * target);
            
            element.textContent = current.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = target.toLocaleString();
            }
        };
        
        requestAnimationFrame(update);
    }
    
    // ==========================================================================
    // Pricing Toggle
    // ==========================================================================
    
    function initPricingToggle() {
        const annualRadio = $('#billingAnnual');
        const monthlyRadio = $('#billingMonthly');
        const amounts = $$('.pricing__amount');
        
        function updatePrices() {
            const isAnnual = annualRadio.checked;
            
            amounts.forEach(amount => {
                const newValue = isAnnual ? amount.dataset.annual : amount.dataset.monthly;
                const period = $('.pricing__period');
                if (period) period.textContent = isAnnual ? '/year' : '/month';
                
                // Animate number change
                animatePriceChange(amount, newValue);
            });
        }
        
        function animatePriceChange(element, newValue) {
            const current = parseInt(element.textContent.replace(/,/g, ''), 10);
            const target = parseInt(newValue, 10);
            const duration = 300;
            const startTime = performance.now();
            
            const update = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                const value = Math.floor(current + (target - current) * eased);
                element.textContent = value.toLocaleString();
                
                if (progress < 1) {
                    requestAnimationFrame(update);
                }
            };
            
            requestAnimationFrame(update);
        }
        
        if (annualRadio && monthlyRadio) {
            annualRadio.addEventListener('change', updatePrices);
            monthlyRadio.addEventListener('change', updatePrices);
        }
    }
    
    // ==========================================================================
    // Testimonials Slider
    // ==========================================================================
    
    function initTestimonials() {
        const track = $('[data-slider-track]');
        const slides = $$('[data-slide]', track);
        const prevBtn = $('[data-slider-prev]');
        const nextBtn = $('[data-slider-next]');
        const dotsContainer = $('[data-slider-dots]');
        
        if (!track || slides.length === 0) return;
        
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
            autoAdvanceTimer = setInterval(nextSlide, 6000);
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
    // Contact Form
    // ==========================================================================
    
    function initContactForm() {
        const form = $('#contactForm');
        if (!form) return;
        
        const fields = {
            name: { element: $('#name'), validate: v => v.trim().length >= 2 },
            email: { element: $('#email'), validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) },
            phone: { element: $('#phone'), validate: v => !v || /^[\d\s\-+()]{7,}$/.test(v) },
            interest: { element: $('#interest'), validate: v => v !== '' },
            message: { element: $('#message'), validate: v => v.trim().length >= 10 }
        };
        
        const submitBtn = $('.form__submit', form);
        
        // Real-time validation
        Object.entries(fields).forEach(([name, config]) => {
            const { element, validate } = config;
            if (!element) return;
            
            element.addEventListener('blur', () => validateField(name));
            element.addEventListener('input', () => {
                if (element.hasAttribute('aria-invalid')) {
                    validateField(name);
                }
            });
        });
        
        function validateField(name) {
            const { element, validate } = fields[name];
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
                name: 'Please enter your full name (at least 2 characters)',
                email: 'Please enter a valid email address',
                phone: 'Please enter a valid phone number',
                interest: 'Please select an option',
                message: 'Please enter a message (at least 10 characters)'
            };
            return messages[name] || 'This field is invalid';
        }
        
        function validateAll() {
            return Object.keys(fields).every(name => validateField(name));
        }
        
        // Form submission
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (!validateAll()) {
                // Focus first invalid field
                const firstInvalid = form.querySelector('[aria-invalid="true"]');
                if (firstInvalid) firstInvalid.focus();
                return;
            }
            
            // Show loading state
            submitBtn.setAttribute('aria-busy', 'true');
            submitBtn.disabled = true;
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Success
            showToast('success', 'Request Sent', 'Our concierge team will contact you within 24 hours to schedule your private consultation.');
            form.reset();
            
            // Reset button
            submitBtn.setAttribute('aria-busy', 'false');
            submitBtn.disabled = false;
        });
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
            dismissTimer = setTimeout(() => dismissToast(toast), 3000);
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
        const hasConsented = localStorage.getItem('nova-cookie-consent');
        if (hasConsented) {
            state.cookieConsentGiven = true;
            return;
        }
        
        // Show after delay
        setTimeout(() => {
            consent.hidden = false;
        }, 2000);
        
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('nova-cookie-consent', 'accepted');
            state.cookieConsentGiven = true;
            hideConsent();
        });
        
        rejectBtn.addEventListener('click', () => {
            localStorage.setItem('nova-cookie-consent', 'rejected');
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
            
            const headerOffset = 80;
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
    // Gallery Hover Effects Enhancement
    // ==========================================================================
    
    function initGalleryEffects() {
        const items = $$('.gallery__item');
        
        items.forEach(item => {
            const wrapper = $('.gallery__image-wrapper', item);
            if (!wrapper) return;
            
            // Add subtle parallax on mouse move
            if (!prefersReducedMotion()) {
                wrapper.addEventListener('mousemove', (e) => {
                    const rect = wrapper.getBoundingClientRect();
                    const x = (e.clientX - rect.left) / rect.width - 0.5;
                    const y = (e.clientY - rect.top) / rect.height - 0.5;
                    
                    const placeholder = $('.gallery__placeholder', wrapper);
                    if (placeholder) {
                        placeholder.style.transform = `translate(${x * 10}px, ${y * 10}px) scale(1.05)`;
                    }
                });
                
                wrapper.addEventListener('mouseleave', () => {
                    const placeholder = $('.gallery__placeholder', wrapper);
                    if (placeholder) {
                        placeholder.style.transform = '';
                    }
                });
            }
        });
    }
    
    // ==========================================================================
    // Pricing Card CTA Buttons
    // ==========================================================================
    
    function initPricingCTAs() {
        $$('.pricing__cta').forEach(btn => {
            btn.addEventListener('click', () => {
                const tier = btn.dataset.tier;
                showToast('info', `${tier.charAt(0).toUpperCase() + tier.slice(1)} Selected`, 'Redirecting to consultation booking...');
                
                // Scroll to contact form
                setTimeout(() => {
                    const contactForm = $('#contactForm');
                    if (contactForm) {
                        const interestSelect = $('#interest');
                        if (interestSelect) {
                            interestSelect.value = tier;
                        }
                        contactForm.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
                        const firstInput = $('input', contactForm);
                        if (firstInput) firstInput.focus();
                    }
                }, 500);
            });
        });
    }
    
    // ==========================================================================
    // Performance: Lazy Load Images (when real images added)
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
            rootMargin: '50px 0px',
            threshold: 0.01
        });
        
        $$('img[data-src]').forEach(img => imageObserver.observe(img));
    }
    
    // ==========================================================================
    // Initialize Everything
    // ==========================================================================
    
    function init() {
        // Core functionality
        initHeader();
        initScrollReveal();
        initCounters();
        initPricingToggle();
        initTestimonials();
        initContactForm();
        initToasts();
        initCookieConsent();
        initSmoothScroll();
        initGalleryEffects();
        initPricingCTAs();
        initLazyLoading();
        
        // Add loaded class for CSS transitions
        document.body.classList.add('js-loaded');
        
        console.log('NOVA website initialized');
    }
    
    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Expose for debugging
    window.NOVA = {
        showToast,
        state
    };
})();