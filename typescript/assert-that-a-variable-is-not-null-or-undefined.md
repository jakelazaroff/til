# Assert that a variable is not `null` or `undefined`

TypeScript uses `!` as a [non-null assertion operator](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-0.html#non-null-assertion-operator):

```ts
const foo = document.querySelector("#foo"); // Element | null;
const bar = document.querySelector("#bar")!; // Element;
```

I avoid it because it's the same as JavaScript's unary not operator, which makes it difficult to grep. Instead, I generally prefer to assert types with `as TypeName`.

```ts
const foo = document.querySelector("#foo") as Element;
```

That has a couple drawbacks. Other than being more verbose, it's possible to cast the type to something incorrect:

```ts
const foo = document.querySelector("svg") as HTMLElement;
```

But! You can chain the `!` non-null assertion operator as many times as you want:

```ts
const foo = document.querySelector("#foo")!!!; // Element
```

I prefer that to `as` assertions. It's greppable (since using three consecutive unary nots is unlikely), it's less verbose, there's no chance of accidentally changing the type and a bunch of repeated exclamation marks definitely calls out that something unusual is happening with that code.
