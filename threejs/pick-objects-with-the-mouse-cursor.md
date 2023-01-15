# Pick objects with the mouse cursor

To make a 3D scene interactive, it's useful to know which objects the mouse cursor is over.

This code snippet is mostly copied directly from the [three.js documentation for the Raycaster class](https://threejs.org/docs/index.html#api/en/core/Raycaster). It works with both [perspective cameras](https://threejs.org/docs/#api/en/cameras/PerspectiveCamera) and [orthographic cameras](https://threejs.org/docs/#api/en/cameras/OrthographicCamera).

```ts
renderer.domElement.addEventListener("pointerdown", (e) => {
  const pointer = new THREE.Vector2();

  // convert the mouse coordinates into clip space — x axis from -1 (left) to 1 (right) and the y axis from 1 (top) to -1 (bottom)
  pointer.x = (e.clientX / renderer.domElement.clientWidth) * 2 - 1;
  pointer.y = -(e.clientY / renderer.domElement.clientHeight) * 2 + 1;

  // project the clip space coordinates from the camera
  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(scene.children);
  for (const child of intersects) {
    // do something with the intersected child
  }
});
```
