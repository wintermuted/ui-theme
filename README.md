# `@wintermuted/ui-theme`

Shared design tokens and base component styles for Wintermuted projects.

The package is derived from the styling language introduced in the CV project and extracts the reusable parts of that system so application repositories can depend on a single source of truth instead of copying CSS.

## Install

### GitHub Packages

```bash
echo "@wintermuted:registry=https://npm.pkg.github.com" >> ~/.npmrc
export NODE_AUTH_TOKEN=YOUR_GITHUB_TOKEN
npm install @wintermuted/ui-theme
```

### GitHub repository release

If you prefer to consume the package directly from GitHub without GitHub Packages auth, install from a tagged release:

```bash
npm install github:wintermuted/ui-theme#v0.1.0
```

## Includes

- Core color, spacing, radius, shadow, and typography tokens
- Base document and form-control styling
- Shared surface, button, badge, and table primitives
- Light and dark theme variables via `[data-theme="dark"]`

## Usage

```ts
import "@wintermuted/ui-theme";
```

Then use the exported CSS variables in application styles:

```css
.app-shell {
  color: var(--wm-color-text);
  background: var(--wm-color-surface);
  border: 1px solid var(--wm-color-border);
}
```

## Notes

- The package intentionally avoids application-specific layout opinions.
- Projects should keep product-specific selectors and layout rules in their own repositories.
- Publishing is handled through GitHub Packages via GitHub Actions, so the package can stay on GitHub's registry instead of npmjs.
