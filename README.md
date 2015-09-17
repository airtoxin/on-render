# on-render

Execute a listener when a response render is called.

# install

`$ npm install on-render`

# examples

```js
var express = require('express');
var onRender = require('on-render');

var app = express();
var onRenderListener = onRender.create(function (req, res, rendering, view, options) {
    console.log(rendering);
});

app.use(onRenderListener);
```
