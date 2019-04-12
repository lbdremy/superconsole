require('./superconsole')
require('./superconsole')({}) // should work even if I require it twice

var consoleMethods = ['debug' , 'info', 'log', 'warn', 'error']

process.stdout.write('\n');

consoleMethods.forEach(function (name) {
  process.stdout.write(' ');
  console[name]('regular console.%s, no clue where it came from', name);
});

process.stdout.write('\n---------------------------------------------------------\n\n');

consoleMethods.forEach(function (name) {
  process.stdout.write(' ');
  console.traced[name]('this is a traced console.%s', name);
});

process.stdout.write('\n---------------------------------------------------------\n\n');

console.traceOptions.colors = false;

consoleMethods.forEach(function (name) {
  process.stdout.write(' ');
  console.traced[name]('this is an uncolored traced console.%s', name);
});

process.stdout.write('\n---------------------------------------------------------\n\n');

console.traceOptions.right = true;
console.traceOptions.colors = true;

consoleMethods.forEach(function (name) {
  process.stdout.write(' ');
  console.traced[name]('this is a colored right aligned traced console.%s', name);
});

process.stdout.write('\n---------------------------------------------------------\n\n');

console.traceOptions.always = true;
console.traceOptions.colors = false;

consoleMethods.forEach(function (name) {
  process.stdout.write(' ');
  console[name]('this is an uncolored right aligned traced console.%s', name);
});

process.stdout.write('\n---------------------------------------------------------\n\n');

require('./superconsole')({
  colors: {
    log: '35',
    warn: '35',
    error: '35',
    info: '35'
  }
})

consoleMethods.forEach(function (name) {
  process.stdout.write(' ');
  console.traced[name]('this is a magenta traced console.' + name);
});

process.stdout.write('\n---------------------------------------------------------\n\n');

console.traceOptions.colors = true;

process.stdout.write(' ');
console.traced.log({ 1: 'works', 2: 'with', 3: 'Object' });

process.stdout.write(' ');
console.traced.log(['Works', 'with', 'Array']);

process.stdout.write(' ');
console.traced.log('Works with Buffer', Buffer('FooBar'));

process.stdout.write(' ');
console.traced.error(new Error('Works with error object and print the stack'));

require('./superconsole')({
  callsite : true,
  level : true,
  timestamp : true
});

consoleMethods.forEach(function (name) {
  process.stdout.write(' ');
  console.traced[name]('this is a colored traced console.%s with timestamp, log level and callsite info', name);
});

require('./superconsole')({
  callsite : true,
  level : false,
  timestamp : false
});

consoleMethods.forEach(function (name) {
  process.stdout.write(' ');
  var circular = {};
  circular.circular = circular;
  console[name]('this is a colored traced console.%s with callsite info only and circular object', name);
  console[name](circular);
});

require('./superconsole')({
  callsite : false,
  level : false,
  timestamp : true
});

consoleMethods.forEach(function (name) {
  process.stdout.write(' ');
  console[name]('this is a colored traced console.%s with timestamp info only', name);
});

require('./superconsole')({
  callsite : false,
  level : true,
  timestamp : false
});

consoleMethods.forEach(function (name) {
  process.stdout.write(' ');
  console[name]('this is a colored traced console.%s with log level info only', name);
});