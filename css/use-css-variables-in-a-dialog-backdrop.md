# Use CSS variables in a `<dialog>` backdrop

I was building a native modal using the new(ish) [`<dialog>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog) when I realized that I couldn't use CSS variables (officially called [custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)) in the `::backdrop` pseudo-element.

I found [this Stack Overflow post](https://stackoverflow.com/questions/58818299/css-variables-not-working-in-dialogbackdrop) that links to a (now-removed) paragraph in the spec for the `::backdrop`:

> It does not inherit from any element and is not inherited from. No restrictions are made on what properties apply to this pseudo-element either.

Since variables propagate via inheritance, that means that the `::backdrop` doesn't have access to variables defined on the `:root` selector.

Fortunately, the fix is pretty simple: just define any variables that should be globally available on both the `:root` and `::backdrop` selectors.

```css
:root,
::backdrop {
  --some-variable-name: 10px;
  --some-other-variable-name: #f00;
  /* etc etc */
}
```
