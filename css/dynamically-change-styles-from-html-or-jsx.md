# Dynamically change styles from HTML or JSX

(No, it's not Tailwind.)

I wanted a button on my website to be "RSS orange" even though that color wasn't anywhere else in my color scheme. Hardcoding that within the button component itself felt overly specific; the button should mostly be agnostic to what's inside of it. But the button component encapsulated its own markup and styles, and I didn't want to break that encapsulation by reaching in from outside to override things.

The solution, surprisingly, was to use inline styles! Not by setting any properties, but by setting a [custom property](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties) — often known as a CSS variable.

```html
<button className="button" style="--accent: #ff6600">Subscribe via RSS</button>
```

That sets the custom property `--accent` to `#ff6600` within **that specific button element**. The corresponding CSS might look something like this:

```css
.button {
  background-color: var(--accent, var(--color-primary));
}
```

The key is to specify a [fallback value](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties#custom_property_fallback_values) when accessing `--accent`. So by default, everything with the class `button` would have a background color of `--color-primary` — **except** when `--accent` is defined, in which they'll use `--accent`.

This pattern pairs particularly well with component-based frameworks like React, where it's common to change behavior by exposing props. A `Button` component using this pattern might look like this:

```jsx
function Button({ accent, children }) {
  // only set `--accent` if it's not an empty string
  // otherwise it'll be set to the literal string "undefined" and everything will break
  const style = accent ? { "--accent": accent } : {};

  return (
    <button className="button" style={style}>
      {children}
    </button>
  );
}
```

To use it, just pass something to the `accent` prop:

```jsx
<Button accent="#ff6600">Subscribe via RSS</Button>
```
