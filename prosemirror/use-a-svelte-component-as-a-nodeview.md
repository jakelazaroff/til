# Use a Svelte component as a NodeView

The ProseMirror rich text editor library has a concept called `NodeView` for [rendering custom widgets with a document](https://prosemirror.net/docs/guide/#view.node_views).

To use a `NodeView`, you write a "constructor" function that takes in the ProseMirror `Node`, `EditorView` and a function to get the node's position. That function is expected to set up the DOM for the custom widget and return an object implementing the [`NodeView` interface](https://prosemirror.net/docs/ref/#view.NodeView).

The examples set up DOM using vanilla JS, but it's pretty simple to instead create a DOM element and render a framework component inside of it. This general approach should work for any framework — Svelte, React, Solid, etc — as well as with web components.

TL;DR, this `SvelteNodeView` class creates an element with the given tag (by default `<div>`) inside of which it mounts a Svelte component. It spreads the node's attributes into the component's props, adding an additional `onchange` prop that can be called from within the component to set that attribute.

Right now, it doesn't update the component if the node's attributes change outside.

The static `create` method creates a constructor function given a Svelte component class and an optional tag name.

```ts
import { type Node } from "prosemirror-model";
import { type EditorView, type NodeViewConstructor } from "prosemirror-view";
import { type SvelteComponent, type ComponentType, mount } from "svelte";

type Component = ComponentType<
  SvelteComponent<
    Record<string, any> & {
      onchange(name: string, value: any): void;
    }
  >
>;

class SvelteNodeView {
  node: Node;
  view: EditorView;
  getPos: () => number | undefined;
  dom: Element;

  constructor(
    comp: Component,
    tag: string,
    node: Node,
    view: EditorView,
    getPos: () => number | undefined
  ) {
    this.node = node;
    this.view = view;
    this.getPos = getPos;

    const target = (this.dom = window.document.createElement(tag));
    target.style.display = "contents";

    mount(comp, {
      target,
      props: {
        ...node.attrs,
        onchange(name, value) {
          const pos = getPos();
          if (pos === undefined) return;

          const tr = view.state.tr.setNodeAttribute(pos, name, value);
          view.dispatch(tr);
        }
      }
    });
  }

  static create(comp: Component, tag: string = "div"): NodeViewConstructor {
    return (node, view, dom) => new SvelteNodeView(comp, tag, node, view, dom);
  }
}
```
