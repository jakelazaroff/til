# Create `.venv` folders within projects

By default, [Poetry](https://python-poetry.org/) creates virtual environment directories in a global location (`/Users/username/Library/Caches/pypoetry/virtualenvs` on macOS). Since tools like VS Code need to be able to find a virtual environment to be able to do things like autocompletion of dependencies, it's convenient to colocate that directory with a project's source code.

The command to do that is short and sweet:

```bash
poetry config virtualenvs.in-project true
```