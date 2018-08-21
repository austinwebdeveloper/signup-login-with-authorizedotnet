var request = require("request");
var ApiContracts = require('authorizenet').APIContracts;
var ApiControllers = require('authorizenet').APIControllers;
var utils = require('../utils.js');
var constants = require('../paymentKeysConfig.js');
const loggingService = require('./loggingService');

module.exports.createSubscription = function createSubscription (body,callback) {

	
	var merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();
	merchantAuthenticationType.setName(constants.apiLoginKey);
	merchantAuthenticationType.setTransactionKey(constants.transactionKey);

	var interval = new ApiContracts.PaymentScheduleType.Interval();
	interval.setLength(1);
	interval.setUnit(ApiContracts.ARBSubscriptionUnitEnum.MONTHS);

	var paymentScheduleType = new ApiContracts.PaymentScheduleType();
	paymentScheduleType.setInterval(interval);
	paymentScheduleType.setStartDate(utils.getDate());
	paymentScheduleType.setTotalOccurrences(5);
	paymentScheduleType.setTrialOccurrences(0);

	var creditCard = new ApiContracts.CreditCardType();
	creditCard.setExpirationDate(body.expiredate);
	creditCard.setCardNumber(body.cardnumber);
	creditCard.setCardCode(body.cardcode);

	var payment = new ApiContracts.PaymentType();
	payment.setCreditCard(creditCard);

	var orderType = new ApiContracts.OrderType();
	orderType.setInvoiceNumber(utils.getRandomString('Inv:')); 
	orderType.setDescription(utils.getRandomString('Description'));

	var customer = new ApiContracts.CustomerType();
	customer.setType(ApiContracts.CustomerTypeEnum.INDIVIDUAL);
	customer.setId(utils.getRandomString('Id'));
	customer.setEmail(body.email);
	customer.setPhoneNumber(body.phone);
	//customer.setFaxNumber('1232122122');
	//customer.setTaxId('911011011');

	var nameAndAddressType = new ApiContracts.NameAndAddressType();
	nameAndAddressType.setFirstName(body.firstname);
	nameAndAddressType.setLastName(body.lastname);
	//nameAndAddressType.setCompany(utils.getRandomString('Company'));
	nameAndAddressType.setAddress(body.address);
	nameAndAddressType.setCity(body.city);
	nameAndAddressType.setState(body.state);
	nameAndAddressType.setZip(body.zip);
	nameAndAddressType.setCountry(body.country);
    
	var arbSubscription = new ApiContracts.ARBSubscriptionType();
	arbSubscription.setName(body.firstname+body.lastname);
	arbSubscription.setPaymentSchedule(paymentScheduleType);
	arbSubscription.setAmount(5);
	arbSubscription.setTrialAmount(0);
	arbSubscription.setPayment(payment);
	arbSubscription.setOrder(orderType);
	arbSubscription.setCustomer(customer);
	arbSubscription.setBillTo(nameAndAddressType);
	arbSubscription.setShipTo(nameAndAddressType);

	var createRequest = new ApiContracts.ARBCreateSubscriptionRequest();
	createRequest.setMerchantAuthentication(merchantAuthenticationType);
	createRequest.setSubscription(arbSubscription);

	console.log(JSON.stringify(createRequest.getJSON(), null, 2));
		
	var ctrl = new ApiControllers.ARBCreateSubscriptionController(createRequest.getJSON());

	ctrl.execute(function(){

		var apiResponse = ctrl.getResponse();

		var response = new ApiContracts.ARBCreateSubscriptionResponse(apiResponse);

		// console.log(JSON.stringify(response, null, 2));

		if(response != null){
			if(response.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK){
				console.log('Subscription Id : ' + response.getSubscriptionId());
				console.log('Message Code : ' + response.getMessages().getMessage()[0].getCode());
				console.log('Message Text : ' + response.getMessages().getMessage()[0].getText());
			}
			else{
				console.log('Result Code: ' + response.getMessages().getResultCode());
				console.log('Error Code: ' + response.getMessages().getMessage()[0].getCode());
				console.log('Error message: ' + response.getMessages().getMessage()[0].getText());
			}
		}
		else{
			console.log('Null Response.');
		}



		callback(null, response);
	});
}

if (require.main === module) {
	createSubscription(function(){
		console.log('createSubscription call complete.');
	});
}

