# Display an object's bounding box

Three.js includes a handy [`BoxHelper`](https://threejs.org/docs/#api/en/helpers/BoxHelper) to display an object's bounding box. The constructor takes an object and a color. Here's the code example from the Three.js docs:

```js
const box = new THREE.BoxHelper(object, 0xffff00);
scene.add(box);
```

To use with [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/), the [drei package](https://drei.pmnd.rs) has a [`useHelper` hook](https://github.com/pmndrs/drei#usehelper) to make it easy to use helpers like the `BoxHelper`. It automatically sets up the helper when the component mounts, and disposes of it when the component unmounts. Here's the code sample from the drei docs:

```jsx
const mesh = useRef()
useHelper(mesh, BoxHelper, 'cyan')
useHelper(condition && mesh, BoxHelper, 'red') // you can passe false instead of the object ref to hide the helper

<mesh ref={mesh} ... />
```
