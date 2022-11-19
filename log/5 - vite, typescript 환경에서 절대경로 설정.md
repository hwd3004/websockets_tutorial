https://l4279625.tistory.com/entry/vite-절대경로-설정하는-법

tsconfig.json과 vite.config.ts 둘 다 설정을 해주어야한다.

```json
// tsconfig.json

{
  "extends": "./.svelte-kit/tsconfig.json",
  "compilerOptions": {
    ...
    "baseUrl": "./",
    "paths": {
      "@/*": ["./*"],
      "@src/*": ["./src/*"]
    }
  }
}
```

```ts
// vite.config.ts

import { sveltekit } from "@sveltejs/kit/vite";
import type { UserConfig } from "vite";
import path from "path";

const config: UserConfig = {
  plugins: [sveltekit()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
      "@src": path.resolve(__dirname, "./src"),
    },
  },
};

export default config;
```
