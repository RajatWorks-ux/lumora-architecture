# LUMORA Design System Master File

> **LOGIC:** When building a specific page, first check `design-system/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** LUMORA — Premium Architecture & Interior Design Studio
**Generated:** 2026-11-19
**Category:** Luxury Architecture / Interior Design / Editorial
**Token files:** `tokens.json` (W3C Design Tokens Community Group JSON).
**CSS variables:** `tokens.css` (`:root` custom properties).

---

## Brand Identity

**Brand Name:** LUMORA
**Tagline:** "Spaces that make you feel something."
**Industry:** Luxury architecture, interior design, residential design, hospitality, contemporary spaces.

**Brand Personality:**
- Architectural
- Refined
- Minimalist
- Artistic
- Confident
- Timeless
- Premium

**Target Audience:**
- Luxury homeowners
- Property developers
- Hospitality businesses
- Interior design clients
- Architecture enthusiasts

---

## Visual Direction

**Design Inspiration:** High-end editorial design inspired by luxury architecture publications and internationally respected creative studios.

### Color Palette

| Role | Hex | CSS Variable |
|------|-----|--------------|
| Warm Ivory | `#F5F2EC` | `--color-warm-ivory` / `--color-background` |
| Soft Limestone | `#DCD5C9` | `--color-soft-limestone` / `--color-muted` / `--color-border` |
| Charcoal | `#252521` | `--color-charcoal` / `--color-primary` / `--color-foreground` |
| Deep Olive | `#555B48` | `--color-deep-olive` / `--color-secondary` / `--color-muted-foreground` |
| Muted Bronze | `#A68D69` | `--color-muted-bronze` / `--color-accent` / `--color-ring` |
| Pure White | `#FFFFFF` | `--color-pure-white` / `--color-on-primary` / `--color-card` |

### Typography

- **Elegant Editorial Serif (Headlines):** Cormorant Garamond
- **Modern Geometric Sans-Serif (Body):** DM Sans
- **Strong typographic hierarchy**
- **Beautiful spacing and carefully controlled line lengths**

**Google Fonts Import:**
```css
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
```

### Design Characteristics

- Large cinematic photography
- Asymmetrical editorial layouts
- Generous negative space
- Oversized typography
- Subtle borders and dividers
- Sophisticated image crops
- Layered visual compositions
- Beautiful transitions and hover interactions

### Avoid

- Generic SaaS design
- Excessive rounded cards
- Random gradients
- Cheap stock-template aesthetics
- Unnecessary icons
- Overloaded layouts
- Excessive animations

---

## Component Specifications

### Buttons

```css
/* Primary Button - Bronze */
.btn--primary {
  background: var(--color-accent);
  color: var(--color-on-accent);
  border: 2px solid var(--color-accent);
  padding: 16px 32px;
  border-radius: var(--radius-md);
  font-family: var(--font-body);
  font-weight: 600;
  font-size: 0.9375rem;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  transition: all var(--transition-base);
  cursor: pointer;
}

.btn--primary:hover:not(:disabled) {
  background: #8F7A5C;
  border-color: #8F7A5C;
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

/* Secondary Button - Charcoal Outline */
.btn--secondary {
  background: transparent;
  color: var(--color-primary);
  border: 2px solid var(--color-primary);
  padding: 16px 32px;
  border-radius: var(--radius-md);
  font-family: var(--font-body);
  font-weight: 600;
  font-size: 0.9375rem;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  transition: all var(--transition-base);
  cursor: pointer;
}

.btn--secondary:hover:not(:disabled) {
  background: var(--color-primary);
  color: var(--color-on-primary);
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

/* Tertiary Button - Text Only */
.btn--tertiary {
  background: transparent;
  color: var(--color-accent);
  border: none;
  padding: 12px 0;
  font-family: var(--font-body);
  font-weight: 500;
  font-size: 0.9375rem;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  transition: all var(--transition-fast);
  cursor: pointer;
  position: relative;
}

.btn--tertiary::after {
  content: '';
  position: absolute;
  bottom: 8px;
  left: 0;
  width: 100%;
  height: 1px;
  background: currentColor;
  transform: scaleX(0);
  transform-origin: right;
  transition: transform var(--transition-base);
}

.btn--tertiary:hover::after {
  transform: scaleX(1);
  transform-origin: left;
}
```

### Cards

```css
/* Project Card */
.project-card {
  background: var(--color-card);
  border-radius: var(--radius-xl);
  overflow: hidden;
  transition: all var(--transition-slow);
  position: relative;
}

.project-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-xl);
}

.project-card__image {
  aspect-ratio: 4/3;
  overflow: hidden;
}

.project-card__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-slower);
}

.project-card:hover .project-card__image img {
  transform: scale(1.05);
}
```

### Inputs & Forms

```css
.form__input,
.form__select,
.form__textarea {
  width: 100%;
  padding: 16px 20px;
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-family: var(--font-body);
  font-size: 1rem;
  color: var(--color-foreground);
  transition: all var(--transition-fast);
}

.form__input::placeholder,
.form__textarea::placeholder {
  color: var(--color-muted-foreground);
  opacity: 0.7;
}

.form__input:hover,
.form__select:hover,
.form__textarea:hover {
  border-color: var(--color-muted-foreground);
}

.form__input:focus,
.form__select:focus,
.form__textarea:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: var(--focus-ring);
}

.form__input[aria-invalid="true"],
.form__select[aria-invalid="true"],
.form__textarea[aria-invalid="true"] {
  border-color: var(--color-destructive);
}

.form__input[aria-invalid="true"]:focus,
.form__select[aria-invalid="true"]:focus,
.form__textarea[aria-invalid="true"]:focus {
  box-shadow: 0 0 0 3px rgba(192, 57, 43, 0.15);
}
```

### Navigation

```css
.nav__link {
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--color-foreground);
  padding: var(--space-xs) 0;
  position: relative;
  transition: color var(--transition-fast);
}

.nav__link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 1px;
  background: var(--color-accent);
  transition: width var(--transition-base);
}

.nav__link:hover,
.nav__link:focus-visible {
  color: var(--color-accent);
}

.nav__link:hover::after,
.nav__link:focus-visible::after {
  width: 100%;
}
```

---

## Layout & Spacing

### Container
- Max width: 1400px (`--container-max`)
- Padding: 24px (`--container-padding`)

### Section Padding
- Desktop: 96px (`--space-4xl`) vertical
- Tablet: 80px vertical
- Mobile: 64px (`--space-3xl`) vertical

### Grid Systems
- **12-column editorial grid** for complex layouts
- **4-column** for project galleries (desktop)
- **2-column** for tablet
- **1-column** for mobile

### Typography Scale
- **Hero:** clamp(3.5rem, 8vw, 7rem) / line-height: 1.05
- **H1:** clamp(2.5rem, 5vw, 4rem) / line-height: 1.1
- **H2:** clamp(2rem, 4vw, 3rem) / line-height: 1.15
- **H3:** clamp(1.5rem, 3vw, 2.25rem) / line-height: 1.2
- **Body:** 1rem / line-height: 1.7
- **Lead:** 1.125rem / line-height: 1.8
- **Small:** 0.875rem / line-height: 1.6

---

## Animations & Interactions

### Principles
- Tasteful, high-quality motion
- Animations must remain smooth on mobile
- Never interfere with usability
- Respect `prefers-reduced-motion`

### Required Interactions
- Smooth page transitions (view transitions API where supported)
- Navigation hover effects
- Image reveal animations (staggered on scroll)
- Subtle scroll-triggered reveals (IntersectionObserver)
- Elegant button interactions (press, hover, focus)
- Gallery transitions (hover zoom, overlay fade)
- Project card hover effects (lift + image zoom)
- Mobile navigation menu (slide panel)
- Smooth anchor scrolling
- Reduced-motion accessibility support

### Animation Library
- **No external animation library** — use native CSS transitions/animations + IntersectionObserver
- GSAP only if complex scroll-linked animations are needed (not for this build)

---

## Image Requirements

- **Minimum 18-24 visual placements** across complete experience
- **Genuine architectural/interior photography** (no illustrations)
- **Required subjects:** Luxury villas, contemporary residential, minimalist living rooms, natural stone/timber, luxury kitchens, sculptural staircases, boutique hotels, landscape architecture, architectural details, material close-ups, outdoor terraces, poolside architecture
- **High-quality, large-format images**
- **Landscape for project cards, portrait for editorial layouts**
- **Consistent warm, natural photographic treatment**
- **Meaningful alt text for every image**
- **Optimized responsive loading** (srcset, sizes, lazy loading)
- **Never use broken image URLs**

---

## Pages to Build

1. **HOME** - Hero, selected projects, studio intro, services overview, philosophy, testimonials, contact CTA
2. **ABOUT** - Philosophy, design approach, creative process, values, team, photography
3. **PROJECTS** - Portfolio gallery, category filters, masonry grid, hover transitions
4. **PROJECT DETAIL** (×3) - Limestone Residence, Casa Verde, The Quiet House
5. **SERVICES** - Architecture, Interior Design, Residential, Hospitality, Renovation, Spatial Consultation
6. **JOURNAL** - Editorial articles (3 minimum)
7. **CONTACT** - Form with validation, contact details, fictional placeholders

---

## Technical Requirements

- Clean, maintainable, semantic HTML
- Reusable components (CSS methodology: BEM)
- Responsive CSS with mobile-first approach
- Accessible navigation (ARIA, keyboard support)
- Proper form validation (client-side + server-ready)
- SEO titles/descriptions per page
- Open Graph metadata
- Canonical URL strategy
- Sitemap.xml
- Robots.txt
- Favicon set
- Social sharing image (OG image)
- Structured data (Organization, WebSite, Article, Project)
- Performance optimization (lazy loading, preload, minification)
- Proper error handling

**No backend** — this is a static/editorial site. Form submissions show success UI but do not actually submit.

---

## Quality Assurance Checklist

Before delivery, verify:

- [ ] Every page loads without console errors
- [ ] Every navigation link works
- [ ] Every project link navigates correctly
- [ ] Gallery interactions work (hover, keyboard)
- [ ] Mobile navigation opens/closes properly
- [ ] Contact form validates correctly (all fields)
- [ ] Form shows success/error states
- [ ] All images load (no broken images)
- [ ] Responsive at 375px, 768px, 1024px, 1440px
- [ ] No horizontal overflow on mobile
- [ ] Touch targets ≥ 44×44px
- [ ] Accessibility basics: heading hierarchy, alt text, focus states, color contrast 4.5:1
- [ ] `prefers-reduced-motion` respected
- [ ] Build passes (if build step exists)
- [ ] Screenshots captured at desktop, tablet, mobile

---

## Git & Deployment

- Use existing GitHub repository
- Use existing Vercel project
- No secrets in commits
- Preview deployment first
- No production deployment without explicit approval

---

## Anti-Patterns (Do NOT Use)

- ❌ Emojis as icons — Use inline SVG
- ❌ Missing `cursor:pointer` on clickable elements
- ❌ Layout-shifting hovers (no scale on containers that affect flow)
- ❌ Low contrast text — Maintain 4.5:1 minimum
- ❌ Instant state changes — Always use transitions (150-400ms)
- ❌ Invisible focus states
- ❌ Generic SaaS/Card grid layouts
- ❌ Random gradients
- ❌ Excessive rounded corners
- ❌ Overloaded layouts
- ❌ Fake statistics/testimonials presented as real