# List all commands in a Makefile

It's a pretty inscrutable, but Suvash Thapaliya has [a snippet of code that will add a `help` command to any Makefile](https://www.thapaliya.com/en/writings/well-documented-makefiles/).

Just add a `help` target with this long `awk` string:

```make
help:  ## Display this help
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m<target>\033[0m\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)
```

An example Makefile for a TypeScript project that looks something like this (long `help` target omitted):

```make
##@ Development
.PHONY: install typecheck

install: ## Install dependencies
  @pnpm install

typecheck: ## Check static types
  @pnpm tsc --noEmit

##@ Deployment
.PHONY: build

build: ## Build for production
  @rm -rf build
  @pnpm tsc
```

Running `make help` will show this:

```
$ make help

Usage:
  make <target>

Development
  install          Install dependencies
  typecheck        Check static types

Deployment
  build            Build for production

Helpers
  help             Display this help
```

The snippet makes it so that `##` after a target becomes the help text for that target, and `##@` before a bunch of targets turns that into a group. (In this example, `##@ Helpers` would have gone before `help`.)

To display the help text when just typing `make` alone, add `DEFAULT_GOAL:=help` at the top of the Makefile.
