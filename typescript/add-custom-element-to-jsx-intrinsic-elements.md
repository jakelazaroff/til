# Add custom element to `JSX.IntrinsicElements`

As of version 19, [React supports custom elements](https://custom-elements-everywhere.com/libraries/react/results/results.html)!

That's great, but I still ran into this error trying to use a custom element in a React component:

```
ts: Property 'my-element' does not exist on type JSX.IntrinsicElements'.
```

Okay, so that's a TypeScript issue. But the `JSX.IntrinsicElements` type definition is inside the `@types/react` module, so who's the real culprit?

Anyway, I found [this blog post](https://medium.com/@joelmalone/get-jsx-to-recognise-your-custom-element-in-react-or-preact-bf08d7522208) that got me most of the way there:

```ts
import type { HTMLAttributes } from "react";

declare module "react/jsx-runtime" {
  namespace JSX {
    interface IntrinsicElements {
      "my-element": HTMLAttributes<MyElement>;
    }
  }
}
```

That makes TypeScript recognize the `my-element` tag name. But it's not a complete solution: if you try to pass a `ref` prop, TypeScript will complain that "property `ref` does not exist`.

The solution is to use React's `DetailedHTMLProps` type:

```ts
import type { DetailedHTMLProps, HTMLAttributes } from "react";

declare module "react/jsx-runtime" {
  namespace JSX {
    interface IntrinsicElements {
      "my-element": DetailedHTMLProps<HTMLAttributes<MyElement>, MyElement>;
    }
  }
}
```

That adds support for React's props like `key` and `ref`. There's still a missing piece, though: if your custom element supports any custom attributes, TypeScript will tell you _those_ attributes don't exist.

The full solution: make an interface with your component's attributes, and intersect it with your custom element class type before passing it to `HTMLAttributes`:

```ts
import type { DetailedHTMLProps, HTMLAttributes } from "react";

interface MyElementAttributes {
  attr: string;
}

declare module "react/jsx-runtime" {
  namespace JSX {
    interface IntrinsicElements {
      "my-element": DetailedHTMLProps<HTMLAttributes<MyElement & MyElementAttributes>, MyElement>;
    }
  }
}
```

I haven't tested this with Preact — much less other frameworks that use JSX, like Hono. But in theory it should work if you change `react/jsx-runtime` to `preact/jsx-runtime` (or whatever the corresponding module name is) and swap out React's types for the other framework's.
