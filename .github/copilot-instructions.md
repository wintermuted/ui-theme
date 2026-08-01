# Copilot Instructions for ui-theme

## Project overview

`@wintermuted/ui-theme` is a shared CSS/JS design-system package that publishes design tokens, base resets, and component styles. It is distributed via npmjs.

## Repository structure

```
styles/
  tokens.css          # Design tokens (colours, spacing, typography, etc.)
  base.css            # CSS reset and base element styles
  components.css      # Barrel file that imports all component stylesheets
  components/         # One CSS file per component (card, button, badge, …)
index.css             # Public CSS entry point
index.js              # Public JS entry point (re-exports styles as ES module)
showcase/             # Static HTML/CSS documentation site for the component library
scripts/              # Helper shell scripts (link-local, unlink-local)
```

## Coding conventions

- All styling is plain CSS — no preprocessors (Sass, Less, PostCSS) are used.
- Design tokens are defined as CSS custom properties in `styles/tokens.css` and must be used throughout component stylesheets instead of hard-coded values.
- Each component lives in its own file under `styles/components/` and must also be registered in `styles/components.css` (barrel import) and in the `exports` map in `package.json`.
- The showcase site uses `.component-index` + `.component-card` for card-style navigation tiles on documentation pages.
- Versioning is fully automated: merging to `main` triggers `auto-release.yml`, which bumps the patch version, creates a tag, and publishes a GitHub Release. Do **not** manually edit the version in `package.json`.

## Development workflow

- Serve the showcase locally with `npm run showcase:serve` (starts a Python HTTP server on port 4174).
- Link the package locally for integration testing with `npm run link:local` / `npm run unlink:local`.
- There are no unit tests or linting scripts — validate changes by inspecting the showcase site.

## Pull request guidelines

- Keep component stylesheets focused and scoped; avoid cross-component style leakage.
- When adding a new component, update `styles/components.css`, `package.json` exports, the showcase `components.html` page, and `showcase/index.html` navigation as needed.
- Commit messages should follow conventional commits (`feat:`, `fix:`, `chore:`, `docs:`).
- If a branch or PR has already been merged, start from the latest `main`, create a new branch, and open a new PR. Do not continue work on merged PR branches unless explicitly requested.
