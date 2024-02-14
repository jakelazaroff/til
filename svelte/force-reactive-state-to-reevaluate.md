# Force reactive state to reevaluate

In Svelte 5, you declare a reactive variable using the [`$state` rune](https://svelte.dev/blog/runes).

```svelte
let something = $state(1);
```

Svelte will track anything that depends on that variable — such as a derived variable, or an effect — and update it whenever the value changes:

```svelte
let something = $state(1);
let doubled = $derived(something * 2);

$effect(() => console.log(something + doubled));

something = 2;
```

In this case, setting `something` to 2 will update `doubled` to 4 and run the effect, logging 6.

Previous verisons of Svelte would use self-assignments (e.g. `something = something`) to update dependents. In Svelte 5, that no longer works — which presents a problem if you're trying to use a class that mutates itself, such as a [Yjs](https://yjs.dev) document:

```svelte
import * as Y from "yjs";

let doc = $state(new Y.Doc());
doc.on("change", () => {
  doc = doc;
});

let array = $derived(doc.getArray("my-array"));
$effect(() => console.log(array)); // will never run

array.insert(0, ["val"]);
```

However, it **does** work if you first assign `undefined` to the state:

```svelte
import * as Y from "yjs";

let doc = $state(new Y.Doc());
doc.on("change", () => {
  const tmp = doc;
  doc = undefined;
  doc = tmp;
});

let array = $derived(doc.getArray("my-array"));
$effect(() => console.log(array)); // run whenever the array is changed!

array.insert(0, ["val"]);
```
