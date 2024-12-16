# Anchor scroll position to the bottom

Recently, I was building a vertical "timeline" for an explorable explanation, in which new elements would be added below any existing ones. As elements were added, I wanted the scroll position anchored to the bottom of the timeline, as it would be in a chat app.

Specifically:

- The first element should start at the top.
- New elements should enter the timeline below any existing elements.
- If the container is scrolled to the bottom, it should remain scrolled to the bottom to reveal new elements as they're added.
- But if the container is scrolled _up_, the scroll position should remain the same such that new elements are added below the fold.

Initially, I thought I might have to mess around with [`MutationObserver`](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver), but I found [this StackOverflow answer](https://stackoverflow.com/a/44051405) with a neat CSS-only solution.

The answer used `flex-direction: column-reverse`. That mostly works, with two caveats:

1. Elements start at the bottom, rather than the top.
2. More seriously, the markup needs to be in reverse order.

Luckily, a commenter pointed out a trick to fix both of those: wrap the list in another element, and apply the flexbox properties to the _wrapper_. Then, to force the list to the top of the wrapper, add a shim before it in the markup (which places it below it in the wrapper's `column-reverse` flexbox flow).

All in all, the markup would look something like this:

```html
<div class="wrapper">
  <div class="shim"></div>
  <ul>
    <!-- items go here -->
  </ul>
</div>
```

And the CSS would look like this:

```css
.wrapper {
  display: flex;
  flex-direction: column-reverse;
  overflow: auto;
}

.shim {
  flex: 1;
}
```
