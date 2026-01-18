# Make all rounded corners squircles

Have you heard of [`corner-shape`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/corner-shape)? It's the new hottest CSS property! You can use it to make corners that are notches, squircles and all sorts of other cool stuff.

It's as easy as this:

```css
*,
*::before,
*::after {
  corner-shape: squircle;
}
```

It only works in Blink browsers for now, but that's okay — graceful degradation, right?

The only _real_ issue is that, in my experience, the radii of squircle corners tend to appear about half as big as "normal" rounded corners. So I'd put something like this in my CSS reset:

```css
:root {
  --radius-sm: 4px;
  --radius-md: 6px;
  /* ... */
}

@supports (corner-shape: squircle) {
  *,
  *::before,
  *::after {
     corner-shape: squircle;
  }

  :root {
    --radius-sm: 8px;
    --radius-md: 12px;
    /* ... */
  }
}
```

Define the corner radii design tokens, and then if the browser supports squircle corners, make all corners squircles and double the corner radii.
