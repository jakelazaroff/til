# Prevent extra whitespace in NodeViews

While trying to build a [ProseMirror `NodeView`](https://prosemirror.net/docs/ref/#view.NodeView) using a [Shoelace dropdown](https://shoelace.style/components/dropdown), I kept getting a ton of extra vertical space around the dropdown trigger.

The fix turned out to be really simple. ProseMirror sets some styles on its root element. The culprit turned out to be [`white-space: break-spaces`](https://developer.mozilla.org/en-US/docs/Web/CSS/white-space#break-spaces) — an inherited style which preserves newline characters.

I didn't want to override that style for the whole ProseMirror element, but setting `white-space: normal` on the `NodeView` element fixed it easily.
