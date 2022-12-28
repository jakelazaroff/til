# Add root certificates to a Debian container

I supposed this is potentially a problem with many images, but it definitely is with Debian (at lesst, as of December 2023): [Debian Docker images don't install the package `ca-certificates` by default](https://github.com/debuerreotype/docker-debian-artifacts/issues/15), which means any network requests that use TLS will fail with an error that looks something like this:

```
x509: certificate signed by unknown authority
```

The fix is pretty simple: just install the `ca-certificates` package, which adds root certificates so the OS can verify signatures.

```sh
apt install -y ca-certificates
```

That's the shell command to install the package. In a Dockerfile, it should probably look something like this:

```sh
RUN apt-get update
RUN apt install -y ca-certificates
```