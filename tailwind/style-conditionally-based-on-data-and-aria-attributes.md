# Style conditionally based on data and ARIA attributes

The unstyled UI library [Radix](https://www.radix-ui.com) exposes its inner state using [`data-*` attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/data-*). When it comes to styling, it's better to make use of these attributes rather than rely on pseudo-classes like `:hover` (which isn't accessible by keyboard users) or conditionally applying classes based on props or state (which is error-prone).

[Tailwind supports styling `data-*` attributes](https://tailwindcss.com/docs/hover-focus-and-other-states#data-attributes): prefix the class name with `data-[attribute]` (for styling based on the presence or absence of an attribute) or `data-[attribute=value]` (for styling based on a specific value).

For example, here's how a [Radix context menu item](https://www.radix-ui.com/docs/primitives/components/context-menu#item) might be styled:

```jsx
function ContextMenuItem({ text, disabled, onSelect }) {
  return (
    <ContextMenu.Item
      className="text-white/70 data-[highlighted]:text-white data-[disabled]:text-white/30"
      disabled={disabled}
      onSelect={onSelect}
    >
      <span>{text}</span>
    </ContextMenu.Item>
  );
}
```

Radix conforms to accessibility standards using [ARIA attributes](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA). The ARIA attributes themselves aren't in the documentation, so it's probably not as safe to use them for styling, but for what it's worth [Tailwind also supports styling based on ARIA attributes](https://tailwindcss.com/docs/hover-focus-and-other-states#aria-states), providing semantic sugar for common ARIA attributes like `aria-expanded` and `aria-disabled` and supporting less common attributes via the "arbitrary variants" feature.

For example, styling a [Radix dropdown menu trigger](https://www.radix-ui.com/docs/primitives/components/dropdown-menu#trigger) based on its `aria-expanded` attribute might look like this:

```jsx
function DropdownMenuTrigger({ text }) {
  return (
    <DropdownMenu.Trigger className="bg-blue aria-expanded:bg-green">
      <span>{text}</span>
    </DropdownMenu.Trigger>
  );
}
```
