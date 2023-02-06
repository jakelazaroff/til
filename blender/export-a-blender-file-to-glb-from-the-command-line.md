# Export a Blender file to GLB from the command line

Blender includes a [command line interface](https://docs.blender.org/manual/en/latest/advanced/command_line/index.html). The included arguments mostly have to do with rendering, but it also provides a flag to execute a Python expression, which makes [its entire Python API](https://docs.blender.org/api/current/index.html) available.

Here's a one-liner that takes a `.blend` file and exports it to a binary glTF (`.glb`) file:

```sh
/Applications/Blender.app/Contents/MacOS/Blender -b input.blend \
  --python-expr "import bpy; bpy.ops.export_scene.gltf(filepath='output.glb')"
```

- `/Applications/Blender.app/Contents/MacOS/Blender` is the path to the Blender executable.
- `-b` tells Blender to run headlessly.
- `input.blend` is the input file.
- `--python-expr` is the command line flag that has Blender run the expression as Python.
  - `import bpy` imports the Blender library into the Python script.
  - [`bpy.ops.export_scene.gltf`](https://docs.blender.org/api/current/bpy.ops.export_scene.html#bpy.ops.export_scene.gltf) is the Blender API function that exports the scene as a binary glTF.
  - `filepath='output.glb'` tells Blender to save the exported file as `output.glb`.
