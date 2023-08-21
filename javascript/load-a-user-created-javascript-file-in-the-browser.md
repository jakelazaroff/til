# Load a user-created JavaScript file in the browser

I ran into this when building a [live coding audio playground](https://jakelazaroff.com/words/building-a-live-coding-audio-playground/), and presumably it's useful for other similar apps. The issue is that APIs like [`AudioWorklet`](https://developer.mozilla.org/en-US/docs/Web/API/AudioWorklet) expect to be given a separate JavaScript file to run as a worker or worklet, but for apps in which the user writes code themselves there's no easy way to serve that file (without running a webserver).

The trick is to use a combination of a [`File`](https://developer.mozilla.org/en-US/docs/Web/API/File) (which represents raw data, plus some file-specific things like a name) and [`URL.createObjectURL`](https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL_static), which lets you create "stub" URLs for `File` objects.

Here's how to use the trick create a Web Worker:

```js
// source code goes here
const src = "";

// create a fake JS file from the source code
const file = new File([src], "file.js");

// create a URL for the fake JS file
const url = URL.createObjectURL(file.slice(0, file.size, "application/javascript"));

// add the fake JS file as a Web Worker
const worker = new Worker(url);

// revoke the URL so as to not leak memory
URL.revokeObjectURL(url);
```

The call to `file.slice` is there to fix a Safari bug where it can't infer the MIME type.
