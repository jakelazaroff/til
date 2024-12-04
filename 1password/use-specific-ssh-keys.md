# Use specific SSH keys

One reason I use 1Password over Apple Passwords is that it also [manages your SSH keys](https://developer.1password.com/docs/ssh/).

I recently got a new job, and because _all_ my passwords live in 1Password (including employee benefits and such, which use my personal email) I logged into my personal vault on my work computer.

That meant both my personal computer's SSH key (from my personal vault) and my work computer's SSH key (from my employer's vault) were synced on that computer. And annoyingly, 1Password kept asking if I wanted to use my personal computer's SSH key on my work computer.

It turns out that you can fix that! In the menu on the top right of an SSH key in 1Password, there's an option to "Configure for SSH Agent…". That opens a file called `agent.toml` in your text editor.

Most of the file is a long comment explaining how it works, and it's also [painstakingly documented online](https://developer.1password.com/docs/ssh/agent/config/), but here's the gist:

```toml
[[ssh-keys]]
account = "My Work Account Name"
```

Basically, you have as many of those `[[ssh-keys]]` items as you want with the criteria for which keys to include. You can specify them by `account`, `vault` or `item`. In my case, it's enough to just specify the account, but if the company leans more into 1Password I could get even more specific.
