# panda-plugin-ct

Allows aliases to tokens while preserving atomic class names.

```ts
// panda.config.ts

import { defineConfig } from "@pandacss/dev";
import { pluginComponentTokens } from "panda-plugin-ct";

export default defineConfig({
  plugins: [
    pluginComponentTokens({
      alert: {
        background: "red.500",
        text: "gray.100",
      },
    }),
  ],
});
```

```tsx
// Component code

import { css, ct } from "../../styled-system/css";

<div className={css({
  display: 'flex',
  background: ct('alert.background')
})}>

```

Which will produce:

```html
<!-- With ct -->
<div class="d_flex bg_red.500" />

<!-- With component-level tokens in semanticToken -->
<div class="d_flex bg_alert.background" />
```

```css
/* With ct */
--colors-red-500: #ef4444;

/* With component-level tokens in semanticToken */
--colors-alert-background: var(--colors-red-500);

.d_flex {
  display: flex;
}

/* With ct */
.bg_colors\.red\.500 {
  background: var(--colors-red-500);
}

/* With component-level tokens in semanticToken */
.bg_colors\.alert\.background {
  background: var(--colors-alert-background);
}
```
