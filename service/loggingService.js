'use strict';

// Public modules
const winston = require('winston');

let LoggingService = function () {
  let logLevel = process.env.RBM_LOG_LEVEL;
  if (logLevel == undefined) {
    logLevel = 'debug';
  }

  winston.level = logLevel;

  winston.remove(winston.transports.Console);

  winston.createLogger({transports:[
   new(winston.transports.File)({
	filename: 'serverLogs.log',
    'colorize': true,
    'timestamp': true,
    handleExceptions: true,
    humanReadableUnhandledException: true
  }),
    new (winston.transports.Console)({
    'colorize': true,
    'timestamp': true,
    handleExceptions: true,
    humanReadableUnhandledException: true
  })
  ]

  });

LoggingService.prototype.error = function (msg, properties) {
  winston.log('error', msg, properties);
};

LoggingService.prototype.warn = function (msg, properties) {
  winston.log('warn', msg, properties);
};

LoggingService.prototype.info = function (msg, properties) {
  winston.log('info', msg, properties);
};

LoggingService.prototype.verbose = function (msg, properties) {
  winston.log('verbose', msg, properties);
};

LoggingService.prototype.debug = function (msg, properties) {
  winston.log('debug', msg, properties);
};

LoggingService.prototype.silly = function (msg, properties) {
  winston.log('silly', msg, properties);
};

LoggingService.prototype.setLogLevel = function (level, callback) {
  this.getLogLevels(function (logLevels) {
    let valid = false;

    Object.keys(logLevels).forEach(function (key) {
      if (key === level) {
        valid = true;
      } //if
    }); //keys

    if (valid) {
      winston.level = level;
      return callback(null);
    } else {
      return callback('Invalid log level specified.');
    } //if
  }); //getLogLevels
};

LoggingService.prototype.getCurrentLogLevel = function (callback) {
  return callback(winston.level);
};

LoggingService.prototype.isDebug = function (callback) {
  return (winston.level === 'debug' ? true : false);
};

LoggingService.prototype.getLogLevels = function (callback) {
  let logLevels = {
    error: 'Error',
    warn: 'Warning',
    info: 'Info',
    verbose: 'Verbose',
    debug: 'Debug',
    silly: 'Trace'
  };

  return callback(logLevels);
};
};
module.exports = new LoggingService();
