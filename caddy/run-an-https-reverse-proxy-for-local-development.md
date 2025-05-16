# Run an HTTPS reverse proxy for local development

Really the title should be something like "run an SSL-terminating reverse proxy", but most of the resources on the subject talk about using "HTTPS for local development", so here we are.

The standard advice is to use a tool called [mkcert](https://github.com/FiloSottile/mkcert), which installs a root CA on your computer and issues self-signed certificates for local domains. That works, but the drawback is that your app now needs to deal with SSL termination. It's not the end of the world, but in production SSL termination probably happens at the network layer before your app receives any requests.

That's where web-server-Swiss-army-knife Caddy comes in! Rather than using HTTPS for your local development server, have Caddy handle the SSL stuff and proxy the request back to your local development, which (none the wiser) serves plain old unencrypted HTTP.

Unsurprisingly, [Caddy's documentation](https://caddyserver.com/docs/quick-starts/reverse-proxy) reveals that there's one-liner to do this:

```sh
caddy reverse-proxy --to http://localhost:8080
```

Replace `8080` with whatever your development server's local port is. Boom: an SSL-terminating reverse proxy (or, if you prefer, "HTTPS") in local development, with no changes to your code!
