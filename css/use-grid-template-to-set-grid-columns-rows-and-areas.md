# Use `grid-template` to set grid columns, rows and areas

I'm always forgetting how the [grid-template](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template) shorthand works, so here's a quick reference.

The simplest usage is just as a shorthand for `grid-rows` and `grid-columns`:

```css
grid-template: 2rem 1fr / 20rem 1fr;
```

Before the slash is rows; after the slash is columns. It's equivalent to this longhand:

```css
grid-template-rows: 2rem 1fr;
grid-template-columns 20rem 1fr;
```

Things get a little more interesting when you also use it as a shorthand for `grid-template-areas`:

```css
grid-template:
  "toolbar toolbar" 2rem
  "sidebar content" 1fr
  / 20rem 1fr;
```

Each line before the slash contains the grid area names and height of a row; after the slash contains the column sizes. It's equivalent to this longhand:

```css
grid-template-rows: 2rem 1fr;
grid-template-columns: 20rem 1fr;
grid-template-areas:
  "toolbar toolbar"
  "sidebar content";
```
