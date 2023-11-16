# Get `__dirname` in ESM

When using ES modules with Node.js, `__dirname` (the path to the file's directory) isn't available. Here's a [short and sweet replacement](https://stackoverflow.com/a/50052194):

```js
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
```

**Update:** As of [Node 21.2.0](https://nodejs.org/en/blog/release/v21.2.0), `__filename` and `__dirname` are natively available as `import.meta.filename` and `import.meta.dirname`, respectively.
