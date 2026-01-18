# Load an import map from a JSON file

One of the cooler features of ES modules is [import maps](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules#importing_modules_using_import_maps), which let you change JavaScript identifier names so you can import them as though they were Node modules.

Basically, you put a script tag like this in your HTML, before your module graph loads:

```html
<script type="importmap">
{
  "imports": {
    "preact": "https://esm.sh/preact"
  }
}
</script>
```

And then you can write `import { h } from "preact"` rather than `import { h } from "https://esm.sh/preact"`.

Unfortunately, the spec doesn't allow import maps to be loaded remotely — which is to say, you can't do something like this:

```html
<script type="importmap" src="/importmap.json"></script>
```

You _can_ create them dynamically, though! Baldur Bjarnason found a way: [use a non-module script to inject a script tag](https://www.baldurbjarnason.com/2023/dynamic-import-map/)!

```html
<script>
  const importMap = {
    // import map goes here
  };

  const importmap = document.createElement("script");
  importmap.type = "importmap";
  importmap.textContent = JSON.stringify(importMap);
  document.currentScript.after(importmap);
</script>
```

But how to load our JSON file into the script? We can't `import` them — remember, import maps need to load before any modules — and we can't `fetch`, since there's no way to force the browser to wait for the response before it continues executing other script tags.

Did you know that [`XMLHttpRequest` supports synchronous requests](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest_API/Synchronous_and_Asynchronous_Requests)? If we pass `false` as the third parameter to `XMLHttpRequest.open`, it will block until the response comes back — meaning the browser won't continue executing any other JavaScript.

Once the response comes back, we can insert the import map script into the DOM and everything is hunky dory:

```js
// make a synchronous XMLHttpRequest for the import map
const xhr = new XMLHttpRequest();
xhr.open("GET", document.currentScript.dataset.src, false);
xhr.send();

// create a <script type="importmap"> with the response text
const importmap = document.createElement("script");
importmap.type = "importmap";
importmap.textContent = xhr.responseText;

// insert the <script type="importmap"> after the current script
document.currentScript.after(importmap);
```

You'd use that like this:

```html
<script src="/importmap.js" data-src="/importmap.json"></script>
```

Caveats abound: this will _block all rendering_ while that `XMLHttpRequest` is in flight! I've been using it mostly for local development, where latency is low and the chance of a request failing is basically non-existent.
