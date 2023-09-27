# Run GitHub Actions locally

A common pain point with GitHub Actions is that the feedback loop is so long: make a change, push, wait for it to run, find an error, try to debug, repeat. Which is why I was so happy to discover [`act`](https://github.com/nektos/act), a tool for running GitHub Actions locally! The only prerequisite is Docker, which `act` uses to pull the appropriate images to run your actions.

By default, `act` will run the action for the `push` event, although you can configure it to run specific events or jobs:

```bash
# run the `push` event:
act

# run a specific event:
act pull_request

# run a specific job:
act -j test
```

If your action needs a GitHub token (for example, if you're checking out your code with [`actions/checkout`](https://github.com/actions/checkout)) you can supply it with the `-s` flag (for "secrets") and the `GITHUB_TOKEN` environment variable. This is easiest if you have the [GitHub CLI](https://cli.github.com/) installed:

```bash
act -s GITHUB_TOKEN="$(gh auth token)"
```

Note that the [official docs](https://github.com/nektos/act#github_token) note that supplying your token in this way can leak it to the shell history.
