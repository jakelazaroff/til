# Link against a C++ file

While Rust natively supports linking against C, it needs an extra binding layer in order to link against C++. Although a library called [bindgen](https://rust-lang.github.io/rust-bindgen/introduction.html) can generate those bindings automatically, I wanted to see how to do it myself.

Rust has extensive documentation on writing a [foreign function interace](https://doc.rust-lang.org/nomicon/ffi.html); here's a minimal example of how to do it.

Let's say we want to call this function in `lib/inc.cpp` from Rust:

```cpp
#include "inc.h"

int twice(int x) { return x * 2; }
```

In the header file `lib/inc.h`, `extern "C"` [makes the function name linkable from C code](https://stackoverflow.com/a/1041880):

```cpp
extern "C" {
int twice(int x);
}
```

We can compile that function into a shared library `lib/libinc.so`:

```bash
g++ -shared lib/inc.cpp -o lib/libinc.so
```

(Note that in this case, we're defining a C-linkable interface in the C++ file itself rather than adding an extra layer between C++ and Rust. If we couldn't change the C++ source code, we could add another file in C or C++ that calls the C++ library, and then expose the C-linkable interface from _that_ file.)

In Rust, we can define a list of foreign functions within an `extern` block, and then call into them from Rust code. Rust treats all foreign functions as unsafe, so we need to call it from within an `unsafe` block:

```rs
extern "C" {
    fn twice(x: i32) -> i32;
}

fn main() {
    unsafe {
        println!("{}", twice(2));
    }
}
```

Trying to build or run this will result in a linker error about undefined symbols. We need to tell Rust how to find the library, which we can do by placing a [`build.rs` file](https://doc.rust-lang.org/cargo/reference/build-scripts.html#rustc-link-lib) in the package root. TL;DR from the docs:

> Build scripts communicate with Cargo by printing to stdout. Cargo will interpret each line that starts with cargo: as an instruction that will influence compilation of the package. All other lines are ignored.

Here's our `build.rs`:

```rs
fn main() {
    println!("cargo:rustc-link-search=lib");
    println!("cargo:rustc-link-lib=inc");
}
```

- `cargo:rustc-link-search=lib` tells Cargo to look in the directory `lib` for C libraries
- `cargo:rustc-link-lib=inc` tells Cargo to link against `libinc` (the `lib` prefix is implied)

Boom! Running `cargo run` should now correctly print `4` to the console.
