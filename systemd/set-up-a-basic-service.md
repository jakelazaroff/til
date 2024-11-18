# Set up a basic service

I use [systemd](https://systemd.io) pretty infrequently, so whenever I need to stand up some persistent process on a server I spend a bunch of time looking things up again. Hence: this TIL!

systemd does a lot of things, but the core thing we care about here is keeping some persistent process up and running.

We tell systemd how to do that using a unit file, which is an [INI file](https://en.wikipedia.org/wiki/INI_file) with the extension `.service`. There are [a bunch of places in which systemd will look for unit files](https://unix.stackexchange.com/a/367237); on my Ubuntu VPS I chose `/lib/systemd/system`.

Unit files are sets of key/value pairs broken up into sections. Most of important stuff is in the `Service` section:

- `EnvironmentFile` tells systemd to load the key/value pairs in the corresponding file as environment variables before starting the process.
- `WorkingDirectory` tells systemd the directory from which the process will run.
- `ExecStart` is the command that systemd will use to start the process.
- `Restart` tells systemd when it should restart the process. Setting it to "always" will have it restart no matter what the exit code is.
- `StandardOutput` and `StandardError` tell systemd where to send stdout and stderr. I used to set this to `syslog` but it recently started yelling at me that I should use `journal`, so I switched.

Let's pretend we're making a service called `api`. We'd store the unit file at `/lib/systemd/system/api.service`, with corresponding file and directory names as necessary:

```ini
[Unit]
Description=api
After=network.target

[Service]
EnvironmentFile=/etc/sysconfig/api
WorkingDirectory=/var/www/api
ExecStart=/usr/bin/node src/index.mjs
Restart=always
StandardOutput=journal
StandardError=journal
SyslogIdentifier=api

[Install]
WantedBy=multi-user.target
```

There are also a couple commands to remember:

- `systemctl start api` starts the service if it's stopped.
- `systemctl restart api` restarts the service.
- `systemctl status api` checks the service's status.
- `journalctl -u api` returns all the service's logs. A `-f` flag on the end will turn it into a live tail.
