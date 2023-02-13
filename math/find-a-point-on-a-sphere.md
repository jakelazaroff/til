# Find a point on a sphere

Given the radius (`r`) of a sphere, an azimuth angle (angle around the vertical axis; `s`) and a polar angle (angle from horizontal; `t`) the equation to find the coordinates of the corresponding point is as follows:

```
x = r * cos(s) * sin(t)
y = r * cos(t)
z = r * sin(s) * sin(t)
```

This assumes the axes are in a Y-up right handed orientation.
