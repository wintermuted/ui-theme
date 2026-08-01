# `@wintermuted/wintermuted-ui-library`

Shared design tokens and base component styles for Wintermuted projects.

The package is derived from the styling language introduced in the CV project and extracts the reusable parts of that system so application repositories can depend on a single source of truth instead of copying CSS.

## Install

### GitHub Packages

```bash
echo "@wintermuted:registry=https://npm.pkg.github.com" >> ~/.npmrc
export NODE_AUTH_TOKEN=YOUR_GITHUB_TOKEN
npm install @wintermuted/wintermuted-ui-library
```

### GitHub repository release

If you prefer to consume the package directly from GitHub without GitHub Packages auth, install from a tagged release:

```bash
npm install github:wintermuted/wintermuted-ui-library#v0.1.0
```

## Includes

- Core color, spacing, radius, shadow, and typography tokens
- Base document and form-control styling
- Shared surface, button, badge, tag, list, separator, and side-nav primitives
- Light and dark theme variables via `[data-theme="dark"]`

## Usage

### Full Theme (single import)

```ts
import "@wintermuted/wintermuted-ui-library";
```

Then use the exported CSS variables in application styles:

```css
.app-shell {
  color: var(--wm-color-text);
  background: var(--wm-color-surface);
  border: 1px solid var(--wm-color-border);
}
```

### Modular Imports (factor by need)

Import only the slices you need. Most component files require tokens, and many apps also want base element styles.

```ts
import "@wintermuted/wintermuted-ui-library/styles/tokens.css";
import "@wintermuted/wintermuted-ui-library/styles/base.css";
import "@wintermuted/wintermuted-ui-library/styles/components/button.css";
import "@wintermuted/wintermuted-ui-library/styles/components/card.css";
```

Available modular entry points:

- `@wintermuted/wintermuted-ui-library/styles/tokens.css`
- `@wintermuted/wintermuted-ui-library/styles/base.css`
- `@wintermuted/wintermuted-ui-library/styles/components.css` (all components)
- `@wintermuted/wintermuted-ui-library/styles/components/button.css`
- `@wintermuted/wintermuted-ui-library/styles/components/card.css`
- `@wintermuted/wintermuted-ui-library/styles/components/badge.css`
- `@wintermuted/wintermuted-ui-library/styles/components/tag.css`
- `@wintermuted/wintermuted-ui-library/styles/components/list.css`
- `@wintermuted/wintermuted-ui-library/styles/components/separator.css`
- `@wintermuted/wintermuted-ui-library/styles/components/side-nav.css`


## Static Design System Test Page

This repo includes a static showcase app for validating common component scenarios.

```bash
npm run showcase:serve
```

Then open `http://localhost:4174/showcase/`.

Helpful local viewing scripts:

```bash
npm run showcase:open
npm run showcase:open:sample-data
npm run showcase:open:forms
```

The showcase includes:

- Light and dark theme toggle
- Buttons, badges, cards, and alerts
- Form controls and focus states
- A representative data table
- A sample-data page that renders stats, chart bars, and table rows from one dataset

Files:

- `showcase/index.html`
- `showcase/sample-data.html`
- `showcase/showcase.css`

## GitHub Pages Deployments

The showcase is deployed with a preview/main pattern:

- Pushes to `main` publish production content to the root Pages site.
- Pull requests to `main` publish isolated previews under `previews/pr-<number>/showcase/`.
- Closing a pull request removes its preview folder from `gh-pages`.

Workflows:

- `.github/workflows/deploy-showcase-pages.yml`
- `.github/workflows/cleanup-showcase-preview.yml`

## Local Symlink Workflow (No Publish Step)

Use npm link to symlink this theme into local consuming apps so style changes appear immediately.

From this repo:

```bash
npm run link:local -- <consumer-path> [consumer-path-2 ...]
```

Workspace example:

```bash
npm run link:local -- ../sub-killer ../cv
```

When done testing, revert consumers back to normal package resolution:

```bash
npm run unlink:local -- ../sub-killer ../cv
```

Scripts:

- `scripts/link-local.sh`
- `scripts/unlink-local.sh`
## Notes

- The package intentionally avoids application-specific layout opinions.
- Projects should keep product-specific selectors and layout rules in their own repositories.
- Publishing is handled through GitHub Packages via GitHub Actions, so the package can stay on GitHub's registry instead of npmjs.
