# Build all files with a given extension

The most basic use of Make (other a simple task runner) is reading some files, compiling them somehow and outputting other files.

Here's a minimal example that takes an existing file with extension `.in` (`some/dir/anything.in`) and writes "Created from filename.in" to a sibling file with the extension `.out`:

```makefile
%.out: %.in
	echo "Created from $<" > $@
```

`$<` and `$@` are two special sigils that are replaced with the actual filenames of the target and the first dependency, respectively. So if make were invoked with `make some/dir/anything.out`, the expanded command would read `echo "Created from /some/dir/anything.in" > /some/dir/anything.out`.

Note that the target needs to correspond to a specific input file that exists on the filesystem; if it doesn't, make will say something like `` make: *** No rule to make target `nonexistentfile.out'.  Stop.`` In order to build **all** files with a given extension, we need to use wildcards. [Makefile tutorial](https://makefiletutorial.com/#-wildcard-1) has a short summary of the different types, and it's not entirely clear to me what the difference is, but here's my best understanding of how to use them:

```make
INPUTS := $(wildcard *.in)
OUTPUTS := $(patsubst %.in,%.out,$(INPUTS))

%.out: %.in
	echo "Created from $<" > $@

build: $(OUTPUTS)
	echo "Built!"
```

This creates two variables, `INPUTS` and `OUTPUTS`. For `INPUTS`, `$(wildcard *.in)` will be expanded to all files with the extension `.in`. The list can be filtered further: `$(wildcard src/**/*.in)` will only show files in descendent directories of `src`. For `OUTPUTS`, `$(patsubst %.in,%.out,$(INPUTS))` changes the extension of every `.in` file name in `INPUTS` to `.out`.

The task `build: $(OUTPUTS)` will build all the input files. Let's say there are two files adjacent to the makefile, `one.in` and `two.in`. It's easiest to think of this in a few steps:

1. Run `make build` from the command line.
2. Make sees that `build` has a dependency on `$(OUTPUTS)`.
3. `OUTPUTS` expands to `one.out two.out` (since it's all the files in `INPUTS` with their extension replaced).
4. Make runs the dependent tasks `make one.out` and `make two.out`, which both correspond to the `%.out: %.in` task. You can think of this as running that task multiple times with different arguments.
5. The `%.out: %.in` task builds `one.out` and `two.out`.
6. Now that the dependencies have been satisfied, make runs the `build` task.

The benefit to using make is that if we run through the steps again, it will only re-run the `%.out: %.in` task for `.out` files that are older than the corresponding `.in` files.
