# Install Volta with Homebrew

It seems so easy: just `brew install volta` and you have a modern Node version manager ready to go!

Unfortunately, when I tried to install Node, I ran into this error:

```
  note: cannot find command node. Please ensure that /Users/jake/.volta/bin is available on your PATH.
```

I suppose I could have just added that directory to my `PATH` and been done with it, but it seemed odd that the installation wouldn't have automatically set that up?
I googled around and found [this GitHub issue](https://github.com/volta-cli/volta/issues/927) about Homebrew requiring you to run [`volta setup`](https://docs.volta.sh/reference/setup) manually.

Turns out `volta setup` is a command that automatically modifies your shell config file to set the appropriate environment variables!

So, installing Volta with Homebrew actually requires two commands:

```sh
brew install volta
volta setup
```
