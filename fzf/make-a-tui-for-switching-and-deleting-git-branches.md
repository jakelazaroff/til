# Make a TUI for switching and deleting git branches

Is dealing with git branches annoying to anyone else? There's a lot of typing long branch names, especially if you're cleaning up a bunch of old branches at once.

Enter [fzf](https://github.com/junegunn/fzf), which provides a nice terminal UI for selecting things. You pipe in some output and it shows each line in a list that you can navigate by typing to search or using the arrow keys.

For example, here's how you'd make a selectable list of your git branches:

```sh
git branch | fzf
```

The item you select is the return value — in this case, the name of the branch. So to build a terminal UI for switching branches, you'd use this:

```sh
git branch | fzf | xargs git switch
```

Deleting branches is pretty similar. `fzf` has a flag `-m` that lets you select multiple options. Pipe that to `xargs git branch -d` and you're good:

```sh
git branch | fzf -m | xargs git branch -d
```

I have aliases for both of those commands in my fish config:

```fish
alias gs="git branch | fzf | xargs git switch"
alias gbd="git branch | fzf -m | xargs git branch -d"
```
