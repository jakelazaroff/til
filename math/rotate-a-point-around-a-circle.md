# Rotate a point around a circle

Given a point `(x, y)` and an angle `θ` (theta) measured in radians, the coordinates of the point `(x', y')` found by rotating the original point counterclockwise around a circle centered on `(0, 0)` are:

```
x' = x * cos(θ) - y * sin(θ)
y' = x * sin(θ) + y * cos(θ)
```

To rotate clockwise, flip the sign of `θ` — if it's positive then make it negative, and vice versa.

If the circle isn't centered on `(0, 0)`, find the delta between the point and the origin, subtract the delta from the point before rotating, then add that delta back to the new point.

Keep in mind that when calculating in code, the previous coordinates need to be stored separately from the result. For example, the following will not work:

```js
const point = { x: 10, y: 10 };
const theta = Math.PI / 8;

// ❌ incorrect
point.x = point.x * Math.cos(theta) - point.y * Math.sin(theta);
point.y = point.x * Math.sin(theta) + point.y * Math.cos(theta); // point.x is different now!
```

Instead, store the previous `x` and `y` and use them when calculating the next point:

```js
const point = { x: 10, y: 10 };
const theta = Math.PI / 8;

// ✅ correct
const { x, y } = point;
point.x = x * Math.cos(theta) - y * Math.sin(theta);
point.y = x * Math.sin(theta) + y * Math.cos(theta);
```
