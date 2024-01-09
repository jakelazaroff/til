# Migrate from Create React App

I just tried to get [SongRender](https://songrender.com/) running again. I started the React codebase in 2018 with [Create React App](https://create-react-app.dev/) — a choice that, six years later, has aged poorly.

I spent a couple hours trying to get it up and running again, broke a production deploy, kept trying for a bit and then decided to follow [this recommendation from Augustinus Nathaniel](https://twitter.com/sozonome/status/1744738854677131461) to migrate to Rsbuild.

What's Rsbuild? An ["Rspack-based build tool"](https://www.rsbuild.dev). What's Rspack? A ["fast Rust-based web bundler"](https://www.rspack.dev), one of the many native bundlers that have been popping up to speed up the JavaScript ecosystem. I'm not sure why there are two layers here, but I'm sure they have their reasons.

Anyway. Particularly notable about Rspack is their stated goal of [maximizing webpack compatibility](https://www.rspack.dev/guide/migrate-from-webpack.html). While I don't necessarily think that would the best priority for a greenfield tool, it does make sense for migrating from Create React App, which uses webpack under the hood.

Rsbuild has [a guide for migrating from Create React App](https://rsbuild.dev/guide/migration/cra). Here are the parts I needed to do:

1. Replace Create React App with Rsbuild. SongRender uses Yarn (another poor decision, but a story for another day) which is why I'm using it here:

   ```bash
   yarn remove react-scripts
   yarn add @rsbuild/core @rsbuild/plugin-react -D
   ```

2. Update the `start` and `build` scripts in `package.json`:

   ```json
   {
     "scripts": {
       "start": "rsbuild dev",
       "build": "rsbuild build"
     }
   }
   ```

3. Create an `rsbuild.config.ts` configuration file. Here's what I ended up with:

   ```ts
   import { defineConfig } from "@rsbuild/core";
   import { pluginReact } from "@rsbuild/plugin-react";
   import { pluginSvgr } from "@rsbuild/plugin-svgr";

   export default defineConfig({
     plugins: [pluginReact(), pluginSvgr()],
     html: { template: "./public/index.html" },
     output: { distPath: { root: "build" } },
     server: {
       proxy: {
         "/api": { target: "http://localhost:3001", pathRewrite: { "^/api": "" } },
         "/api": {
           target: "https://songrender-local.nyc3.digitaloceanspaces.com",
           pathRewrite: { "^/downloads": "" }
         }
       }
     }
   });
   ```

   - The [React plugin](https://rsbuild.dev/plugins/list/plugin-react), um, provides support for React.
   - The [SVGR plugin](https://rsbuild.dev/plugins/list/plugin-svgr) supports Create React App's feature that lets you [import SVGs as React components](https://create-react-app.dev/docs/adding-images-fonts-and-files/#adding-svgs). That's a bad idea — SVGs should be in a separate sprite sheet! — but it was the decision I made in 2018 and now was not the time to change it.
   - The `html` object defines the path to the [HTML index file](https://rsbuild.dev/guide/basic/html-template) that bootstraps the single page app.
   - The `output` object changes the build directory (`build` in Create React App, `dist` in Rsbuild).
   - The [proxy server](https://rsbuild.dev/config/server/proxy) proxies API requests in development, replicating [a similar Create React App feature](https://create-react-app.dev/docs/proxying-api-requests-in-development/).

4. Rsbuild injects environment variables starting with `PUBLIC_` rather than `REACT_APP_`. It has [an option to replicate Create React App's behavior](https://rsbuild.dev/guide/migration/cra#environment-variables), but I just went through and changed the names.

5. I had used the [`workerize-loader`](https://github.com/developit/workerize-loader) library to circumvent Create React App's lack of support for Web Workers. That broke — but luckily, [Rspack supports web workers out of the box](https://rspack.org/guide/web-workers), using syntax much closer to the actual Web Workers syntax. Switching over was fairly seamless.

Finished! Not sure that Rsbuild will be my first choice bundler going forward, but it did save me from Create React App and unmaintained dependency hell.
