# Swap between black and white text based on background color

The title is overselling it a little, but not by much. Devon Govett posted [this clever trick](https://bsky.app/profile/devongovett.bsky.social/post/3lcedcdj4qk2y) on Bluesky using [CSS relative colors](https://developer.chrome.com/blog/css-relative-color-syntax) and [LCH](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/lch):

```css
.magic {
  --bg: red;
  background: var(--bg);
  color: lch(from var(--bg) calc((49.44 - l) * infinity) 0 0);
}
```

So it won't automagically work with any color behind the element; you need to have it stored as a CSS variable.

LCH has three properties: lightness, chroma and hue.

- Lightness is a number between `0` and `100` representing how bright a color is. `0` corresponds to black, while `100` corresponds to white.
- Chroma is a technically unbounded number that represents "how much" color is present.
- Hue is an angle that represents the hue angle, as in HSL or HSV.

You supply them to the `lch` function like this:

```css
.magic {
  --lightness: 50;
  --chroma: 72.2;
  --hue: 56.2;
  color: lch(var(--lightness) var(--chroma) var(--hue));
}
```

When used with relative color syntax, the color gets "broken up" into its constituent parts which are referred to by `l`, `c` and `h`. So, for example, this would set the background color to the same as the text color; `l`, `c` and `h` take their values from the `from` color and are placed in the appropriate slots unmodified.

```css
.magic {
  --bg: red;
  background: var(--bg);
  color: lch(from var(--bg) l c h);
}
```

Devon's example makes two big changes:

1. It discards the chroma and hue values, replacing them with `0`.
2. It inverts the color's lightness and multiplies it by `infinity` to obtain white or black.

#2 might be confusing, so let's dig into some examples. The basic idea is that if a color's lightness is _above_ some threshold value, we want the text to be black; if it's _below_ that value, we want the text to be white.

Remember, the calculation is `(49.44 - l) * infinity`, clamped within the range `[0, 100]`:

- CSS `red` has an LCH lightness of `54.29`.
  1. `49.44` - `54.29` = `-4.85`
  2. `-4.85` \* `infinity` = `-infinity`
  3. `-infintiy` gets clamped to `0` <span style="border-radius: 2px; padding: 0 2px; background: red; color: black">(black)</span>
- CSS `blue` has an LCH lightness of `29.57`.
  1. `49.44` - `29.57` = `19.87`
  2. `19.87` \* `infinity` = `-infinity`
  3. `infintiy` gets clamped to `100` <span style="border-radius: 2px; padding: 0 2px; background: blue; color: white">(white)</span>
- CSS `white` has an LCH lightness of `100`.
  1. `49.44` - `100` = `-50.56`
  2. `-4.85` \* `infinity` = `-infinity`
  3. `-infintiy` gets clamped to `0` <span style="border-radius: 2px; padding: 0 2px; background: white; color: black">(black)</span>

Why `49.44`? Devon tested it with all RGB colors and found it had the least number of WCAG 4.5:1 contrast failures.

Addendum: After publishing, Noah Liebman [pointed out to me](https://mastodon.social/@noleli/113586705788122139) that Lea Verou had [independently come up with the same technique](https://lea.verou.me/blog/2024/contrast-color/) earlier this year!
