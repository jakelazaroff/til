# Access CSS variables from JavaScript

In building [fxplayground](https://fxplayground.pages.dev/), I wanted to use colors from the site's theme in a canvas visualization. The theme colors were all stored in CSS custom properties (variables), but the visualization drawing code was all JavaScript. I needed a way to read the CSS color variables from within JavaScript code.

Luckily, there's a function called [`getComputedStyle`](https://developer.mozilla.org/en-US/docs/Web/API/Window/getComputedStyle) that can help with that:

```js
const color = getComputedStyle(document.documentElement).getPropertyValue("--color-primary");
```

`getComputedStyle` takes a DOM node and returns a live `CSSStyleDeclaration`, which contains all the styles applied to that element. Calling `getPropertyValue` returns the value for a given property, which includes CSS variable declarations. So if there's a variable defined on the `:root` selector, you can get the value by calling `getPropertyValue("--variable-name")`!
