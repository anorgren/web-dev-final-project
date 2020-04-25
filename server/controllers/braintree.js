const Auth = require('../models/user');
const braintree = require('braintree');
require('dotenv').config();

const BRAINTREE_MERCHANT_ID="mcsfygqrzswqtzzr";
const BRAINTREE_PUBLIC_KEY="ccm4ntjj82tm4tjk";
const BRAINTREE_PRIVATE_KEY="b0ebdddcd082f9c246057b3bad8e84ac";

const gateway = braintree.connect({
    environment: braintree.Environment.Sandbox,
    publicKey: BRAINTREE_PUBLIC_KEY,
    privateKey: BRAINTREE_PRIVATE_KEY,
    merchantId: BRAINTREE_MERCHANT_ID
});

exports.generateToken = (req, res) => {
    gateway.clientToken.generate({}, function(err, response) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(response);
        }
    });
};

exports.processPayment = (req, res) => {
    let nonceFromClient = req.body.paymentMethodNonce;
    let amountFromClient = req.body.amount;
    let newTransaction = gateway.transaction.sale({
        amount: amountFromClient,
        paymentMethodNonce: nonceFromClient,
        options: {
            submitForSettlement: true
        }
    }, (error, result) => {
        if(error) {
            res.status(500).json(error)
        } else {
            res.json(result)
        }
    })
};