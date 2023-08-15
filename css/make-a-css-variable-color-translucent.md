# Make a CSS variable color translucent

Given a color stored in a CSS variable, how do you change the opacity? This [Stack Overflow answer](https://stackoverflow.com/a/71098929) has a couple good suggestions.

First is `color-mix`, which is [widely supported in browsers today](https://caniuse.com/?search=color-mix). It lets you mix two colors in a given color space. The trick is to mix some percentage of the color variable with the color `transparent`:

```css
.classname {
  color: color-mix(in srgb, var(--some-color) 50%, transparent);
}
```

Next is relative color syntax, which [as of August 2023 is only supported in Safari](https://caniuse.com/css-relative-colors). The keyword `from` lets you convert colors between formats; you can then fill in the missing alpha value when passing it to [a color function](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value):

```css
.classname {
  color: rgb(from var(--some-color) / 50%);
}
```
