# Reload a webpage when a file changes

I store my blog in a git repo of plain Markdown files. It's a pretty spartan setup, which I like — it forces me to keep all my writing extremely portable between website generators.

To preview the files in my browser, I [render the Markdown with Caddy](/caddy/serve-markdown-files-as-html/). I wanted to add live reloading when I made a change, which was tricky because Caddy is just acting as a plain file server here. With the help of ChatGPT, I was able to come up with a solution involving a bunch of shell scripts.

The general workflow:

1. Create a temporary file using [`mktemp`](https://www.gnu.org/software/autogen/mktemp.html).
2. Use the network utility [`socat`](http://www.dest-unreach.org/socat/) to listen to network requests, setting up a server-sent events connection and sending any lines appended to the file.
3. Use [`entr`](http://eradman.com/entrproject/) to append events to the temporary file whenever a watched file changes.
4. On the webpage, listen for server-sent events and reload the page when one comes through.
5. Use [`trap`](https://tldp.org/LDP/Bash-Beginners-Guide/html/sect_12_02.html) to clean up the temporary file when the process exits.

Let's go through the steps one by one.

First, we run `mktemp` to make a temporary file, saving the path in a variable called `$TMPFILE`:

```sh
TMPFILE=$(mktemp)
```

Next, we set up step 5 using `trap` to remove `$TMPFILE` when the process exits:

```sh
trap 'rm -f $TMPFILE; exit' INT TERM EXIT
```

Now we're getting to the meat of things. We use `socat` to listen for requests on port 8081. When a client connects, we initially responds with `HTTP/1.1 200 OK` and a bunch of headers, then keep the connection open and tail any lines appended to `$TMPFILE`.

```sh
socat TCP-LISTEN:8081,fork,reuseaddr SYSTEM:' \
  echo HTTP/1.1 200 OK; \
  echo Content-Type\: text/event-stream; \
  echo Cache-Control\: no-cache; \
  echo Connection\: keep-alive; \
  echo; \
  tail -n0 -F $TMPFILE'
```

The `-n0` flag to `tail` makes it start at the _end_ of `$TMPFILE`, so the client only receives events sent after opening the connection.

While that's running, we run `entr`, appending `reload` events to `$TMPFILE` whenever a watched file changes. In this case, it's watching files that are tracked by git.

```sh
git ls-files | entr -s 'echo "event: reload\ndata:\n" >> $TMPFILE'
```

One last important thing: these all need to run concurrently. You can do that by chaining them together using `&`.

ChatGPT tells me that I need to run [`wait`](https://linux.die.net/man/2/wait) at the end of the `&` chain to ensure that `socat` and `entr` don't quit prematurely, but in my testing that doesn't seem to matter.

Here's the full shell script:

```sh
# Create a temporary file
TMPFILE=$(mktemp)

# Set the trap to remove the temporary file on INT, TERM and EXIT
trap 'rm -f $TMPFILE; exit' INT TERM EXIT

# Start the server-side events server and tail lines from the temporary file
socat -v -v TCP-LISTEN:8081,fork,reuseaddr SYSTEM:'echo HTTP/1.1 200 OK; echo Content-Type\: text/event-stream; echo Cache-Control\: no-cache; echo Connection\: keep-alive; echo; tail -n0 -F '"$TMPFILE"'' &

# Append lines to the temporary file whenever a file tracked by git changes
git ls-files | entr -s 'echo "event: reload\ndata:\n" >> '"$TMPFILE"'' &

# Wait for background processes to finish
wait
```

On the webpage side, we can connect to the server, listen for `reload` events and reload the page when we receive one:

```js
new EventSource("http://localhost:8081").addEventListener("reload", () => location.reload());
```
