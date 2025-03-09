# Parse a `Date` or `string` into a `Date`

One common pattern with TypeScript projects is using a validation library like [Valibot](https://valibot.dev/) to validate incoming data at points of ingress to your application. (Intentionally or unintentionally, this is "parse, don't validate" pattern, coined by Alexis King advocates in her [excellent blog post of the same name](https://lexi-lambda.github.io/about.html).)

The pattern is a little trickier when writing code that spans network boundaries. 

For example, in SvelteKit, it's common to load entities from a database (on a server) and then load those same entities from API endpoints (on a client). The [node-postgres](https://node-postgres.com/) database driver will turn timestamp columns into JavaScript `Date` objects, but those objects will get converted to JSON before being sent over the network.

So the issue is that there are two separate forms that the same entity can take. One way to solve this is by using a union validator:

```ts
import { date as vdate, string, union } from "valibot";

const date = () => union([string(), vdate()]);
```

That's inconvenient, though, because then the resulting type is `string | Date`. And it's not just a type system thing, either: it will _actually_ be a `string` or `Date`, and doing anything with it will require either type assertions or branching.

```ts
import { date as vdate, pipe, string, transform, union } from "valibot";

const date = () =>
  pipe(
    union([string(), vdate()]),
    transform(input => typeof input === "string" ? new Date(input) : input)
  );
```

Basically:

1. Ensure the input type is either a `string` or a `Date`.
2. If a `string`, convert it to a `Date`.

Boom: two different "input" representations, parsed into one consistent "output" type.