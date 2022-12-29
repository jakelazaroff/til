# Run a command if there are unstaged changes

A quick one liner to run a command only if there are unstaged changes: the `--quiet` flag of [`git diff`](https://git-scm.com/docs/git-diff). The flag does two things:

1. disables all output of the command, and
2. exits with 1 if there are differences, and 0 if there are no differences

That means you can combine it with boolean operators to only run another command if files have (or have not) changed:

```sh
# run `somecommand` if there are unstaged changes
git diff --quiet || somecommand

# run `somecommand` if there are unstaged changes
git diff --quiet && somecommand
```

Note that this only works for unstaged changes in files that git already tracks; new files and changes staged with `git add` are not counted.

Note too that because an exit code of 0 indicates success and anything else indicates failure, the boolean operators are flipped: `&&` only evaluates the right side if the left is `0`, and `||` only evaluates the right side if the left is not `0`.
