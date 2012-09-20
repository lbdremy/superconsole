
/**
 * Module dependencies.
 */

var callsite = require('callsite')
  , tty = require('tty')
  , isatty = Boolean(tty.isatty() && process.stdout.getWindowSize)
  , defaultColors = { log: '90', error: '91', warn: '93', info: '96' , debug : '99' }
  , severityLevels = { debug : 7, info : 6, log : 5, warn : 4, error : 3}
  , consoleMethods = ['debug' , 'info', 'log', 'warn', 'error'];

console.traceOptions = Object.create(null);
console.traceOptions.cwd = process.cwd() + '/';
console.traceOptions.colors = true;
console.traceOptions.timestamp = false;
console.traceOptions.printLevel = false;

/**
 * Store custom options
 *
 * @param {Object} options
 * @api public
 */

module.exports = function (options) {
  if (options) {
    options.cwd = options.cwd || console.traceOptions.cwd;
    console.traceOptions = options;
  } 
}


/**
 * Overrides the console methods.
 */

  consoleMethods.forEach(function (name) {
    var fn = console[name];
    // debug is not a native method
    if(name == 'debug') fn = console.log;

    console[name] = function () {
      var dunotLog = console.traceOptions.logLevel 
        && severityLevels[name] > severityLevels[console.traceOptions.logLevel];
      if(dunotLog) return;
      var head = '';
      if(console.traceOptions.timestamp) head += console.timestampFormat();
      if(console.traceOptions.printLevel) head += console.levelFormat(name);
      if (console._trace || console.traceOptions.always) {
        if (Buffer.isBuffer(arguments[0])) {
          arguments[0] = arguments[0].inspect()
        } else if (arguments[0] instanceof Error){
          if(arguments[0].stack) arguments[0] = arguments[0].stack;
        } else if (typeof arguments[0] === 'object') {
          arguments[0] = JSON.stringify(arguments[0], null, '  ');
        }
        var pad = (arguments[0] && !console.traceOptions.right || !isatty ? ' ' : '');
        head += console.traceFormat(__stack[1], name);
        arguments[0] = pad + arguments[0];
      }
      if(isatty) head = console.attyFormat(head,name);
      arguments[0] = head + arguments[0]; 
      console._trace = false;
      return fn.apply(this, arguments);
    }
  });

console.traceFormat = function (call, method) {
  var basename = call.getFileName().replace(console.traceOptions.cwd, '');
  return '[' + basename + ':' + call.getLineNumber() + ']';
}

console.timestampFormat = function(){
  return '[' +  new Date().toISOString() + ']';
}

console.levelFormat = function(method){
  return '[' + method.toUpperCase() + ']';
}

/**
 * Format the given `str` for the atty
 * 
 * @param {String} str -
 * @param {String} method - the method given determinate the color used based on the mapping in `defaultColors`
 *
 * @return {String}
 * @api public
 */

console.attyFormat = function(str,method){
  var color = '99';
  if (console.traceOptions.colors !== false) {
    if (console.traceOptions.colors === undefined || console.traceOptions.colors[method] === undefined) {
      color = defaultColors[method];
    } else {
      color = console.traceOptions.colors[method];
    }
  }
  if (console.traceOptions.right) {
    var rowWidth = process.stdout.getWindowSize()[0];
    return '\033[s' + // save current position
           '\033[' + rowWidth + 'D' + // move to the start of the line
           '\033[' + (rowWidth - str.length) + 'C' + // align right
           '\033[' + color + 'm' + str + '\033[39m' +
           '\033[u'; // restore current position
  } else {
    return '\033[' + color + 'm' + str + '\033[39m';
  }
}

/**
 * Adds trace getter to the `console` object.
 *
 * @api public
 */

function getter () {
  this._trace = true;
  return this;
}

console.__defineGetter__('t', getter);
console.__defineGetter__('traced', getter);
