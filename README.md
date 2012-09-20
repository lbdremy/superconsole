# superconsole

__Note__ : Mostly a fork of [console-trace](https://github.com/LearnBoost/console-trace) created by [Learnboost](https://www.learnboost.com/) with more options.

Extends the native Node.JS `console` object to prefix logging functions
with the [CallSite](http://github.com/visionmedia/callsite) information, timestamp and log level.

To read more about runtime stack trace introspection you can refer to [this
article](http://www.devthought.com/2011/12/22/a-string-is-not-an-error/#beyond).

## Installation

    $ npm install superconsole

### Syntax:

```javascript
require('superconsole')([options])
```

### Available Options:

* __callsite__ - (`Boolean`: defaults to false) prepend the callsite info even without accessing methods from the `t` or `traced` getters.
* __level__ - (`Boolean` : defaults to false) prepend the log level to the log
* __timestamp__ - (`Boolean` : defaults to false) prepend the ISO Date to the log
* __logLevel__ - (`String` : defaults to "debug") call to console[level] under logLevel will be skipped
* __cwd__ - (`String`: defaults to `process.cwd()`) the path that will be stripped from the callsite info
* __colors__ - (`Boolean|Object`: defaults to true) terminal colors support flag or a custom color object
* __right__ - (`Boolean`: defaults to false) callsite alignment flag, when true prints infos on the right



### Examples:

```javascript
require('superconsole')
```

You can add the `t` or `traced` getter to your calls to obtain a stacktrace:

```js
console.t.log('a');
console.traced.log('a');
```

Or:

```js
require('superconsole')({
  callsite: true,
  level : true,
  timestamp : true,
  logLevel : 'info'
})

```

## Credits

  * [Guillermo Rauch](https://github.com/guille)
  * [Kilian Ciuffolo](https://github.com/kilianc)
  * [Nicholas Manousos](https://github.com/nmanousos) 
  * [Remy Loubradou](https://github.com/lbdremy)