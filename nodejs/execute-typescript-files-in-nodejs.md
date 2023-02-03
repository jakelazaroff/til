# Execute TypeScript files in Node.js

One annoying thing about using TypeScript with Node.js is that you mostly can't — you either need to transpile all your files before running `node`, or use a "wrapper" interpreter like [ts-node](https://www.npmjs.com/package/ts-node) or [tsx](https://www.npmjs.com/package/tsx). It looks like that's changing with [an experimental feature called loaders that lets you hook into the module loading process](https://nodejs.org/api/esm.html#loaders). Node.js still expects that you give it JavaScript, but the loaders let you convert files into JavaScript as they're imported, before Node.js gets its hands on them.

(Note that as of February 2023, the Node.js Loaders API is marked as unstable, meaning that this code may stop working if it changes).

Raphael Medaer has [a minimal example with a CSS loader](https://raphael.medaer.me/2022/01/28/fun-with-node-experimental-modules-and-loaders.html). Loading TypeScript is a bit more involved (mostly because [TypeScript module resolution is complicated](https://www.typescriptlang.org/docs/handbook/module-resolution.html#how-typescript-resolves-modules), since you can do things like omit the extension) but here's my best attempt at it.

The code will all go into a file called `loader.mjs`, which gets used like this:

```sh
node --experimental-loader ./loader.mjs filetorun.ts
```

There are two functions here, hooking into two steps:

- [resolve](https://nodejs.org/api/esm.html#resolvespecifier-context-nextresolve) receives a module specifier (the `./foo` of `import "./foo"`) and parent URL (the full path to the importing file, such as `file:///Users/jake/filetorun.ts`). The job of this function is to return the URL of the imported file (in this example, `file:///Users/jake/foo.ts`).
- [load](https://nodejs.org/api/esm.html#loadurl-context-nextload) receives the URL returned from the `resolve` function; its job is to return the file contents as JavaScript.

```js
import * as fs from "node:fs/promises";
import * as path from "node:path";
import { pathToFileURL, URL } from "node:url";

import ts from "typescript";

export async function resolve(specifier, context, next) {
  // if there's no parent, use node's normal module resolution
  if (!context.parentURL) return next(specifier, context, next);

  // if the specifier isn't a file path, use node's normal module resolution
  if (!/^(file:\/{3}|\.{0,2}\/{1,2})/.test(specifier)) return next(specifier, context, next);

  // handle an edge case in which the `URL` constructor interprets a leading `//` as an HTTP protocol
  const fixed = specifier.replace(/^\/{2}/, "/");

  // get the full import specifier, including the parent URL
  const importpath = new URL(fixed, context.parentURL).pathname;

  // remove the extension from the import path
  const base = importpath.replace(/\.[^/.]+$/, "");

  // create a list of possible paths
  const paths = [
    base + ".ts",
    base + ".tsx",
    path.join(base, "index.ts"),
    path.join(base, "index.tsx")
  ];

  // iterate through each path
  for (const file of paths) {
    // check whether the file exists
    const exists = await fs
      .stat(file)
      .then(() => true)
      .catch(() => false);

    // if a typescript file exists, continue module resolution with that file's url
    if (exists) return next(pathToFileURL(file).href, context, next);
  }

  // if no typescript file is found, just continue with node's normal module resolution
  return next(specifier, context, next);
}

export async function load(url, context, next) {
  // if the file extension isn't .ts or .tsx, use node's normal module loading
  if (!/\.tsx?$/.test(url)) return next(url, context, next);

  // read the file from disk
  const source = await fs.readFile(new URL(url));

  // transpile the file to javascript
  const { outputText: result } = ts.transpileModule(source.toString(), {
    compilerOptions: { target: "esnext", module: "esnext" }
  });

  // return the transpiled source code
  return { shortCircuit: true, format: "module", source: result };
}
```

Some notes on the module resolution:

- If `context.parentURL` is undefined in `resolve`, it means the file was passed directly to `node` as a command line argument. If that's the case, assume it's a real file and skip any further custom resolution.
- `resolve` only attempts to find files whose specifiers begin with `/`, `//`, `./`, `../` or `file:///`. More information about module resolution can be found in the [Node.js documentation on ECMAScript modules](https://nodejs.org/api/esm.html#terminology).
- Technically, ECMAScript modules require the import specifier to include an extension (`import "./foo.js"` is valid; `import "./foo"` is not). In practice, most bundlers allow you to omit the extension. This `resolve` function should work whether or not the extension is present.

If a faster transpiler such as [esbuild](https://esbuild.github.io) is already one of the project dependencies, it probably makes sense to use that instead of the default TypeScript one:

```js
// transpile the file to javascript
const { code: result } = await esbuild.transform(source, { loader: "ts" });
```
