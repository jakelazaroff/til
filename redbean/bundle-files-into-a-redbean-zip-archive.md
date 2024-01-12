# Bundle files into a redbean zip archive

[redbean](https://redbean.dev/) is a zip file that contains a webserver that runs on macOS, Windows, Linux and a few other operating systems. You download an executable that's also a zip archive, and it'll serve any files you add to the archive.

There's extensive documentation on the redbean API, but less on how to actually do things with a zip archive. Here's a brief guide to getting up and running on macOS:

First, download the latest redbean release and make it executable:

```sh
curl https://redbean.dev/redbean-latest.com >redbean.com
chmod +x redbean.com
```

Running the binary with `./redbean.com` starts a web server on port 8080. If you visit http://localhost:8080 in your browser, you'll see a directory listing of all the files in the zip archive.

From the command line, you can see that same list of files with the `unzip` command. The `Z` flag tells it to print info instead of extracting the archive, and the `1` flag tells it to only print filenames.

```sh
unzip -Z1 redbean.com
```

There are a bunch of files in `/usr/share` related to time zones and SSL. If you want to ignore these, you can add `-x "usr/*"` to your command:

```sh
unzip -Z1 redbean.com -x "usr/*"
```

redbean comes with a bunch of standard files (such as `help.txt`, which contains the documentation) that you might not want in your actual server. You can remove files with `zip -d`:

```sh
zip -d redbean.com help.txt
```

If you want to make things a little easier, you can use [`fzf`](https://github.com/junegunn/fzf) to make a nice interactive terminal app. Here's a command that will list all the files in the redbean archive, let you select one or more with your arrow keys and then delete them:

```sh
unzip -Z1 redbean.com -x "usr/*" | fzf -m | xargs -I{} zip -d redbean.com {}
```

There are a bunch of examples in the redbean documentation about adding files to the archive. The most useful is probably adding the contents of an entire directory:

```sh
zip -r -j redbean.com src/.
```

Context switching to add files and restart redbean after every change is annoying. The [`entr`](https://eradman.com/entrproject/) utility can automatically re-run a command every time it detects files change. This loop will zip a directory into redbean, run the server and re-zip and restart whenever you add or change a file:

```sh
while true; do
  find src -print | entr -ddr sh -c "zip -r -j redbean.com src/. && ./redbean.com"
  [[ $? -eq 0 ]] && break
done
```
