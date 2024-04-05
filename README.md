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
        background: "{colors.red.100}",
        text: "{colors.text.100}",
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
