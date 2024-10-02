# Update all submodules to latest commit on origin

I use [Git submodules](https://git-scm.com/book/en/v2/Git-Tools-Submodules) in a bunch of projects, and one common task is checking out the latest commit on the origin.

Since Git 1.8.2 this is a one-liner, but I'm always forgetting it, so here it is:

```sh
git submodule update --remote --rebase # or `--merge` if you swing that way
```

The answers to [this StackOverflow question](https://stackoverflow.com/q/5828324) have some more detail (including a command that works on earlier versions of Git).
