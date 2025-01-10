# Define a custom element

I've been using web components for a bit, and I've accrued a bit of code I generally use as a base for my custom elements. "Boilerplate" has a negative connotation, so let's just call it a "web component starter kit".

Let's start with the finished product (as of today, at least) and then we'll talk about how I got there:

```js
class MyElement extends HTMLElement {
  static tag = "my-element";

  static define(tag = this.tag) {
    this.tag = tag;

    const name = customElements.getName(this);
    if (name) return console.warn(`${this.name} already defined as <${name}>!`);

    const ce = customElements.get(tag);
    if (Boolean(ce) && ce !== this) return console.warn(`<${tag}> already defined as ${ce.name}!`);

    customElements.define(tag, this);
  }

  static {
    const tag = new URL(import.meta.url).searchParams.get("define") || this.tag;
    if (tag !== "false") this.define(tag);
  }
}
```

The first parts are heavily inspired by Mayank's post on [defining custom elements](https://mayank.co/blog/defining-custom-elements/).
For a long time after reading that, my boilerplate looked like this:

```js
class MyElement extends HTMLElement {
  static tag = "my-element";

  static define(tag = this.tag) {
    this.tag = tag;

    const name = customElements.getName(this);
    if (name) return console.warn(`${this.name} already defined as <${name}>!`);

    const ce = customElements.get(tag);
    if (ce && ce !== this) return console.warn(`<${tag}> already defined as ${ce.name}!`);

    customElements.define(tag, this)
  }
}
```

It's the same as what Mayank ended up with, plus a couple of checks to guard against accidentally defining a custom element class or tag name twice.

This gives a lot of flexibilty to the person using the component:

- They can define them using the tag name I've defined by just calling `MyElement.define()`.
- They can override the tag name by passing a different tag name, as in `MyElement.define("other-element")`.
- They can also override the tag name by changing the static `tag` property. This is particularly useful when using it as a base class: the subclasses can change the tag name and the registration code will stay the same.
  ```js
  class MyOtherElement extends MyElement {
    static tag = "other-element";
  }

  MyOtherElement.define();
  ```

However, there's one nagging drawback: the person using the component _needs_ to define it somehow.
They can't just include a script tag like this:

```js
<script type="module" src="./my-element.js"></script>
```

Rather, they need to call that `define` method. That means actually using the component will look something like this:

```js
<script type="module">
import MyElement from "./my-element.js";
MyElement.define();
</script>
```

If they're using a bundler, there won't be a `<script>` tag, but the story will be the same.
Not a dealbreaker, but kind of annoying!

Then, a few months ago, Nathan Knowler [came up with a clever trick](https://knowler.dev/blog/to-define-custom-elements-or-not-when-distributing-them) that I've been meaning to play around with.
It uses `import.meta.url` to check whether the component was imported using a `?define` query string, and if so define it by default:

```js
if (new URL(import.meta.url).searchParams.has("define")) {
  customElements.define("bleh-bleh-bleh", BlehBlehBlehElement);
}
```

To import the component _and_ automatically define it:

```js
<script type="module" src="./bleh-bleh-bleh.js?define"></script>
```

To _not_ define it, just omit the `?define` query string.

A few people had good ideas in a follow-up discussion on Mastodon.
Cesare Pautasso suggested [using the query string value to customize the tag name](https://scholar.social/@pautasso/113271442461273534), while Remy Sharp pointed out that [defining it should be the default behavior](https://front-end.social/@rem/113271106167064142).

Here's what I came up with:

```js
const tag = new URL(import.meta.url).searchParams.get('define') || undefined;
if (tag !== 'false') MyElement.define(tag);
```

There's a lot going on in a few lines, so let's go through it:

1. First, we set `tag` to the _value_ of the query string parameter `define`, falling back to `undefined` instead of an empty string.
2. If `tag` is not equal to `"false"` (meaning the query string parameter was either set explicitly or omitted entirely) we call `MyElement.define(tag)`. That will either use the given tag name or fall back to the default argument, which is the value of `Myelement.tag`.
3. If `tag` is set to `"false"`, we don't do anything. We know this won't conflict with any custom element tag name the user might want to set, because custom element tag names must include a hyphen.

So to import the component and define it with the default tag name, you'd import `my-element.js` and it should Just Work. To import it with a custom tag name, you'd import `my-element.js?define=other-tag-name`. And to import it without defining it at all, you'd import `my-element.js?define=false`.

We can make the code feel a bit cleaner by putting it in a static initialization block:

```js
class MyElement extends HTMLElement {
  // ...

  static {
    const tag = new URL(import.meta.url).searchParams.get("define") || this.tag;
    if (define !== "false") this.define(tag);
  }
}
```

A couple caveats here:

- Westbrook Johnson pointed out that [importing a file twice with different query strings might create different modules in the module graph](https://mastodon.social/@westbrook/113271725600420967). This is probably an edge case (since, unlike with framework components, you should only ever need to import web components once) but it's worth keeping in mind.
- Óscar Otero suggested that [it won't work if you use a bundler](https://mastodon.gal/@misteroom/113271013172508655). I've used it successfully in a React component in an Astro app (meaning with Vite) but I haven't tested it outside of that.
- Static initialization blocks don't get inherited like normal static variables. That means if you write something like this, it won't automatically define itself:
  ```js
  class MyOtherElement extends MyElement {
    static tag = "other-element";
  }
  ```

Regardless, this has been working pretty well for me!
