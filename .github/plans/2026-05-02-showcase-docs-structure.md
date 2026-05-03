# Showcase Docs Structure

## Overview
This plan reorganizes the current single-page showcase into a multi-page documentation site with clear sections, similar to established style libraries. The goal is to make the theme easier to navigate, test, and extend by component category while keeping the current static hosting model.

## Phases
### Phase A - Information Architecture
1. [x] Define initial page set and navigation model for docs-style browsing.
2. [x] Establish shared layout classes for header, nav, content, and page sections.

### Phase B - Shared Assets
1. [x] Extract shared client behavior (theme toggle + font status) into a reusable script.
2. [x] Expand showcase CSS to support docs shell, sidebar nav, and responsive page layout.

### Phase C - Page Split
1. [x] Convert current `showcase/index.html` into a docs home/introduction page.
2. [x] Create component-focused pages (Typography, Buttons, Forms, Feedback, Data Display).
3. [x] Ensure each page links to shared CSS and JS and marks active nav item.

### Phase D - Validation
1. [x] Verify all new showcase pages load with correct relative paths under `/showcase/`.
2. [x] Verify theme toggle + font-status behavior works on every page.
3. [x] Run diagnostics and spot-check mobile layout behavior.

## Relevant Files
| File | Purpose |
| --- | --- |
| `showcase/index.html` | Existing single-page showcase to restructure into docs home |
| `showcase/showcase.css` | Showcase-specific layout and component demo styles |
| `showcase/showcase.js` | New shared behavior for theme toggle, active nav, and font status |
| `showcase/components.html` | New page for core component examples |
| `showcase/forms.html` | New page for form controls and validation states |
| `showcase/feedback.html` | New page for badges, alerts, and notifications |
| `showcase/data-display.html` | New page for tables and data visualization patterns |

## Verification
- Open each page directly at `/showcase/<page>.html` and verify no missing assets.
- Toggle theme on each page and confirm state persists across page loads.
- Confirm font status indicator resolves correctly where shown.
- Check responsive behavior at narrow viewport widths.

## Decisions
- Start with a pragmatic set of docs pages to establish structure before adding deeper component coverage.
- Keep static HTML files (no build step) for easy local serving and GitHub Pages compatibility.
- Use one shared JS file to avoid behavior duplication and drift across pages.
