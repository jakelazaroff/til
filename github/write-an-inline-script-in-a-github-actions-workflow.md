# Write an inline script in a GitHub Actions workflow

This is kind of meta because I'm mostly writing this TIL to test the workflow script of this repo, but anyway: the [`github-script`](https://github.com/actions/github-script) action allows you to write inline JavaScript within a GitHub Actions workflow. The string provided to the `script` property will be used as the body of an asynchronous function call.

```yaml
- uses: actions/github-script@v6
  id: script
  with:
    script: return "Hello!"
    result-encoding: string
- name: Get result
  run: echo "${{steps.script.outputs.result}}"
```

That example is from the official documentation; you can return an optionally JSON-encoded string and it'll be available under the `result` key of the step's outputs.

Some other things you can do:

- `require` NPM packages
- Find files with glob patterns via [`@actions/glob`](https://github.com/actions/toolkit/tree/main/packages/glob) (passed to your script as `glob`)
- Make GitHub API calls via a pre-authenticated [`octokit/rest.js`](https://octokit.github.io/rest.js) (passed to your script as `github`)
