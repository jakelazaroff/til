# Create a file without an extension

I was trying to save a file without an extension from Notepad. For some reason, even if I removed the extension from the filename and selected "All files", it still saved as a `.txt`.

The trick turned out to be putting the file name in quotes. So for example, rather than saving the file as `filename` (which results in a file named `filename.txt`) I needed to save it as `"filename"` (which results in `filename` — removing the quotes but not adding the extension).
