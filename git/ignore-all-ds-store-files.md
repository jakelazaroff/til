# Ignore all `.DS_Store` files

If you use git on a Mac, chances are you've accidentally committed a `.DS_Store` to a repo. I used to reflexively add `.DS_Store` to all my `.gitignore` files to avoid ever repeating that mistake.

But there's a better way! You can add a global `.gitignore` file to your global config with this command:

```bash
git config --global core.excludesFile '~/.gitignore'
```

The single quotes around `~/.gitignore` aren't strictly necessary; if you don't use them, the `~` will just get expanded into the absolute path to your home directory.

Under the hood, that command just adds this to your `~/.gitconfig`:

```
[core]
        excludesFile = ~/.gitignore
```
