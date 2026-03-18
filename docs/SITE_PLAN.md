# CrossCollab.tech Development Plan

## Current State Analysis
CrossCollab is an early-stage, modern static landing page hosted via GitHub Pages (served from the `docs/` folder).
- **Frontend Architecture:** Single-file `index.html` with vanilla CSS/JS. Uses CSS grid, flexbox, and CSS variables for a cohesive dark/neon aesthetic.
- **Current Features:** 
  - Dynamic fetching of available open-source projects via the GitHub API (`crosscollabtech` org), with a graceful fallback to hardcoded projects.
  - Responsive design with an expanding/collapsing mobile menu.
  - i18n support (English/Spanish) using vanilla JS data attributes.
  - Form mockup for project submissions (currently preventing default and logging to console).

## Proposed Paths Forward

### Phase 1: MVP Functionality & Backend Integration
The immediate blocker for making the site functional is handling the "Submit a project" form. Since the site is fully static, we need a secure way to process user submissions without exposing API tokens in the browser.

- **Option A (Simple & Fast):** Use an integration like [Formspree](https://formspree.io/) or [Netlify Forms]. Submissions are emailed to admins, who will manually vet them and create the GitHub repo/issue.
- **Option B (Serverless Automation):** Create a lightweight serverless function (e.g., Cloudflare Worker, Vercel API, or GitHub Actions Webhook handler). The function securely holds a GitHub Personal Access Token (PAT) and automatically creates an issue in a central repository (e.g., `crosscollabtech/project-requests`) upon form submission.
- **Option C (Redirect to GitHub):** Drop the on-site form and point the "Submit" buttons directly to custom GitHub Issue templates in a central routing repository.

### Phase 2: Architecture & DX (Developer Experience) Migration
As the project grows, maintaining a 700+ line `index.html` file will become cumbersome. We should consider migrating the codebase before adding too many more features.
- Migrate to a minimal static site generator or bundler such as **Astro**, **Vite (Vanilla/React)**, or **Eleventy**. 
- This enables componentization (separating Header, Footer, ProjectCard, and Form into their own files) and manageable CSS modules/partials, while still building to a purely static `docs/` folder for GitHub Pages.

### Phase 3: Project Discovery Enhancements
Currently, the site loads all repositories from the organization. We can make it easier for contributors to find the right work:
- **Rich Project Pages:** Instead of just linking externally, create a dynamic `project.html?repo=xyz` that uses the GitHub API to render the repository's `README.md`, open issues, and contributor list directly within the CrossCollab branded UI.
- **Advanced Filtering:** Parse repository topics, labels, and languages to allow users to filter by their role (e.g., Designer, Backend, QA) and difficulty (`good-first-issue`).
- **Caching/Build-time Fetching:** To avoid GitHub API rate limits for unauthenticated users, we could transition to fetching this data at build time rather than runtime.

### Phase 4: Contributor Experience
- **Auth (GitHub Login):** Introduce a GitHub OAuth login flow so users can save favorite projects, track their accepted PRs, and get tailored issue recommendations.
- **Impact Metrics:** Display a leaderboard or global metrics showing total lines of code shipped, active contributors, or ministries helped.

---
**Next Step:** Review these options and decide which Phase 1 or Phase 2 path you would like to tackle first. We can begin by connecting the form or restructuring the codebase into components.
