# Check whether an angle is between two other angles

Weirdly, I've had to do this a lot recently: given an angle, determine whether it's bounded by two other angles. Technically, this is _always_ true — just go the other direction around the circle — but usually I care about going in a _particular_ direction.

Step one is to normalize all the angles so that they fit into the range `[0, 2π]` (or `[0, 360]` if you prefer degrees). We'll use TypeScript to demonstrate:

```ts
const TWO_PI = Math.PI * 2;
export function normalize(angle: number) {
  const clamped = angle % TWO_PI, // normalize into range [-2π, 2π]
    positive = clamped + TWO_PI, // translate into range [0, 4π]
    result = positive % TWO_PI; // normalize into range [0, 2π]

  return result;
}
```

Three steps here:

1. Modulo the angle by `2π`. If it's positive, this compresses it into the range `[0, 2π]`; if it's negative, this compresses it into the range `[-2π, 0]`.
2. Add `2π`. This increases the range to `[0, 4π]`, ensuring it's positive.
3. Modulo the angle by `2π` again, compressing it into the range `[0, 2π]`.

Once all the angles are within the range `[0, 2π]`, they can be checked:

```ts
export function between(min: number, theta: number, max: number) {
  if (min < max) return min <= theta && theta < max;
  else return min <= theta || theta < max;
}
```

1. If `min` is less than `max`, we can just ensure that `theta` is between them.
2. Otherwise, it means the angles wrap around `0` (for example, `min` might be `7π / 4` and `max` might be `π / 4`). In that case, we need to check whether `theta` is **greater** than `min` (and implicitly less than `2π`, which is the top of the range) _or_ **less** than `max` (and implicitly greater than `0`, which is the bottom of the range).

This function assumes that `min` is inclusive and `max` is exclusive.
