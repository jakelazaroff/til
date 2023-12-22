# Prevent ClangFormat from breaking before curly braces

For some unfathomable reason, C and C++ developers sometimes put line breaks before curly braces:

```c
int main()
{
  for (int i = 0; i < 10; i++)
  {
    printf("%d\n", i);
  }
}
```

It's also the default formatting style in the code formatter [ClangFormat](https://clang.llvm.org/docs/ClangFormat.html).

Fortunately, it's configurable by setting the [`BreakBeforeBraces` option](https://clang.llvm.org/docs/ClangFormatStyleOptions.html#breakbeforebraces) to `Attach` in your `.clang-format` file:

```
BreakBeforeBraces: Attach
```

Much more readable:

```c
int main() {
  for (int i = 0; i < 10; i++) {
    printf("%d\n", i);
  }
}
```
