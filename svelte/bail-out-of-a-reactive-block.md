# Bail out of a reactive block

In Svelte, you can [prefix a block with `$:` to mark it as reactive](https://svelte.dev/docs/svelte-components#script-3-$-marks-a-statement-as-reactive), which means it will re-run whenever any outside variables referenced within the block change. It performs the same function as [`useEffect` in React](https://react.dev/reference/react/useEffect) or [`createEffect` in Solid](https://www.solidjs.com/tutorial/introduction_effects).

The difference is that with React and Solid, the "effect" is performed by a function, which means it's possible to "bail out" by returning early. Here's a contrived React example:

```jsx
function ExampleComponent({ shouldRun }) {
  useEffect(() => {
    if (!shouldRun) return;

    // effect code goes here
  }, [shouldRun]);

  // ...
}
```

With Svelte, however, reactive blocks execute at the top level of the module, [where `return` statements aren't allowed](http://es5.github.io/#x12.9):

> An ECMAScript program is considered syntactically incorrect if it contains a `return` statement that is not within a `FunctionBody`.

It doesn't seem to be documented anywhere, but Svelte lets you add an `if` statement before the reactive block in order to execute it conditionally. Variables referenced within the condition will also be tracked reactively, even if they're not referenced within the block itself.

```html
<script>
  export let shouldRun;

  $: if (shouldRun) {
    // effect code goes here
  }
</script>
```

If you have multiple conditions, or need to run some logic within the reactive block before bailing out, you can take advantage of the fact that `$:` uses [JS label syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/label), and use the `break` statement to bail out of the block:

```html
<script>
  export let shouldRun;

  $: {
    if (!shouldRun) break $;

    let shouldContinueRunning;
    // logic to calculate `shouldContinueRunning` goes here
    if (!shouldContinueRunning) break $;

    // effect code goes here
  }
</script>
```
