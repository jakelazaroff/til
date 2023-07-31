# Control terminal appearance with `tput`

To control things like text color and cursor position in a terminal emulator, you need to use [ANSI escape codes](https://en.wikipedia.org/wiki/ANSI_escape_code). These are mostly-inscrutable character sequences that can be printed to perform specific actions.

For example, here's how to print some text in red followed by some text in black:

```bash
echo "\033[0;31m" red text "\033[0;30m" black text
```

The strings `\033[0;31m` and `\033[0;30m` are the escape code for red and black foregrounds, respectively.

One problem is that not all terminals support all codes. There's a database called [terminfo](https://en.wikipedia.org/wiki/Terminfo) that describes the capabilities of each terminal, determined by an identifier (you can see which identifier your terminal is using by running `echo $TERM`). Each terminal's capabilities are identified by "capnames".

Luckily, there's a command to handle all this called [`tput`](https://www.gnu.org/software/termutils/manual/termutils-2.0/html_chapter/tput_1.html). Here's how to use it to print the same text as the previous example:

```bash
echo "$(tput setaf 1)" red text "$(tput setaf 0)" black text
```

`setaf` is the capname for changing the foreground color, and 1 and 0 are the standard color codes for red and black. I'm not sure whether there's a list mapping human-readable color names to numbers, but you can easily fix that with environment variables:

```bash
RED=1
BLACK=0
echo "$(tput setaf $RED)" red text "$(tput setaf $BLACK)" black text
```

`tput` can do more than set colors. For example, you might run `tput civis` and `tput cnorm` to hide the cursor during a progress animation, then show it again after:

```bash
# hide the cursor
tput civis

# fancy progress animation code goes here

# show the cursor
tput cnorm
```