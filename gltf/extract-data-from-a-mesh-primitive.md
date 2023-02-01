# Extract data from a mesh primitive

The first step of displaying a 3D model is interpreting the geometry. The [glTF format](https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html) stores that something called a [mesh primitive](https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html#reference-mesh-primitive): a nested object inside of each [mesh](https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html#reference-mesh) that contains information about how to extract geometry from the binary data.

A mesh primitive looks something like this:

```json
{
  "attributes": {
    "POSITION": 0,
    "NORMAL": 1,
    "TEXCOORD_0": 2
  },
  "indices": 3
}
```

Each of those properties indicates where to find a specific type of data about the geometry. In this case, `attributes.POSITION` points to the vertex positions, `attributes.NORMAL` points to the vertex normals and `attributes.TEXCOORD_0` points to [ST texture coordinates](https://computergraphics.stackexchange.com/a/4539). If `índices` is defined, it points to an [index array](https://webglfundamentals.org/webgl/lessons/webgl-indexed-vertices.html) — a single vertex position may be shared by multiple vertices, and each element of the index array indicates the position of a vertex.

The actual data is stored in binary format. There are three levels of indirection between the mesh primitive and the data itself:

- [Buffers](https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html#reference-buffer) point to the binary data itself. In a GLB file, there’s usually a single buffer that refers to the chunk of data after the JSON ends.
- [Buffer views](https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html#reference-bufferview) point to a subset of data within a specific buffer, marked by the number of bytes in the buffer before the buffer view starts and the length in bytes of the buffer view.
- [Accessors](https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html#reference-accessor) point to a specific buffer view and indicate how to interpret its data.

The values of the keys in the mesh primitive all point to accessors — the number corresponds to an index in the `accessors` array. By following the path from the mesh primitive all the way to the buffer, we can figure out where the actual data is and how to upload it to the GPU.

Here’s an example accessor for vertex position data:

```json
{
  "bufferView": 0,
  "componentType": 5126,
  "type": "VEC3"
}
```

- `bufferView` corresponds to the index of the buffer view pointing to the vertex data in the `bufferViews` array.
- `componentType` indicates the data type of the binary data. 5126 means the data is a series of 32-bit floating point numbers; [other possible `componentType` values are outlined in the spec](https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html#_accessor_componenttype).
- `type` indicates how many numbers in the data make up a single “item”. `VEC3` means that every three numbers in the data should be treated as one; [other possible `type` values are outlined in the spec](https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html#_accessor_type). In this case, `VEC3` makes sense because points in 3D space are sets of values for each of the X, Y and Z axes.
