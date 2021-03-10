// A semi-structured logger.
// You get a JSON object in the log that you can then copy/paste into VScode or see in Xplore.

var VoidLogger = Class.create();
VoidLogger.prototype = {
  initialize: function (contextName, minimumLevel) {
    this._contextName = contextName;
    this._minimumLogLevel = this._getLevel(minimumLevel) || this._getLevel('debug');
  },

  _contextName: null,
  _minimumLogLevel: null,

  _logLevels: [{
    name: 'error',
    value: 4,
    logger: gs.error,
  },
  {
    name: 'warn',
    value: 3,
    logger: gs.warn,
  },
  {
    name: 'info',
    value: 2,
    logger: gs.info,
  },
  {
    name: 'debug',
    value: 1,
    logger: gs.debug,
  },
  ],

  _getLevel: function (value) {
    return this._logLevels.filter(function (level) {
      return level.name === value || level.value === value;
    })[0];
  },

  // Log a message, object, and exception using a certain logging level.
  // All params are optional and can be replaced with null.
  // If the logger's minimum level is higher than the logged level, the entry will not be logged.
  log: function (level, message, variableObject, exception) {
    var logLevel = this._getLevel(level) || this._getLevel('error');

    if (logLevel.value < this._minimumLogLevel.value) {
      return;
    }

    var contextName = this._contextName;

    var loggedObject = {
      context: contextName,
      message: message,
      logLevel: logLevel.name,
      minimumLogLevel: this._minimumLogLevel.name,
      variables: variableObject,
      exception: exception,
    };

    var prefix = [contextName, message].join(' - ');

    logLevel.logger(prefix + ':\n' + JSON.stringify(loggedObject, null, 4));
  },

  type: 'VoidLogger'
};

// Set your context name and minimum log level here. I recommend 'warn' for production.
var logger = new VoidLogger('My Script', 'info');

// Collect any other data you want to log in an object. This data can help you diagnose issues.
var variables = {var1: 'something that should be known', var2: 333};

// Example usages.
logger.log('info', 'We got here');
logger.log('info', 'We got here', variables);

try {
  throw 'something';
} catch(ex) {

  // Example usage with exception.
    logger.log('error', 'something happened', variables, ex);
}
