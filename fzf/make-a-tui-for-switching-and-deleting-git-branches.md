# Make a TUI for switching and deleting git branches

Is dealing with git branches annoying to anyone else? There's a lot of typing long branch names, especially if you're cleaning up a bunch of old branches at oncex.

Enter [fzf](https://github.com/junegunn/fzf), which provides a nice terminal UI for selecting things. You pipe in some output and it shows each line in a list that you can navigate by typing to search or using the arrow keys.

For example, here's a simple one liner for making a selectable list of your git branches:

```sh
git branch | fzf | cut -c 3-
```

The item you select is the return value — in this case, the name of the branch.
(The `cut -c 3-` removes the leading whitespace and `*` from the branches.)

We can get a bit fancier, though. If you pass a `--preview` flag followed by a command with a placeholder, fzf will also display the output of a that second command in a "preview" panel on the right. The placeholder is replaced by the currently highlighted option, so the preview changes as you navigate.

So to build a terminal UI for switching branches, you might use this:

```sh
git branch | fzf --preview 'git log -p main..{-1} --color=always {-1}' | cut -c 3- | xargs git switch
```

Deleting branches is pretty similar. `fzf` has a flag `-m` that lets you select multiple options. Pipe that to `xargs git branch -d` and you're good:

```sh
git branch | fzf --preview 'git log -p main..{-1} --color=always {-1}' | cut -c 3- | xargs git branch -d
```

I have aliases for both of those commands in my fish config:

```fish
alias gs="git branch | fzf --preview 'git log -p main..{-1} --color=always {-1}' | cut -c 3- | xargs git switch"
alias gbd="git branch | fzf --preview 'git log -p main..{-1} --color=always {-1}' | cut -c 3- | xargs git branch -d"
```
