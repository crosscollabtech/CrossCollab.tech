# CrossCollab.tech — Claude Code Guide

## Project Overview

CrossCollab is an open, community-driven platform connecting **ministries, NGOs, churches, and missionaries** with **Christian technologists** to build open-source software that serves real needs.

- **Tagline:** Code with purpose. Build for the Kingdom.
- **License:** MIT / Apache-2.0 preferred for all projects hosted here
- **Hosting:** GitHub Pages (served from `docs/`)
- **Primary language:** HTML, CSS, vanilla JavaScript (no build step)

## Repository Structure

```
CrossCollab.tech/
├── docs/
│   └── index.html       # Main public website (GitHub Pages root)
├── README.md            # Project overview and vision
├── LICENSE
└── CLAUDE.md            # This file
```

## Development Guidelines

### Making Changes

- The public site lives entirely in `docs/index.html`. Edit that file to change what visitors see.
- There is **no build system**, package manager, or bundler — changes to `docs/index.html` are live after a push to `main`.
- Keep all CSS and JS inline inside `index.html` (current pattern) unless there is a strong reason to extract files.
- The site uses `IBM Plex Mono` from Google Fonts and zero external JS dependencies.

### Branch Strategy

- Default branch: `main`
- All feature work goes on a `claude/<description>` branch, then opens a PR to `main`.
- Never push directly to `main`.

### Design Tokens (CSS custom properties)

| Token | Value | Usage |
|---|---|---|
| `--bg` | `#0c0b1c` | Page background |
| `--bg-2` | `#141331` | Secondary background |
| `--text` | `#e7f5ff` | Body text |
| `--title` | `#e87324` | Headings / brand orange |
| `--accent` | `#70a699` | Links, borders, buttons |
| `--muted` | `#b5c9d9` | Secondary text |
| `--border` | `#2d2b5a` | Card/component borders |

### Content Principles

- **Faith-safe language:** Keep copy ministry-friendly, inclusive, and non-divisive.
- **Open source first:** Default suggested licenses are MIT or Apache-2.0.
- **Accessibility:** Maintain `aria-` labels, semantic HTML, and `:focus-visible` styles already in place.
- **Security & stewardship:** Particularly important for features handling user data (the submit form). Never log or expose PII; validate on both client and server when a backend exists.

## Key Sections in `index.html`

| Section ID | Purpose |
|---|---|
| `#projects` | Featured project cards ("missions") |
| `#how` | Step-by-step "how it works" flow |
| `#submit` | Project submission form (currently demo/console.log only) |
| `#about` | Platform values and philosophy |

## Planned / In-Progress Features

- GitHub App integration to auto-scaffold repos from the submit form (currently a `console.log` demo).
- Expanded project listing pulled from GitHub API.
- Spanish localization.

## Running Locally

No installation needed. Simply open `docs/index.html` in a browser, or serve it with any static file server:

```bash
# Python
python3 -m http.server 8080 --directory docs

# Node (npx)
npx serve docs
```

## Commit Style

Use short, imperative commit messages:

```
Add dark-mode toggle to header
Fix form reset not clearing type-specific fields
Update featured missions section with new projects
```
