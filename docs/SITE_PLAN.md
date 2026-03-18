# CrossCollab.tech Development Plan

## Strategy: Zero-Cost Architecture
Given the priority to keep this project as free as possible, all infrastructure and development decisions will default to 100% free tiers. We will leverage the generous allowances of platforms like GitHub, Cloudflare, and Vercel, ensuring the project can scale without incurring monthly operational costs.

## Current State Analysis
CrossCollab is an early-stage, modern static landing page hosted via GitHub Pages (served from the `docs/` folder) — currently **$0/month**.
- **Frontend Architecture:** Single-file `index.html` with vanilla CSS/JS.
- **Current Features:** 
  - Dynamic fetching of available open-source projects via the GitHub API (Free).
  - Responsive design with an expanding/collapsing mobile menu.
  - i18n support (English/Spanish).
  - Form mockup for project submissions (needs a free backend solution).

## Proposed Paths Forward

### Phase 1: MVP Functionality & Backend Integration (Zero-Cost Focus)
To handle the "Submit a project" form without paying for a form-handling service:

- **Option A (100% Free - GitHub native):** Drop the on-site form and change the "Submit" buttons to link directly to custom **GitHub Issue templates** in a central routing repository. This requires zero setup of backend infrastructure, prevents spam natively, and never costs money.
- **Option B (100% Free - Serverless Automation):** Create a lightweight serverless function using **Cloudflare Workers** (100,000 free requests/day). The function securely holds a GitHub Personal Access Token (PAT) and automatically creates an issue in a secure repo when the form is submitted. This provides a seamless user experience on the site while remaining completely free.

*(Note: We will avoid services like Formspree as they have strict free-tier limits that a growing community might quickly outgrow).*

### Phase 2: Architecture & DX Migration (Zero-Cost Focus)
As the project grows, maintaining a 700+ line `index.html` file will become cumbersome. We should migrate the codebase before adding too many more features.
- Migrate to a minimal static site generator or bundler such as **Astro** or **Vite (Vanilla/React)**. 
- The output remains purely static and will continue to be hosted on **GitHub Pages for free**.
- This enables componentization (separating Header, Footer, ProjectCard, and Form) without changing our hosting strategy.

### Phase 3: Project Discovery Enhancements
Currently, the site loads all repositories from the organization.
- **Rich Project Pages:** Create dynamic `project.html?repo=xyz` pages that use the GitHub API to render the repository's data directly within the CrossCollab branded UI.
- **Build-time Fetching (GitHub Actions):** To avoid hitting GitHub API rate limits for unauthenticated users, we can use **GitHub Actions (free for public repos)** to fetch this data at build time and deploy it as static JSON files. This ensures the site remains fast and free, regardless of traffic.

### Phase 4: Contributor Experience
- **Auth (GitHub Login):** Introduce GitHub OAuth login to allow users to save favorite projects and track their PRs without needing a separate, paid database.

---
**Next Step:** I highly recommend we start with either **Option A** (GitHub Issue templates) for immediate zero-cost form handling, or **Option B** (Cloudflare Worker) if you prefer to keep users on the site. Alternatively, we can migrate the codebase to Astro/Vite now to make future additions easier. Which would you like to tackle first?
