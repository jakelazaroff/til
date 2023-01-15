# Set default camera in React Three Fiber

[React Three Fiber](https://docs.pmnd.rs/react-three-fiber) supports all Three.js camera types, but it does some hidden setup such that simply instantiating a camera isn't enough to render using it.

Unfortunately, there doesn't seem to be a way to do this declaratively. React Three Fiber provides a hook [`useThree`](https://docs.pmnd.rs/react-three-fiber/api/hooks#usethree) for querying and manipulating the internal state, such as the current camera.

The solution is to use React's [`useLayoutEffect`](https://reactjs.org/docs/hooks-reference.html#uselayouteffect) hook to set the active React Three Fiber camera when the camera component mounts, keeping a reference to the previous camera in the closure so it can be restored when it unmounts.

```tsx
import * as THREE from "three";
import { useLayoutEffect } from "react";

function OrthographicCamera() {
  const camera = useRef<THREE.OrthographicCamera>(null);

  const set = useThree((three) => three.set);
  const prevCamera = useThree((three) => three.camera);

  useLayoutEffect(() => {
    // if there's no current camera ref, exit early
    const current = camera.current;
    if (!current) return;

    // store the previous camera to restore it when the effect cleans up
    const prev = prevCamera;

    // set the react three fiber camera to the current camera ref
    set(() => ({ camera: current }));

    // restore the previous camera when the effect cleans up
    return () => set(() => ({ camera: prev }));

    // don't include `prevCamera` in the dependency array so the effect keeps a reference to the default
  }, [camera, set]);

  return <orthographicCamera ref={camera} />;
}
```

The [drei](https://github.com/pmndrs/drei) library (a bunch of utilies for React Three Fiber) includes something like this in the [source code for their `OrthographicCamera` component](https://github.com/pmndrs/drei/blob/master/src/core/OrthographicCamera.tsx).
