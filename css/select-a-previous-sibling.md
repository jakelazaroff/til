# Select a previous sibling

Let's say we have this markup:

```html
<div class="one"></div>
<div class="two"></div>
<div class="three"></div>
<div class="four"></div>
```

For a long time, we've been select an element's _next_ siblings:

```css
.one ~ .four {
  /* selects an element with class `four` if preceded by a sibling element with class `one` */
}

.two + .three {
  /* selects an element with class `three` if *immediately* preceded by a sibling element with class `two` */
}
```

But we haven't been able to select an element's _previous_ siblings — like, an element with class `one` (as long as it's followed by an element with class `four`).

Enter the `:has` selector! This trick is simple enough that I'm sure it's written up elsewhere, but here you go:

```css
.one:has(~ .four) {
  /* selects an element with class `one` if followed by a sibling element with class `four` */
}

.two:has(+ .three) {
  /* selects an element with class `two` if *immediately* preceded by a sibling element with class `three` */
}
```
