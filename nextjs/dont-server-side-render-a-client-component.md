# Don't server-side render a client component

React Server Components splits React components into two kinds: server components and client components.

Server components run only on the server. Client components, by contrast, can run on both the client _and_ the server (although most hooks like `useEffect` won't run on the server). That way, there isn't just a big hole in the HTML before the JavaScript bundle loads.

Sometimes, though, you _don't want_ a component to render on the server. Say it gets its content from `localStorage`, which only exists in the browser. If the component falls back to an empty list, React will throw an error when it tries to hydrate the server-side rendered HTML and it doesn't match what the client renders.

Marking the component with `"use client"` is insufficient: that just tells React that it _can_ run on the client, not that it can _only_ run on the client.

One way to solve this is to (ab)use the `dynamic` function, which is used for [lazy loading components](https://nextjs.org/docs/pages/building-your-application/optimizing/lazy-loading).

Normally, you'd pass a function that imports the other component asynchronously:

```js
import dynamic from "next/dynamic";

const SomeDynamicComponent = dynamic(() => import("./SomeComponent"));
```

That's not a requirement, though; all you need to pass `dynamic` is a function which returns a promise that resolves with a React component. Additionally, it accepts an options parameter that lets you control whether it should be server-side rendered.

The full fix looks something like this:

```js
import dynamic from "next/dynamic";
import SomeComponent from "./SomeComponent";

const SomeClientOnlyComponent = dynamic(() => Promise.resolve(SomeComponent), {
  ssr: false,
});
```

Boom: a client component that's included in your bundle but not rendered on the server.
