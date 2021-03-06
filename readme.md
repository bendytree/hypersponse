[![NPM](https://nodei.co/npm/hypersponse.png?downloads=false&downloadRank=false)](https://nodei.co/npm/hypersponse/)
[![Build Status](https://travis-ci.org/bendytree/hypersponse.svg?branch=master)](https://travis-ci.org/bendytree/hypersponse)

# hypersponse

Simple buffering for [hyperquest](https://github.com/substack/hyperquest) with the callback style of [request](https://github.com/mikeal/request).

This module has no dependencies and works in the browser with [browserify](http://browserify.org). 

# Why

Buffering a stream and normalizing callback paths can pretty verbose - especially
if you find yourself doing it a lot.

NOTE: Don't buffer unless you have to. Buffering means loading the entire response into RAM all at once.


# Install

Using [npm](https://npmjs.org):

```
npm install hyperquest --save
```

# Example

``` js
var hyperquest = require('hyperquest');
var hypersponse = require('hypersponse');

var r = hyperquest('http://localhost:8000');
hypersponse(r, function(error, response, buffer){
  ...
});
```

# License

MIT

