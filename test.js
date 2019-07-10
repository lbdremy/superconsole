require('./superconsole');
require('./superconsole')({}); // should work even if required twice

var consoleMethods = ['debug', 'info', 'log', 'warn', 'error'];

process.stdout.write('\n');

consoleMethods.forEach(function(name) {
  console[name]('regular console.%s, no clue where it came from', name);
});

process.stdout.write('\n---------------------------------------------------------\n\n');

console.traceOptions.colors = true;

consoleMethods.forEach(function(name) {
  console.traced[name]('this is a colored right aligned traced console.%s', name);
});

process.stdout.write('\n---------------------------------------------------------\n\n');

console.traceOptions.always = true;
console.traceOptions.colors = false;

consoleMethods.forEach(function(name) {
  console[name]('this is an uncolored right aligned traced console.%s', name);
});

process.stdout.write('\n---------------------------------------------------------\n\n');
console.traced.log({ 1: 'works', 2: 'with', 3: 'Object' });
console.traced.log(['Works', 'with', 'Array']);
console.traced.log('Works with Buffer', Buffer.from('FooBar'));
console.traced.error(new Error('Works with error object and print the stack'));

require('./superconsole')({
  callsite: true,
  level: true,
  timestamp: true
});

consoleMethods.forEach(function(name) {
  console.traced[name]('this is a console.%s with timestamp, log level and callsite info', name);
});

require('./superconsole')({
  callsite: false,
  level: false,
  timestamp: true
});

consoleMethods.forEach(function(name) {
  console[name]('this is a console.%s with timestamp info only', name);
});

require('./superconsole')({
  callsite: false,
  level: true,
  timestamp: false
});

consoleMethods.forEach(function(name) {
  console[name]('this is a console.%s with log level info only', name);
});

process.stdout.write('\n---------------------------------------------------------\n\n');

require('./superconsole')({
  callsite: true,
  json: true,
  level: true,
  timestamp: true
});

consoleMethods.forEach(function(name) {
  console[name]('this is a JSON-formatted console.%s log', name);
});

console.traced.error(new Error('Works with error object and print the stack'));
