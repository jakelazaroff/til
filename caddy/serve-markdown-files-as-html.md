# Serve Markdown files as HTML

[Caddy](https://caddyserver.com) is a simple web server that nonetheless has a bunch of cool features. One example is pre-processing responses using Go's [`text/template` package](https://pkg.go.dev/text/template).

Here's a Caddyfile that uses a template to render `.md` files as HTML:

```caddy
localhost:8080

file_server /*
templates

@md {
	file
	path *.md
}

rewrite @md /markdown.html
```

The first few lines set up the server:

- `localhost:8080` tells Caddy to serve at `localhost` on port 8080
- `file_server /*` tells it to run a file server for all paths below the current directory
- `templates` enables the [template middleware](https://caddyserver.com/docs/modules/http.handlers.templates), which treats the responses as Go templates

The `@md` block is a [named matcher](https://caddyserver.com/docs/caddyfile/matchers#named-matchers). It captures a set of constraints that can be reused elsewhere. In this case, it matches all paths that end in `.md`.

The final line `rewrite @md /markdown.html` serves the file `/markdown.html` whenever a request matches the `@md` block — i.e. whenever a Markdown file is requested.

Here's a simple example of what `markdown.html` could look like:

```html
{{$md := (include .OriginalReq.URL.Path | splitFrontMatter)}}
<!DOCTYPE html>
<html>
  <head>
    <title>{{$md.Meta.title}}</title>
  </head>
  <body>
    <h1>{{$md.Meta.title}}</h1>
    {{markdown $md.Body}}
  </body>
</html>
```

At the top, we get the original request path, include the Markdown file, split the front matter and store it in the variable `$md`.

The page title is set to the `title` property in the front matter.

The body renders the `title` from the front matter in an `<h1>` tag, then uses the [`markdown`](https://caddyserver.com/docs/modules/http.handlers.templates#markdown) template function to render the Markdown as HTML.
