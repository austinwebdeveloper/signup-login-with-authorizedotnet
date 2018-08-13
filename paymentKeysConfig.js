'use strict';

module.exports =  function paymentKeysConfig(configuration) {

//module.exports.apiLoginKey = '53YR6p5vr';
//module.exports.transactionKey = '6h4W2kuP242jX37B';

module.exports.apiLoginKey = configuration.apiLoginKey;
module.exports.transactionKey = configuration.transactionKey;

}
