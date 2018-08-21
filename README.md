# Signup Login with Authorize.net Module
The signup-login-with-authorizedotnet module is a Node.js based loopback script and it provides a fastest way to create user signup and login services with authentication and payment subscription with Authorize.net.


## Pre-requisites
Node.js , and the platform-specific tools needed to compile native NPM modules (which you may already have):

## Installation

To install the signup-login-with-authorizedotnet module, simply run the following command within your app's directory:

```sh
npm i  signup-login-with-authorizedotnet --save
```

## Development

```sh
var loopback = require("signup-login-with-authorizedotnet");
```
#### Port Configuration:

```sh

var port = new loopback.port(port address);

```
Example:
```sh
var port = new loopback.port(8080);
``` 
### Database Configuration:

```sh
var dbConfig = {"name":"","options":{	
	"host": "",
    "port": ,
    "url": "",
    "database": "",
    "password": "",
    "user": "",
    "connector": "" // connector name ex. mongodb or mysql
}};

var database = new loopback.datasource(dbConfig);
```

##### Note: No need to declare email, username and password in schema but you need to add required field for username if you want it as required field.

#### Must follow below model properties configuration for payment integration with Authorize.net 

### Model Configuration:

```sh
var modelConfig = {

   "name": "",  // model name example user, student, employee
   
   "properties": {   
   "firstname": {
      "type": "string"
    },
    "lastname": {
      "type": "string"
    },
    "username": {
      "type": "string",
      "required": true
    },
    "address": {
      "type": "string"
    },
	"city": {
      "type": "string"
    },
	"state": {
      "type": "string"
    },
    "country": {
      "type": "string"
    },
	"zip": {
      "type": "number"  
	  },
    "phone": {
      "type": "number"
    },
	"cardcode": {
      "type": "string"
    },
    "expiredate": {
      "type": "string",
      "required": true
    },
	"cardnumber": {
      "type": "number",
      "required": true
    },
	"interval_length": {
      "type": "number",
      "required": true
    }
  }
};	
 var model = new loopback.model(modelConfig); 
```

### Set Authorize.net keys

##### Note: if you havent created keys follow  https://support.authorize.net/s/article/How-do-I-obtain-my-API-Login-ID-and-Transaction-Key

```sh 
var authorizekeys = {
    "apiLoginKey":"",  //Authorize.net APIloginkey
    "transactionKey":""  //Authorize.net transactionKey
} 
 new loopback.paymentKeysConfig(authorizekeys)
 ```

###  Authorize.net Merchant Details config


```sh 
var paymentconfig = {
    "amount":"50",  // Amount of subscription
    "trail_amount":"0", // Trail Amount of subscription
    "interval_length":"1", // The measurement of time, in association with unit, that is used to define the frequency of the billing occurrences.(For a unit of days, use an integer between 7 and 365, inclusive. For a unit of months, use an integer between 1 and 12, inclusive.)
    "interval_unit":"months" // The unit of time, in association with the length, between each billing occurrence.(days or moths)
} 
 new loopback.paymentConfig(paymentconfig)
 ```
 
 
 
#### Include following code in your index file:
 
```sh 
 var appStart = loopback.app;
 appStart.start();
```

#### Run following in your terminal to start the APP:
 
```sh 
 npm start
``` 
 
Verify the deployment by navigating to your server address in your preferred browser.

```sh
http://host:port/explorer
``` 
Example:
```sh
http://localhost:8001/explorer
``` 

#Licence
MIT
 
 
