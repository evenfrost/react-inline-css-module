# @evenfrost/react-inline-css-module

Vite plugin that rewrites `styleName` (and other configured props) to module-scoped `className` values, matching the behavior of `babel-plugin-react-css-modules` without needing Babel.

## Why
- Use CSS Modules with `styleName` syntax in Vite/React projects.
- Works with multiple imported CSS Module files per component.
- Respects your prop ordering when merging `styleName` and `className`.
- Emits warnings for missing class keys or non-string `styleName` props.
- Supports custom `*StyleName` props mapped to arbitrary class props.

## Install
```bash
npm install @evenfrost/react-inline-css-module
# or
yarn add @evenfrost/react-inline-css-module
```

## Vite setup
```ts
// vite.config.ts
import react from '@vitejs/plugin-react';
import reactStylename from '@evenfrost/react-inline-css-module';

export default {
  plugins: [
    react(),
    reactStylename({
      attributeNames: {
        // sourceProp: targetClassProp
        styleName: 'className',            // default
        activeStyleName: 'activeClassName' // custom
      },
      // reactVariableName: 'React',      // change if you use a different React import name
    }),
  ],
};
```

## Options
- `attributeNames?: Record<string, string>`  
  Map of props that should be treated like `styleName`. Keys are the props containing CSS Module keys; values are the props that receive the transformed class string. Defaults to `{ styleName: "className" }`.
- `reactVariableName?: string`  
  If you import React under a different name, set it here so `React.createElement` calls are wrapped correctly.

## Usage
```css
/* style.module.css */
.app { color: #777; }
.info { color: green; }
```

```tsx
import './style.module.css';

export function App() {
  return (
    <div styleName="app">
      <div>content</div>
      <div styleName="info">info</div>
    </div>
  );
}
```

### Custom attribute example
`examples/custom-attributes` contains a runnable demo. Minimal setup:
```ts
// vite.config.ts
reactStylename({
  attributeNames: {
    togglerStyleName: "togglerClassName",
    bodyStyleName: "bodyClassName",
    wrapperStyleName: "wrapperClassName",
  },
});
```
```tsx
// examples/custom-attributes/App.tsx
import "./style.module.css";

export function Dropdown({ open }: { open: boolean }) {
  return (
    <div wrapperStyleName="wrapper" wrapperClassName="dropdown-wrapper">
      <button togglerStyleName="toggler" togglerClassName="dropdown-btn">
        Toggle
      </button>
      <div
        bodyStyleName={open ? "bodyOpen" : "bodyClosed"}
        bodyClassName="dropdown-body"
      >
        Content
      </div>
    </div>
  );
}
```
Run the demo locally:
```bash
npm run example:dev
```

## TypeScript setup
Add the plugin’s JSX typings so custom `*StyleName` props are recognized:
```ts
// global.d.ts
/// <reference types="vite/client" />
/// <reference types="@evenfrost/react-inline-css-module/types/style-name" />
```
Or add to `tsconfig.json`:
```json
{
  "compilerOptions": {
    "types": ["@evenfrost/react-inline-css-module/types/style-name"]
  }
}
```

## Scripts
- `npm run build` — compile TypeScript and bundle the plugin.
- `npm test` — run Vitest suite.
- `npm run example:dev` — start the custom-attribute demo (Vite dev server).
- `npm run example:build` — build the demo.

## Notes
- Only transforms `.jsx`/`.tsx` files.
- Warnings are logged when a referenced CSS Module key is missing or when a style prop is not a string.
