# tinyevent

A tiny event dispatcher

[![NPM Version][npm-version]][npm-url] [![NPM Downloads][npm-total]][npm-url] [![NPM Downloads][npm-month]][npm-url] [![NPM Downloads][license]][npm-url]

[npm-version]: https://img.shields.io/npm/v/tinyevent.svg?style=flat
[npm-url]: https://npmjs.org/package/tinyevent
[npm-total]: https://img.shields.io/npm/dt/tinyevent.svg?style=flat
[npm-month]: https://img.shields.io/npm/dm/tinyevent.svg?style=flat
[license]: https://img.shields.io/npm/l/tinyevent.svg?style=flat


## Installation
```sh
$ npm install tinyevent --save
```

## Usage
### commonjs
```javascript
var tinyevent = require('tinyevent');
```

### browser
```html
<script src="dist/tinyevent.min.js"></script>
```
```javascript
var tinyevent = window.tinyevent;
```

### Example
```javascript
var dispatcher = tinyevent();

var fn = function(e) {
  console.log(this, e.type, e.target, e.detail);
  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();
};

dispatcher.on('myevent', fn);
if( dispatcher.fire('myevent', {a:1}) ) {
  var notprevented = dispatcher.fire('myevent', {a:2}, 'up');
}

dispatcher.once('myevent', function(e) {});
dispatcher.off('myevent', fn);

var b = dispatcher.has('myevent');
dispatcher.has(fn);
dispatcher.pause();
dispatcher.resume();

```

### License
Licensed under the MIT License.
See [LICENSE](./LICENSE) for the full license text.
