# VoidLogger

A semi-structured logging helper.

This logger is a wrapper over gs logging functions that allows for adding context and stringified variables.

It also supports minimum logging levels so you can run quietly in production and enable verbose logging with a system property when needed.

## Installation

Make a global script include and paste in the source code. It does not need to be client-callable.

[Source code](VoidLogger.js)

## Usage

```js
// Build a logger with a context name. You can optionally pass a minimum log level; the default minimum level is 'warn.'
// You can override the minimum level with a system property called "logger.minimumLevel.My Script" and value of the desired minimum level.
// To stop overriding, you need to clear the property value before you delete property. This is because SN caches these property values after deletion.
var logger = new VoidLogger('My Script');

// Example usages.
logger.info('This won\'t be logged because of our minimum logging level.');
logger.warn('We got here.');

// Collect any other data you want to log in an object. This data can help you diagnose issues.
var variables = {
  var1: 'something that should be known',
  var2: 333
};

logger.warn('Add an object to be stringified.', variables);

logger.log('warn', 'We can set the log level as a string using the base "log" function');

try {
  throw 'something';
} catch (ex) {

  logger.error('Use the exception parameter!', variables, ex);
}
```
