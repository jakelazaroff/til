# tsconfig flags to prevent common errors

Even thought it’s ostensibly just a compiler, TypeScript also includes a bunch of flags that helps prevent common code errors. I end up reusing these in most TypeScript projects I work on, so I figured I’d just document them here for future reference.

```json
{
  "strict": true,
  "noFallthroughCasesInSwitch": true,
  "noImplicitOverride": true,
  "noImplicitReturns": true,
  "noUncheckedIndexedAccess": true,
  "noUnusedLocals": true,
  "noUnusedParameters": true,
  "forceConsistentCasingInFileNames": true,
  "verbatimModuleSyntax": true
}
```

Here’s a short explanation of what each flag does

- [`strict`](https://www.typescriptlang.org/tsconfig#strict) enables a bunch of other flags; enabling this is really the bare minimum.
  - `alwaysStrict` uses [strict mode](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode) emits `"use strict"` in each file.
  - `noImplicitAny` raises an error if lack of type annotations would lead it to infer `any`.
  - `noImplitictThis` raises an error if a reference to `this` has an inferred `any` type.
  - `strictBindCallApply` correctly types the `bind`, `call` and `apply` methods on functions; otherwise, they accept and return `any`.
  - `strictFunctionTypes` treats function arguments as [contravariant rather than bivariant](https://web.archive.org/web/20220823104433/https://www.stephanboyer.com/post/132/what-are-covariance-and-contravariance).
  - `strictNullChecks` treats `undefined` and `null` as their own distinct types, forbidding e.g. accessing a property of a type that might be undefined.
  - `strictPropertyInitialization` raises an error when a class property that isn’t optional is not set by default or in the constructor.
  - `useUnknownInCatchVariables` uses `unknown` rather than `any` as the type of the exception in a catch clause.
- [`noFallthroughCasesInSwitch`](https://www.typescriptlang.org/tsconfig#noFallthroughCasesInSwitch) forces non-empty cases in switch statements to end with a `break` or `return`.
- [`noImplicitOverride`](https://www.typescriptlang.org/tsconfig#noImplicitOverride) raises an error if a subclass overrides a method in a superclass without being annotated with `override`.
- [`noImplicitReturns`](https://www.typescriptlang.org/tsconfig#noImplicitReturns) raises an error if only some code paths in a function return a value.
- [`noUncheckedIndexAccess`](https://www.typescriptlang.org/tsconfig#noUncheckedIndexedAccess) uses a union with `undefined` when accessing values of objects with unknown keys, such as objects that act as indexes or arrays of unknown length. This can be somewhat annoying, since you now need to check for `undefined` every time, but it’s safer.
- [`noUnusedLocals`](https://www.typescriptlang.org/tsconfig#noUnusedLocals) raises an error when a local variable is declared but never used; the error can be suppressed by prefixing the variable name with an underscore.
- [`noUnusedParameters`](https://www.typescriptlang.org/tsconfig#noUnusedParameters) raises an error when a function parameter is declared but never used; the error can be suppressed by prefixing the variable name with an underscore.
- [`forceConsistentCasingInFileNames`](https://www.typescriptlang.org/tsconfig#forceConsistentCasingInFileNames) raises an error if the casing of an import specifier (`”foo.js”`) differs from the file on disk (`Foo.js`).
- [`verbatimModuleSyntax`](https://www.typescriptlang.org/tsconfig#verbatimModuleSyntax) ensures that type-only imports are explicitly annotated as such (since they’re erased at runtime, they won’t behave the same as value imports if the module causes side effects). Replaces [`importsNotUsedAsValues`](https://www.typescriptlang.org/tsconfig#importsNotUsedAsValues).
