# Attach attributes to dynamically added elements

It's barely mentioned within the HTMX documentation, but by default HTMX attributes only work on elements that were in the DOM when HTMX was loaded, or that HTMX itself added to the DOM. This means that if you add an element by some other means — say, AlpineJS — HTMX won't know about any attributes on it or its descendants.

In the below example with AlpineJS and HTMX, the toggle button can be clicked to show and hide the form — but the [`hx-boost` attribute](https://htmx.org/attributes/hx-boost/) won't be detected, which means that it will be a normal form submission:

```html
<div x-data="{ show: false }">
  <template x-if="show">
    <form method="post" action="/some/endpoint" hx-boost="true">
      <input name="firstname" />
      <input name="lastname" />
      <button>Submit</button>
    </form>
  </template>
  <button @click="show = !show">Toggle</button>
</div>
```

HTMX provides a function [`htmx.process`](https://htmx.org/api/#process) that checks a given element for HTMX attributes. Call it like so:

```js
htmx.process(document.body);
```

The above code snippet can be fixed with the [AlpineJS `x-effect` directive](https://htmx.org/attributes/hx-boost/), which runs an expression when the tag is added to the DOM:

```html
<div x-data="{ show: false }">
  <template x-if="show">
    <form x-effect="htmx.process($el)" method="post" action="/some/endpoint" hx-boost="true">
      <input name="firstname" />
      <input name="lastname" />
      <button>Submit</button>
    </form>
  </template>
  <button @click="show = !show">Toggle</button>
</div>
```
