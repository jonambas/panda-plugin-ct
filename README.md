# panda-plugin-ct

Allows aliases to tokens without generating alias or component level class names.

The plugin allows you to structure your tokens in a way makes sense to you, and does not need to adhere to Panda's token structure.

```ts
// panda.config.ts

import { defineConfig } from '@pandacss/dev';
import { pluginComponentTokens } from 'panda-plugin-ct';

export default defineConfig({
  plugins: [
    pluginComponentTokens({
      alert: {
        background: 'red.500',
        text: 'gray.100',
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
  // Token paths are fully typed
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
.bg_red\.500 {
  background: var(--colors-red-500);
}

/* With component-level tokens in semanticToken */
.bg_alert\.background {
  background: var(--colors-alert-background);
}
```

---

### Supported Syntax

This plugin supports aliasing to Panda's object syntax via a `value` key, just as you would define styles with conditions in Panda's theme.

```ts
// panda.config.ts

export default defineConfig({
  plugins: [
    pluginComponentTokens({
      alert: {
        background: {
          value: {
            base: 'red.500',
            lg: 'blue.500',
          },
        },
        text: {
          value: 'gray.100',
        },
      },
    }),
  ],
});
```

```tsx
<div className={css({
  background: ct('alert.background'),
  color: ct('alert.text'),
})}>
```

Produces:

```html
<div class="bg_red.500 text_gray.900 lg:text_gray.300" />
```
