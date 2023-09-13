# Type concrete subclasses of an abstract class

Let's say there's an an inheritance hierarchy consisting of an abstract base class and two concrete subclasses:

```ts
abstract class Base {
  constructor(exampleParam: number) {}
  abstract foo(): void;
}

class A extends Base {
  foo() {
    console.log("A");
  }
}

class B extends Base {
  foo() {
    console.log("B");
  }
}
```

In an inheritance hierarchy, it's common to reference a group of subclasses by their base class (the [Liskov substitution principle](https://en.wikipedia.org/wiki/Liskov_substitution_principle)):

```ts
function doSomething(obj: Base) {
  base.foo();
}
```

One situation in which this gets thorny for abstract classes is where a subclass that won't be known until runtime must be instantiated. In this case, referring to the base class directly will result in errors about how TypeScript cannot create an instance of an abstract class:

```ts
function instantiate(Class: typeof Base) {
  return new Class(10); // Cannot create an instance of an abstract class.
}
```

Instead of using the abstract base class's type directly, instead create an object type in which a constructor (a `new` method) returns an instance of the abstract class. If the constructor takes any parameters, they can be extracted using the [`ConstructorParameters`](https://www.typescriptlang.org/docs/handbook/utility-types.html#constructorparameterstype) utility type:

```ts
function instantiate(Class: { new (...params: ConstructorParameters<typeof Base>): Base }) {
  return new Class(10);
}
```
