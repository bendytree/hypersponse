
# hypersponse

Simple response buffering for [hyperquest](https://github.com/substack/hyperquest).

The simplicity and reliability of hyperquest, with the callback simplicity of [request](https://github.com/mikeal/request).

This module has no dependencies and works in the browser with [browserify](http://browserify.org). 

# Why

Buffering a stream and normalizing callback paths can pretty verbose - especially
if you find yourself doing it a lot.

NOTE: Naturally you shouldn't buffer unless you have to. Buffering means loading
the entire response into memory all at once.


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

