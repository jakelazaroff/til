# Generate a static SVG sprite sheet

Since learning about [SVG sprite sheets](/svg/create-an-svg-sprite-sheet.md), I've used them rather than SVGs inlined in HTML.

Generally, my process looks something like this:

1. Put all my SVGs in a folder.
2. Run [`svg-sprite`](https://www.npmjs.com/package/svg-sprite) on the command line to combine them into a single SVG sprite.
3. Include them in HTML with the `<use>` tag.

I usually run it out of band, immediately before actually building the website. My build command ends up looking something like `pnpm svg && pnpm build` (where those are both `package.json` scripts that build the sprite sheet and the rest of the site).

No longer! At least for Astro sites. Arne Bahlo has a great tutorial on [statically generating open graph images using Astro API routes](https://arne.me/articles/static-og-images-in-astro), and I realized that the same technique will work to generate SVG sprite sheets.

The key insight is that in static mode, [API routes](https://docs.astro.build/en/core-concepts/endpoints/#server-endpoints-api-routes) get rendered to static files. So this roughly the same workflow, except `svg-sprite` gets called programmatically instead of on the command line.

Enough introduction! Let's get to it.

First, install `svg-sprite` (and `@types/svg-sprite` if you're using TypeScript).

Then, add this `icons.svg.js` file to your `pages` directory:

```js
import { readdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import SVGSpriter from "svg-sprite";

const ICON_DIR = "./assets/icons";

export const GET = async function GET() {
  // create an `svg-sprite` instance
  const spriter = new SVGSpriter({ mode: { symbol: true } });

  // add all the svgs
  for (const svg of await readdir(ICON_DIR)) {
    const path = resolve(ICON_DIR, svg);
    spriter.add(path, svg, await readFile(path).then(file => file.toString()));
  }

  // compile the svgs into a sprite sheet
  const { result } = await spriter.compileAsync();

  // respond with the compiled svg
  const svg = result.symbol.sprite.contents;
  return new Response(svg, { headers: { "content-type": "image/svg+xml" } });
};
```

Every time there's a request to `/icons.svg`, that will read all the SVGs in `/assets/icons`, compile them to a sprite sheet and respond with it. That sounds inefficient, but remember that "every time there's a request" only happens in development; for production, the handler runs once at build time and the generated SVG file is written to disk.

To actually use the resulting sprite, I have this Astro component:

```astro
---
interface Props {
  icon: string;
  size?: number;
}

const { icon, size = 16 } = Astro.props;
---

<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size}>
  <use href={`/icons.svg#${icon}`}></use>
</svg>
```

The `icon` prop is equal to whatever the file name of the original SVG was, minus the extension. So you'd use it like this:

```astro
<Icon icon="heart" />
```
