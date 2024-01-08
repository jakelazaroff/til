# Run a local static file server over HTTPS

It feels like every server-side runtime has a one-shot command to run a local web server. Node has `npx http-server`, Python has `python -m http.server`, etc. That works fine if you can serve your files over HTTP, but what if you need to use HTTPS?

[Caddy](https://caddyserver.com) is a web server written in Go. It made a name for itself by being the first (I think?) to automatically handle SSL certificates via Let's Encrypt. On macOS, you can install it via [Homebrew](https://formulae.brew.sh/formula/caddy), which adds a command you can run from anywhere.

Here's how to use Caddy to serve static files in your current directory over HTTPS:

```bash
caddy file-server --domain localhost
```

Yup, [that's it](https://caddyserver.com/docs/quick-starts/https#the-file-server-command). There are a few more options for the [`file-server`](https://caddyserver.com/docs/quick-starts/static-files) subcommand if you need them, but an HTTPS static file server is a single short command with no config. How cool is that?