# List all files tracked by git

Sometimes it's convenient to list all the files tracked in a git repo (for example, when using [`entr`](http://eradman.com/entrproject/) to watch files for changes). Rather than trying to remember which arguments to pipe to `find` to get the right list of files, [git provides a nice concise command](https://git-scm.com/docs/git-ls-files):

```sh
git ls-files
```
