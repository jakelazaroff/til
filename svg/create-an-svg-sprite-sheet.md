# Create an SVG sprite sheet

It's [bad practice to embed SVGs within your JavaScript bundle](https://web.archive.org/web/20220615153016/https://twitter.com/_developit/status/1382838799420514317), since it increases the bundle size and therefore download and parsing time.

Jacob Groß has [a good post on all the alternatives and their tradeoffs](https://kurtextrem.de/posts/svg-in-js), but the TL;DR is that the best way in most cases is to create SVG sprite sheets and include them in the HTML.

SVG sprite sheets look something like the following:

```html
<svg xmlns="http://www.w3.org/2000/svg">
  <defs>
    <symbol id="icon1">
      <!-- the content of the SVG goes in here -->
    </symbol>
    <symbol id="icon2">
      <!-- the content of the SVG goes in here -->
    </symbol>
  </defs>
</svg>
```

The contents of each individual SVG goes inside a `<symbol>` tag identified by a unique ID. That `<symbol>` tag is also where attributes on the individual SVG's `<svg>` tag (like `viewBox`, etc) should go. Those all go within a `<defs>` tag.

To use a particular symbol from the sprite sheet, there's the `<use>` tag. It's used like this:

```html
<svg xmlns="http://www.w3.org/2000/svg">
  <use href="/path/to/spritesheet.svg#icon1" />
</svg>
```

To actually maintain the sprite sheet, there's a tool called (appropriately enough) [`svg-sprite`](https://www.npmjs.com/package/svg-sprite). A command to take a directory of SVGs and combine them into a single sprite sheet might look like this:

```bash
svg-sprite --symbol \
  --symbol-dest src \
  --symbol-sprite icons.svg \
  icons/*.svg
```

Here's what it does:

- `--symbol` enables [symbol mode](https://github.com/svg-sprite/svg-sprite/blob/HEAD/docs/configuration.md#defs--symbol-mode)
- `--symbol-dest src` sets the output directory to `src`
- `--symbol-sprite icons.svg` sets the output filename to `icons.svg`
- `icons/*.svg` uses all files within the directory `icons` ending in `.svg` as input

The `id` on each `<symbol>` tag will be the name of the input file (minus the extension).
