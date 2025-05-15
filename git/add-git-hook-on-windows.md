# Add Git hook on Windows

[Git Hooks](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks) are scripts that Git runs for you when certain actions occur.

At root of every repo, there's a `.git` directory. Inside, there's a folder called `hooks` that contains a bunch of files named things like `pre-commit.sample`. Each of those files is an example of a Git Hook. To create one for _real_, create a file of the same name without the extension, and Git will automatically run the script for you at the appropriate time.

At least, that's what I thought would happen when I tried adding this pre-commit hook on Windows:

```console
npm run typecheck
```

When I tried to commit it, though, I kept getting this error:

```
'pre-commit' is not recognized as an internal or external command,
operable program or batch file.
```

I tried running `attrib +x .git\hooks\pre-commit`, changing the extension to `.bat` and a bunch of other things that didn't work before stumbling upon this StackOverflow answer that held the key: [Git for Windows has an embedded bash shell](https://stackoverflow.com/a/51005120)!

The fix turned out to be just adding a hashbang to the top of the script and write it as though it were a Unix shell script: 

```sh
#!/bin/sh
npm run typecheck
```
