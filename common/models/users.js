'use strict';
var createSubscription = require('../../service/createSubscription')
var updateSubscription = require('../../service/updateSubscription')
var cancelSubscription = require('../../service/cancelSubscription')
var getSubscription = require('../../service/getSubscription')

const loggingService = require('../../service/loggingService');
//var utils = require('../../../loopback/lib/utils');
var utils = require('../../node_modules/loopback/lib/utils');
var g = require('../../node_modules/loopback/lib/globalize');

module.exports = function(Users) {
	
  Users.signup = function(credentials, fn) {  
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
                fn(err, user);          
              });
	       }	  
        }
       });
      }
     
     return fn.promise;
    })

 }

 Users.updateSubscription = function(where, data, fn) {  
  fn = fn || utils.createPromiseCallback();
  var subscription_id =where.subscription_id;

 updateSubscription.updateSubscription(subscription_id, data, function (err, transaction_result) {
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
        data.subscription_status = "active";

        Users.upsertWithWhere(where, data , function(err, user) { 
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
        console.log(data)

        Users.upsertWithWhere(where, data , function(err, user) { 
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


    Users.remoteMethod('signup',{
	      "accepts": [{"arg":"credentials","type":"users","description":"User credentials","required":true,"http":{"source":"body"}}],
      "returns": [
        {
          "arg": "response",
          "type": "users",
          "root": true,
          "description": ""
        }
      ],
      "description": "User signup with payment",
      "http": [
        {
          "path": "/",
          "verb": "post"
        }
      ]
    });

    Users.remoteMethod('updateSubscription',{
      "accessType": "WRITE",
      "accepts": [ {arg: 'where', type: 'object', http: {source: 'query'}, description: 'Criteria to match model instances'},
    {arg: 'data', type: 'object', model: 'users', http: {source: 'body'}, description: 'An object of model property name/value pairs'}],
    "returns": [
      {
        "arg": "response",
        "type": "users",
        "root": true
      }
    ],
    "description": "Update user payment subscription",
    "http": [
      {
        "path": "/updateSubscription",
        "verb": "post"
      }
    ]
  });
  Users.remoteMethod('cancelSubscription',{
    "accessType": "WRITE",
    "accepts": [ {arg: 'subscription_id', type: 'string', http: {source: 'body'}, description: 'Subscription ID'},
  ],
  "returns": [
    {
      "arg": "response",
      "type": "users",
      "root": true
    }
  ],
  "description": "Cancel user payment subscription",
  "http": [
    {
      "path": "/cancelSubscription",
      "verb": "post"
    }
  ]
});

Users.remoteMethod('getSubscription',{
  "accessType": "WRITE",
  "accepts": [ {arg: 'subscription_id', type: 'string', http: {source: 'body'}, description: 'Subscription ID'},
],
"returns": [
  {
    "arg": "response",
    "type": "users",
    "root": true
  }
],
"description": "Get subscription detais.",
"http": [
  {
    "path": "/getSubscription",
    "verb": "post"
  }
]
});

Users.remoteMethod('getSubscriptionStatus',{
  "accessType": "WRITE",
  "accepts": [ {arg: 'subscription_id', type: 'string', http: {source: 'body'}, description: 'Subscription ID'},
],
"returns": [
  {
    "arg": "response",
    "type": "users",
    "root": true
  }
],
"description": "Get subscription status.",
"http": [
  {
    "path": "/getSubscriptionStatus",
    "verb": "post"
  }
]
});

}
