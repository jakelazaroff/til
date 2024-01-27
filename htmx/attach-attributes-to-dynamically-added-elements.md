# Attach attributes to dynamically added elements

It's barely mentioned within the htmx documentation, but by default htmx attributes only work on elements that were in the DOM when htmx was loaded, or that htmx itself added to the DOM. This means that if you add an element by some other means — say, AlpineJS — htmx won't know about any attributes on it or its descendants.

In the below example with AlpineJS and htmx, the toggle button can be clicked to show and hide the form — but the [`hx-boost` attribute](https://htmx.org/attributes/hx-boost/) won't be detected, which means that it will be a normal form submission:

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

htmx provides a function [`htmx.process`](https://htmx.org/api/#process) that checks a given element for htmx attributes. Call it like so:

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
