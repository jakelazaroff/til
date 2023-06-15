# Get `__dirname` in ESM

When using ES modules with Node.js, `__dirname` (the path to the file's directory) isn't available. Here's a [short and sweet replacement](https://stackoverflow.com/a/50052194):

```js
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
```
