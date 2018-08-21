'use strict';
var loopback = require('loopback');
var boot = require('loopback-boot');
var datasources = require('../create_datasource');
var models = require('../create_model');
var port = require('../update_port');
var paymentKeysConfig = require('../paymentKeysConfig');
var paymentConfig = require('../paymentConfig');


var app = module.exports = loopback();



app.use(loopback.token({
  model: app.models.CustomToken
}));

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
setTimeout(()=>{
   boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$n ode server.js`
  if (require.main === module)
    app.start();
});
},1800)

app.start = function () {
  setTimeout(()=>{
  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  
  });
},1800)
};



module.exports = {
  datasource: datasources,
  model:models,
  app: app,
  boot: boot,
  port: port,
  paymentKeysConfig:paymentKeysConfig,
  paymentConfig:paymentConfig
}
