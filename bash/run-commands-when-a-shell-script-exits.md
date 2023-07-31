# Run commands when a shell script exits

Sometimes it's useful to run commands when a shell script exits. For example, we might want to hide the cursor while playing a progress animation, and show it again when finished. But what if the user hits `ctrl-c` to exit the application? If we don't explicitly re-enable the cursor, it'll remain hidden even after the script has exited.

A bit of searching turned up the [`trap`](https://man7.org/linux/man-pages/man1/trap.1p.html) command, which runs another command when the program receives a signal from the operating system.

The syntax is `trap [action condition...]`. Here's an example of running some cleanup code when the program receives `SIGINT` (which is triggered by `ctrl-c`) or `SIGTERM`:

```bash
cleanup () {
    # commands go here
    exit
}

trap cleanup INT TERM
```