# on-render [![Build Status](https://travis-ci.org/airtoxin/on-render.svg)](https://travis-ci.org/airtoxin/on-render)

express middleware that execute a listener when a response render is called.

## install

`$ npm install on-render`

## examples

```js
var express = require('express');
var onRender = require('on-render');

var app = express();
var onRenderListener = onRender.create(function (req, res, rendering, view, options) {
    console.log(rendering); // logged rendered content
});

app.use(onRenderListener);
```

## api

### `onRender.create(listenerFunction)`

Create express middleware that execute a listener function when a response render is called.

### `listenerFunction(req, res, rendering, view, options)`

Called when a response render is called.

+ `req`: express request object
+ `res`: express response object
+ `rendering`: rendered contents string
+ `view`: rendered view name
+ `options`: options object with rendering
