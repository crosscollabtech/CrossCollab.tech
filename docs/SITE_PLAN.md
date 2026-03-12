# CrossCollab.tech — Site Improvement Plan

## Current State

The site is a single-page static site (`docs/index.html`) served via GitHub Pages. It uses inline CSS/JS, IBM Plex Mono, and zero external JS dependencies. Key sections: hero console, featured projects (fetched live from GitHub API with fallback), how-it-works steps, project submission form, and about.

---

## Phase 1: UI Polish (Completed)

- [x] Fix search icon overlapping placeholder text in the project search bar
- [x] Remove programming language filter buttons (All / JavaScript / Kotlin / Python)
- [x] Enhance project cards — better padding, hover effects, flex layout, accent-colored language chips, inline topic badges
- [x] Search bar now also filters by language name

---

## Phase 2: Project Discovery Enhancements

- [ ] Add sort options to project listing (most recent, most stars, alphabetical)
- [ ] Show project card thumbnails or org avatar images
- [ ] Add pagination or "load more" for orgs with many repos
- [ ] Improve empty state with illustration or call-to-action when no results match
- [ ] Add a category/tag-based filter (e.g., frontend, backend, mobile, data) distinct from language

---

## Phase 3: Form & Submission Improvements

- [ ] Client-side form validation with real-time feedback (highlight errors as user types)
- [ ] GitHub App integration to auto-create issues/repos from the submit form
- [ ] File/image upload support for project descriptions
- [ ] Confirmation step before submission (preview payload)
- [ ] Rate limiting / anti-spam beyond the honeypot field

---

## Phase 4: Content & Localization

- [ ] Complete Spanish (ES) localization for all static content and dynamic card labels
- [ ] Add language switcher persistence (localStorage)
- [ ] Add an FAQ or "Getting Started" section for new contributors
- [ ] Add a "Success Stories" or testimonials section
- [ ] Blog/updates feed (could pull from GitHub Discussions or a simple JSON file)

---

## Phase 5: Performance & Accessibility

- [ ] Lazy-load project cards (Intersection Observer)
- [ ] Add `preconnect` hints for Google Fonts and GitHub API
- [ ] Audit and improve color contrast ratios (WCAG AA minimum)
- [ ] Add skip-to-content link for keyboard navigation
- [ ] Test and fix screen reader flow for dynamic content (card rendering, form errors)
- [ ] Add Open Graph and Twitter Card meta tags for link previews

---

## Phase 6: Platform Features

- [ ] Contributor profiles — link GitHub accounts, show skills and availability
- [ ] Project matching — suggest projects based on contributor skills/interests
- [ ] Notification system — email digest of new projects or matched needs
- [ ] Dashboard for project owners to track interest and contributor sign-ups
- [ ] GitHub API integration for live issue counts, PR activity, and contributor stats on cards

---

## Technical Constraints

- **No build step** — all changes are inline HTML/CSS/JS in `docs/index.html`
- **No external JS** — keep the site dependency-free
- **GitHub Pages hosting** — static files only, no server-side logic
- **Design tokens** — use existing CSS custom properties (see `CLAUDE.md`)
- If a feature requires a backend, plan it as a separate service (GitHub App, serverless function, etc.)

---

## Design Principles

1. **Simple first** — the minimum needed for the current task
2. **Accessible** — semantic HTML, ARIA labels, focus styles, contrast
3. **Faith-safe** — ministry-friendly copy, inclusive, non-divisive
4. **Open source** — MIT/Apache-2.0, transparent, community-driven
