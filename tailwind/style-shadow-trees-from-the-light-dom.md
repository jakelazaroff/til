# Style shadow trees from the light DOM

I've been really enjoying the web component library [Shoelace](https://shoelace.style) as a replacement for framework-specific UI libraries like [Radix](https://www.radix-ui.com).

Shoelace uses the shadow DOM to encapsulate its markup from the light DOM (aka the rest of the page), which means that class selectors can't reach it. This presents a problem for CSS utility frameworks like Tailwind, which use classes for everything.

Web components can use the [`part` attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/part) to let outside stylesheets select elements in shadow DOM. For example, here's the shadow tree of [Shoelace's Switch component](https://shoelace.style/components/switch):

```html
<label part="base" class=" switch switch--medium ">
  <input class="switch__input" type="checkbox" role="switch" title name aria-checked="false" />

  <span part="control" class="switch__control">
    <span part="thumb" class="switch__thumb"></span>
  </span>

  <div part="label" class="switch__label">
    <slot></slot>
  </div>
</label>
```

CSS in the light DOM can't select these elements using classes like `switch__control` — it needs to select these elements using the [`::part()` pseudo-element](https://developer.mozilla.org/en-US/docs/Web/CSS/::part):

```css
sl-switch::part(control) {
  background-color: red;
}

sl-switch::part(thumb) {
  background-color: white;
}
```

Although Tailwind can't target these parts out of the box, you can write a plugin to do it using [dynamic variants](https://tailwindcss.com/docs/plugins#dynamic-variants) (Tailwind classes that accept arbitrary values):

```js
const plugin = require("tailwindcss/plugin");

module.exports = {
  plugins: [
    plugin(function ({ matchVariant }) {
      matchVariant("part", value => `&::part(${value})`);
    })
  ]
};
```

This adds a `part` modifier that you can use like this:

```html
<sl-switch class="part-[control]:bg-red-500 part-[thumb]:bg-white part-[thumb]:rounded">
  label
</sl-switch>
```
