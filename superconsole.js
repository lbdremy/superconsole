const stack = require('callsite');
const util = require('util');

const consoleMethods = ['debug', 'log', 'info', 'warn', 'error'];
const severityLevels = { debug: 7, log: 6, info: 5, warn: 4, error: 3 };

console.traceOptions = {
  callsite: false,
  cwd: `${process.cwd()}/`,
  json: false,
  level: false,
  timestamp: false
};

/**
 * Overrides console methods.
 */
consoleMethods.forEach(function(name) {
  // debug is not a native method
  const fn = name === 'debug' ? console.log : console[name];

  console[name] = function() {
    const shouldNotLog =
      console.traceOptions.logLevel &&
      severityLevels[name] > severityLevels[console.traceOptions.logLevel];
    if (shouldNotLog) return;

    const toLog = {};
    if (console.traceOptions.timestamp) {
      toLog.timestamp = new Date().toISOString();
    }
    if (console.traceOptions.level) {
      toLog.level = name.toUpperCase();
    }
    if (console._trace || console.traceOptions.callsite) {
      if (Buffer.isBuffer(arguments[0])) {
        toLog.callsite = arguments[0].inspect();
      } else if (arguments[0] instanceof Error) {
        if (arguments[0].stack) toLog.callsite = arguments[0].stack;
      } else if (typeof arguments[0] === 'object') {
        toLog.callsite = arguments[0];
      }
      const _stack = stack();
      const call = _stack[1];
      if (call) {
        const file = call.getFileName().replace(console.traceOptions.cwd, '');
        toLog.callsite = `${file}:${call.getLineNumber()}`;
      }
    }
    const messages = [];
    while (arguments.length) {
      messages.push([].shift.call(arguments));
    }
    toLog.message = util.format(...messages);
    console._trace = false;

    return fn.call(
      this,
      console.traceOptions.json ? JSON.stringify(toLog) : console.stringFormat(toLog)
    );
  };
});

console.stringFormat = function(toLog) {
  const { timestamp, level, callsite, message } = toLog;
  let logLine = '';
  if (timestamp) logLine += `[${timestamp}]`;
  if (level) logLine += `[${level}]`;
  if (callsite) logLine += `[${callsite}]`;
  logLine += logLine.length ? ` ${message}` : message;
  return logLine;
};

/**
 * Adds trace getter to the `console` object.
 *
 * @api public
 */
function getter() {
  this._trace = true;
  return this;
}

console.__defineGetter__('t', getter);
console.__defineGetter__('traced', getter);

/**
 * Store custom options.
 *
 * @param {Object} options
 * @api public
 */
module.exports = function(options) {
  if (options) {
    options.cwd = options.cwd || console.traceOptions.cwd;
    console.traceOptions = options;
  }
};
