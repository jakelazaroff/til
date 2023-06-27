# Set default styles for tags

Yes, you could just use tag selectors, but here's [a nifty trick from Stephanie Eckles](https://moderncss.dev/modern-css-for-dynamic-component-based-architecture/) so that you don't need to unset the default styles for when you're customizing the same tags:

```css
a:not([class]) { 
  /* styles go here */
}
```

The `not:([class])` attribute restricts this selector to only matching elements with no class name — meaning any time an `<a>` tag is customized with a class, it won't have the default styles.