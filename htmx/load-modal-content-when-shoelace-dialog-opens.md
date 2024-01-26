# Load modal content when a Shoelace dialog opens

This is pretty idiosyncratic to [HTMX](https://htmx.org) and [Shoelace](https://shoelace.style), but it's a neat pattern so I'm documenting it here.

HTMX lets you make an HTTP request in response to an event and insert it elsewhere into the DOM. Shoelace's [Dialog](https://shoelace.style/components/dialog) component fires an `sl-show` event when the dialog opens. These can be combined to automatically load modal content when the modal opens:

```html
<sl-dialog hx-get="/modal/content/" hx-trigger="sl-show"></sl-dialog>
```

If parts of the modal don't need to be loaded via HTTP — for example, the title — `hx-target` can be used to replace only the modal content:

```html
<sl-dialog hx-get="/modal/content/" hx-trigger="sl-show" hx-target="find .content">
  <span slot="label">My Modal</span>
  <div class="content"></div>
</sl-dialog>
```
