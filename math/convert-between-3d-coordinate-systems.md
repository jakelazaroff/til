# Convert between 3D coordinate systems

3D coordinates are represented with X, Y and Z axes. Technically, there are 48 different ways to orient the axes with respect to each other, but [most 3D software has converged on four](https://twitter.com/FreyaHolmer/status/1325556229410861056): Y-up vs. Z-up, and right handed vs. left handed (pick one option from each).

Here's roughly how it works:

- In all systems, the X axis is always horizontal and points to the right, meaning X coordinates get larger the further right they are. If you're standing at 0 on the X axis, coordinates on your left are negative and coordinates on your left are positive.
- "Y-up" and "Z up" refers to vertical axis, which points up. If you're standing at 0 on the vertical axis, coordinates above you are negative and coordinates below you are positive; those coordinates will be labeled Y in a Y-up system and Z in a Z-up system.
- "Right handed" and "left handed" determine which direction the Y and Z axes point with respect to each other. This is easiest to visualize by orienting yourself such that the X axis points right and the vertical axis points up. If the vertical axis is Y (Y-up), a right handed system means the Z axis is pointing toward you and a left handed system means the Z axis is pointing away from you. If the vertical axis is Z (Z-up), this is flipped: a right handed system means the Y axis is pointing away from you, and a left handed system means the Y axis is pointing toward you.

Wikipedia has [an article on the right-hand rule](https://en.wikipedia.org/wiki/Right-hand_rule), but I find it confusing. It's easiest for me to visualize by assigning an axis to each of my first three fingers: thumb is X, index finger is Y and middle finger is Z. I make an L with my index finger and thumb, and extend my middle finger perpendicular to my palm. Visualized this way, here are the four coordinate systems (remember, the X axis is always pointing right and the vertical axis is always pointing up):

- Y-up, right handed: raise your right hand in front of your face, palm to you. Your thumb (X axis) should be extending right, your index finger (Y axis) should be pointing up and your middle finger (Z axis) should be pointing toward you.
- Y-up, left handed: raise your left hand in front of your face, palm away from you. Your thumb (X axis) should still be extending right and your index finger (Y axis) should still be pointing up, but now your middle finger (Z axis) should be pointing away from you.
- Z-up, right handed: extend your right arm in front of you such that your palm is facing upward. Your thumb (X axis) should be extending right, your middle finger (Z axis) should be pointing up and your index finger (Y axis) should be pointing away from you.
- Z-up, left handed: a little tricky to do, but contort your left arm such that your wrist is away from your body and your palm is facing upward. Your thumb (X axis) should still be extending right and your middle finger (Z axis) should still be pointing up, but now your index finger (Y axis) should be pointing toward you.

Converting between these systems involves some combination of swapping the Y and Z axes and/or inverting the Z axis:

- To switch from Y-up to Z-up (and vice versa), swap the Y and Z axes (this is the same as rotating a quarter turn about the X axis). `(0, 1, 2)` in Y-up is equal to `(0, 2, 1)` in Z-up. However, **keep in mind that this flips the handedness** — if the initial point `(0, 1, 2)` was in Y-up right handed coordinates, the new point `(0, 2, 1)` is now in Z-up left-handed coordinates (on the opposite side of the other two axes).
  ```
  'x = x
  'y = z
  'z = y
  ```
- To switch from right handed to left handed (and vice versa), invert the forward axis. `(0, 0, 1)` in Y-up right handed is equal to `(0, 0, -1)` in Y-up left handed; `(0, 1, 0)` in Z-up right handed is equal to `(0, -1, 0)` in Z-up left handed.

  **Y-up:**

  ```
  'x = x
  'y = y
  'z = -z
  ```

  **Z-up:**

  ```
  'x = x
  'y = -y
  'z = z
  ```

- Therefore, to switch from Y-up to Z-up (and vice versa) without also changing the handedness, swap the Y and Z axes and then invert the new forward axis. `(0, 0, 1)` in Y-up is equal to `(0, -1, 0)` in Z-up with the same handedness; `(0, 1, 0)` in Z-up is equal to `(0, 0, -1)` in Y-up with the same handedness.

  **Y-up to Z-up:**

  ```
  'x = x
  'y = z
  'z = -y
  ```

  **Z-up to Y-up:**

  ```
  'x = x
  'y = -z
  'z = y
  ```
