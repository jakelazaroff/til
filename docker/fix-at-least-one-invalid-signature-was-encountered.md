# Fix "At least one invalid signature was encountered"

When trying to build a Debian container, I encountered a bunch of errors like this upon running `apt update`:

```
W: GPG error: http://deb.debian.org/debian buster InRelease: At least one invalid signature was encountered.
E: The repository 'http://deb.debian.org/debian buster InRelease' is not signed.
```

The issue seems to be a lack of disk space. [This StackOverflow answer](https://stackoverflow.com/a/62510927) was indeed correct: running `docker image prune -f` and `docker container prune -f` fixed the problem.
