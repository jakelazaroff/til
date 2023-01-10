# Rerun a command when files change

A pretty common programming workflow: make a change, save a file, rebuild the app. When I'm writing JavaScript, if whatever tool I'm working with doesn't support this on its own, I usually reach for [nodemon](https://nodemon.io/). When I'm writing something else, like Go, I usually… uh, just restart manually every time I make a change.

Well, not anymore: there's an awesome little command line tool called [`entr`](http://eradman.com/entrproject/) that I learned about from [Julia Evans' blog](https://jvns.ca/blog/2020/06/28/entr/). It's not installed by default on macOS, but it's available on [Homebrew](https://formulae.brew.sh/formula/entr).

The TL;DR is that you take a list of files to watch and pipe it to `entr` plus some command, and `entr` will rerun that command whenever one of those files changes. Like if you want to rerun tests when your files change:

```sh
find . -name *.ts | entr npm test
```

A useful command to use in combination is `git ls-files `, which lists all the files that git is tracking:

```sh
find . -name *.ts | entr npm test
```

The `-r` option will make it restart long-running tasks, which is perfect for webservers:

```sh
git ls-files | entr -r node server.js
```

There's also the `-c` option, which will clear the screen every time it reruns:

```sh
git ls-files | entr -c tsc --noEmit
```
