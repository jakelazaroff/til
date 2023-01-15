# Running a development server with live reload

[esbuild](https://github.com/evanw/esbuild) is a great batteries-included bundler for frontend web projects.

This is a one line shell command that will run a development web server and reload the page every time a file changes (broken up into multiple lines here for readability). I tend to put it in the `scripts` object of a project's `package.json` file.

```sh
esbuild src/index.html index.ts src/style.css \
  --bundle --watch \
  --outdir=build --servedir=build \
  --loader:.html=copy \
  --inject:src/livereload.js
```

It assumes the project structure looks like this:

```
src/
├── index.html
├── index.ts
├── style.css
└── livereload.js
```

Line by line, here's what the command does:

- `esbuild src/index.html index.ts src/style.css` runs esbuild using the three files listed as entrypoints.
- `--bundle` combines all the imports
from the TypeScript entrypoint into a single `.js` file.
- `--watch` runs another build whenever an entrypoint or any of its dependencies change.
- `--outdir=build` places bundled and copied files into the `build` directory.
- `--servedir=build` serves static content from the `build` directory if a request path doesn't match any generated files. This is how `index.html` gets served.
- `--loader:.html=copy` tells esbuild to use the [copy loader](https://esbuild.github.io/content-types/#copy) for any files ending `.html`, copying them unchanged to `outdir`. This also gets triggered when the HTML file changes.
- `--inject:src/livereload.js` adds the comments of `src/livereload.js` to the generated output. The reason to enable it this way is that the build command can simply omit this flag to not include the live reload code in the production bundle.

`src/liveroad.js` is pulled straight from the [esbuild documentation on live reloading](https://esbuild.github.io/api/#live-reload):

```js
new EventSource("/esbuild").addEventListener("change", () => location.reload());
```