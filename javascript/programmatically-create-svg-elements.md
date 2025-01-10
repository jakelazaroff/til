# Programmatically create SVG elements

This is simple, but it tripped me up for a bit. TL;DR you can't do this:

```js
const svg = document.createElement("svg");
const line = document.createElement("line");
svg.append(line);
```

I mean, you can, but it won't work. These will both throw exceptions:

```js
console.assert(svg instanceof SVGSVGElement, "%o is an SVG element", svg);
console.assert(line instanceof SVGLineElement, "%o is an SVG element", line);
```

What you need instead is [`document.createElementNS`](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElementNS):

```js
const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
svg.append(line);
```
