// A semi-structured logger.
// You get a JSON object in the log that you can then copy/paste into VScode or see in Xplore.

var VoidLogger = Class.create();
VoidLogger.prototype = {
  initialize: function (contextName, minimumLevel) {
    this._contextName = contextName;

    var minimumLevelOverride = gs.getProperty('logger.minimumLevel.' + contextName);

    this._minimumLogLevel = this._getLevel(minimumLevelOverride) ||
      this._getLevel(minimumLevel) ||
      this._getLevel('debug');
  },

  _contextName: null,
  _minimumLogLevel: null,

  _getLogLevels: function () {
    return [{
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
    ];
  },

  _getLevel: function (value) {
    return this._getLogLevels().filter(function (level) {
      return level.name === value || level.value === value;
    })[0];
  },

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

  error: function (message, variableObject, exception) {
    this.log('error', message, variableObject, exception);
  },

  warn: function (message, variableObject, exception) {
    this.log('warn', message, variableObject, exception);
  },

  info: function (message, variableObject, exception) {
    this.log('info', message, variableObject, exception);
  },

  debug: function (message, variableObject, exception) {
    this.log('debug', message, variableObject, exception);
  },

  type: 'VoidLogger'
};

// Set your context name and minimum log level here. I recommend 'warn' for production.
// When not in development, you can override the minimum level with a system property called "logger.minimumLevel.My Script" and value of the desired minimum level.
var logger = new VoidLogger('My Script', 'warn');

// Example usages.
logger.info('This won\'t be logged because of our minimum logging level.');
logger.warn('We got here.');

// Collect any other data you want to log in an object. This data can help you diagnose issues.
var variables = { var1: 'something that should be known', var2: 333 };
logger.warn('Add an object to be stringified.', variables);

logger.log('warn', 'We can set the log level as a string using "log"');

try {
  throw 'something';
} catch (ex) {

  logger.error('Use the exception parameter!', variables, ex);
}
