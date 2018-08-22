
'use strict';
var path = require('path');
var createSubscription = require('../../service/createSubscription')
var updateSubscription = require('../../service/updateSubscription')
var cancelSubscription = require('../../service/cancelSubscription')
var getSubscription = require('../../service/getSubscription')
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey('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')
const loggingService = require('../../service/loggingService');
var utils = require('../../../loopback/lib/utils');
var g = require('../../../loopback/lib/globalize');

var modelName = path.basename(__filename, path.extname(__filename))


module.exports = function(Users) {
  
  Users.signup = function(credentials, fn) { 
    credentials.email = credentials.email.toLowerCase();
    fn = fn || utils.createPromiseCallback();
  	  Users.create(credentials, function(err, result) { 
       if(err)
	       {
          var defaultError = new Error(g.f(err.message));
          defaultError.statusCode = 400;
          defaultError.code = 'BAD_REQUEST';
          fn(defaultError);
	 
              }
	     else
	       {  
          createSubscription.createSubscription(credentials, function (err, transaction_result) {
            if (err) {
             fn(err);
          
           }
            else {
             if(transaction_result.messages.resultCode == "Error")
             {
               var err1 = new Error(g.f(transaction_result.messages.message[0].text));
              err1.statusCode = 401;
              var code = transaction_result.messages.message[0].text.toUpperCase();
              err1.code = code;
              fn(err1);
             }
             else
             {

              var where= { "id":result.id};
              var data= { "subscription_id":transaction_result.subscriptionId,"subscription_status" : "active"};
              Users.upsertWithWhere(where, data , function(err, user) {    
                if (err) {
                  fn(err);               
               }
               user.subscription_id = transaction_result.subscriptionId;
               const msg = {
                to: user.email,
                from: 'test.nuevesolutions@gmail.com',
                subject: 'Subscription successfully completed',
                html: '<strong>Hi </strong>'+user.username+'<p>Your subscription successfully completed</p><p>Your subscription ID: <strong>'+user.subscription_id+'</strong></p>',
            };
            sgMail.send(msg);
                fn(err, user);          
              });
	       }	  
        }
       });
      }
     
     return fn.promise;
    })

 }
 
 Users.updateSubscription = function(credentials, fn) {  
  fn = fn || utils.createPromiseCallback();
  var subscription_id =credentials.subscription_id;
 updateSubscription.updateSubscription(subscription_id, credentials , function (err, transaction_result) {
    if (err) {
      fn(err);   
    }
     else {

      if(transaction_result.messages.resultCode == "Error")
      {

        var err1 = new Error(g.f(transaction_result.messages.message[0].text));
       err1.statusCode = 401;
       var code = transaction_result.messages.message[0].text.toUpperCase();
       err1.code = code;
       fn(err1);
      }
      else
      {
        var where= { "subscription_id":subscription_id};
        credentials.subscription_status = "active";

        Users.upsertWithWhere(where, credentials , function(err, user) { 
                    if (err) {
            console.log('errors'+err)
                         
         }
         else{
           console.log(user)
           fn(err, user);    
         }         
        });
      }
    }
    return fn.promise;

  })
 }

 Users.getSubscription = function(subscription_id, fn) {  
  fn = fn || utils.createPromiseCallback();
  getSubscription.getSubscription(subscription_id,  function (err, transaction_result) {
    if (err) {
      fn(err);   
    }
     else {

      if(transaction_result.messages.resultCode == "Error")
      {

        var err1 = new Error(g.f(transaction_result.messages.message[0].text));
       err1.statusCode = 401;
       var code = transaction_result.messages.message[0].text.toUpperCase();
       err1.code = code;
       fn(err1);
      }
      else
      {
       
           fn(err, transaction_result);    
      
      }
    }
    return fn.promise;

  })
}


 Users.cancelSubscription = function(subscription_id, fn) {  
  fn = fn || utils.createPromiseCallback();
  cancelSubscription.cancelSubscription(subscription_id,  function (err, transaction_result) {
    if (err) {
      fn(err);   
    }
     else {

      if(transaction_result.messages.resultCode == "Error")
      {

        var err1 = new Error(g.f(transaction_result.messages.message[0].text));
       err1.statusCode = 401;
       var code = transaction_result.messages.message[0].text.toUpperCase();
       err1.code = code;
       fn(err1);
      }
      else
      {
        var where= { "subscription_id":subscription_id};
        var data = { "subscription_status":"inactive"};

        Users.upsertWithWhere(where, data , function(err, user) { 
                    if (err) {
            console.log('errors'+err)
                         
         }
         else{
          const msg = {
            to: user.email,
            from: 'test.nuevesolutions@gmail.com',
            subject: 'Subscription successfully cancelled',
            html: '<strong>Hi </strong>'+user.username+'<p>Your subscription successfully cancelled</p><p>Your subscription ID :<strong>'+user.subscription_id+'</strong></p>',
        };
        sgMail.send(msg);
         fn(err, user);    
         }         
        });
      }
    }
    return fn.promise;

  })


 }
 
   Users.remoteMethod('signup',{
	      "accepts": [{"arg":"credentials","type":modelName,"description":"User credentials","required":true,"http":{"source":"body"}}],
      "returns": [
        {
          "arg": "response",
          "type": modelName
        }
      ],
      "description":modelName+" signup with payment",
      "http": [
        {
          "path": "/",
          "verb": "post"
        }
      ]
     });
     

    Users.remoteMethod('updateSubscription',{
      "accepts": [ 
    {arg: 'credentials', type: 'object', model: modelName, http: {source: 'body'}, description: 'An object of update fields and subscription_id'}],
    "returns": [
      {
        "arg": "response",
        "type": modelName,
        "root": true
      }
    ],
    "description": "Update "+ modelName+" payment subscription",
    "http": [
      {
        "path": "/updateSubscription",
        "verb": "post"
      }
    ]
    });
    Users.remoteMethod('getSubscription',{
      "accepts": [ {arg: 'subscription_id', type: 'string', http: {source: 'body'}, description: 'Subscription ID'},
    ],
    "returns": [
      {
        "arg": "response",
        "type": modelName,
        "root": true
      }
    ],
    "description": "Get "+modelName+" subscription detais.",
    "http": [
      {
        "path": "/getSubscription",
        "verb": "post"
      }
    ]
    });
   


Users.remoteMethod('cancelSubscription',{
  "accepts": [ {arg: 'subscription_id', type: 'string', http: {source: 'body'}, description: 'Subscription ID'},
],
"returns": [
  {
    "arg": "response",
    "type": modelName
  }
],
"description": "Cancel "+modelName+" user payment subscription",
"http": [
  {
    "path": "/cancelSubscription",
    "verb": "post"
  }
]
 });


 Users.normalizeCredentials = function(credentials, realmRequired, realmDelimiter) {
  var query = {};
  credentials = credentials || {};
  if (!realmRequired) {
    if (credentials.email) {
      query.email = credentials.email.toLowerCase();
    } else if (credentials.username) {
      query.username = credentials.username;
    }
  } else {
    if (credentials.realm) {
      query.realm = credentials.realm;
    }
    var parts;
    if (credentials.email) {
      parts = splitPrincipal(credentials.email, realmDelimiter);
      query.email = parts[1];
      if (parts[0]) {
        query.realm = parts[0];
      }
    } else if (credentials.username) {
      parts = splitPrincipal(credentials.username, realmDelimiter);
      query.username = parts[1];
      if (parts[0]) {
        query.realm = parts[0];
      }
    }
  }
  return query;
};



/**
*
* @param {object} data
* @param {Function(Error, object)} callback
*/
/* User.login = function (credentials, include, callback) {
// Invoke the default login function
User.find({where: {and: [{email: credentials.email }, {username: 'svl'}]}},
function (err, posts) {
console.log(posts)
callback(null, posts)
});
};
*/
Users.login = function(credentials, include, fn) {
var self = this;
if (typeof include === 'function') {
fn = include;
include = undefined;
}

fn = fn || utils.createPromiseCallback();

include = (include || '');
if (Array.isArray(include)) {
include = include.map(function(val) {
  return val.toLowerCase();
});
} else {
include = include.toLowerCase();
}

var realmDelimiter;
// Check if realm is required
var realmRequired = !!(self.settings.realmRequired ||
self.settings.realmDelimiter);
if (realmRequired) {
realmDelimiter = self.settings.realmDelimiter;
}
var query = self.normalizeCredentials(credentials, realmRequired,
realmDelimiter);

if (realmRequired && !query.realm) {
var err1 = new Error(g.f('{{realm}} is required'));
err1.statusCode = 400;
err1.code = 'REALM_REQUIRED';
fn(err1);
return fn.promise;
}
if (!query.email && !query.username) {
var err2 = new Error(g.f('{{username}} or {{email}} is required'));
err2.statusCode = 400;
err2.code = 'USERNAME_EMAIL_REQUIRED';
fn(err2);
return fn.promise;
}

self.findOne({where: query}, function(err, user) {
  var defaultError = new Error(g.f('login failed'));
defaultError.statusCode = 401;
defaultError.code = 'LOGIN_FAILED';

function tokenHandler(err, token) {
  if (err) return fn(err);
  if (Array.isArray(include) ? include.indexOf('user') !== -1 : include === 'user') {
    // NOTE(bajtos) We can't set token.user here:
    //  1. token.user already exists, it's a function injected by
    //     "AccessToken belongsTo User" relation
    //  2. ModelBaseClass.toJSON() ignores own properties, thus
    //     the value won't be included in the HTTP response
    // See also loopback#161 and loopback#162
    token.__data.user = user;
  }
  fn(err, token);
}

if (err) {
  debug('An error is reported from User.findOne: %j', err);
  fn(defaultError);
} else if (user) {
  user.hasPassword(credentials.password, function(err, isMatch) {
    if (err) {
      debug('An error is reported from User.hasPassword: %j', err);
      fn(defaultError);
    } else if (isMatch) {
      if (self.settings.emailVerificationRequired && !user.emailVerified) {
        // Fail to log in if email verification is not done yet
        debug('User email has not been verified');
        err = new Error(g.f('login failed as the email has not been verified'));
        err.statusCode = 401;
        err.code = 'LOGIN_FAILED_EMAIL_NOT_VERIFIED';
        err.details = {
          userId: user.id,
        };
        fn(err);
      } else {
        if (user.createAccessToken.length === 2) {
          user.createAccessToken(credentials.ttl, tokenHandler);

        } else {
          user.createAccessToken(credentials.ttl, credentials, tokenHandler);
        }
      }
    } else {
      debug('The password is invalid for user %s', query.email);
      fn(defaultError);
    }
  });
} else {
  debug('No matching record is found for user %s', query.email );
  fn(defaultError);
}
});
return fn.promise;
};


 };

