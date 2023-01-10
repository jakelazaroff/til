# Types and variables can share names

The [Superstruct documentation on type inference](https://docs.superstructjs.org/guides/06-using-typescript#inferring-types) includes this neat trick:

```ts
import { Infer } from "superstruct";

const User = object({
  id: number(),
  email: email(),
  name: string(),
});

type User = Infer<typeof User>;
```

In the context of Superstruct, this creates both a variable `User` that checks whether an object has a particular shape and a type `User` of that shape.

The cool thing here is that the type and the variable both have the same name. So you can import them both at the same time:

```ts
import { assert } from "superstruct";

// import both the variable and the type
import { User } from "./user";

// this line uses the type
async function getUser(): Promise<User> {
  const res = await fetch("https://example.com/api/fake-user-endpoint");
  const json = await res.json();

  // this line uses the variable
  assert(json, User);

  return user;
}
```

Note that this doesn’t work for all variables. Classes, for example, are already available as types, so if you write something like this TypeScript will tell you that `Test` is a duplicate identifier:

```ts
class Test {}

type Test = string;
```
