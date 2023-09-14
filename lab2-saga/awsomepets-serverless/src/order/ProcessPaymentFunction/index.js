const axios = require('axios')
const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();
const paymentsTable = process.env.PAYMENTS_TABLE;
const fetchCatalogueEndpoint = process.env.FETCH_CATALOGUE_ENDPOINT;

class ErrProcessPayment extends Error {
  constructor(message) {
    super(message);
    this.name = "ErrProcessPayment";
  }
}

exports.handler = async (event, context) => {
  var order = event;
  console.log("ProcessPaymentFunction Input is:" + JSON.stringify(order));

  if((order.paymentDetail === undefined) ||
    !(order.paymentDetail.cardNumber.length > 0) ||
    !(order.paymentDetail.cardholderName.length > 0) ||
    !(order.paymentDetail.expiry.length > 0) ||
    !(order.paymentDetail.ccv.length > 0)) {
    throw new ErrProcessPayment('Error, incomplete credit card details');
  }

  const txDate = Date.now();
  try {

    const res = await axios.post(fetchCatalogueEndpoint, order.basket);
    const catalogue = res.data;

    var paymentAmount = 0;
    // Calculate total cost
    for(let i=0; i<order.basket.length; i++) {
      let itemId = order.basket[i].id;
      let c =  catalogue.filter(it => it.id === itemId);

      console.log(c);
      paymentAmount += (c[0].unitPrice * order.basket[i].quantity);
    }

    if(!validateCreditCard(order.paymentDetail)) {
      throw new ErrProcessPayment('Error, invalid credit card');
    }

    let params = {
      TableName: paymentsTable,
      Item: {
        orderId: order.orderId,
        transactionDate: txDate,
        transactionType: "Credit",
        paymentAmount: paymentAmount
      },
    };

    await ddb.put(params).promise();
  } catch (e) {
    console.log(e);
    if (e instanceof ErrProcessPayment) {
      throw e;
    } else {
      throw new ErrProcessPayment('Error processing payment');
    }
  }

  order.status = "Paid";
  order.paymentDetail.paymentAmount = paymentAmount;
  order.paymentDetail.transactionDate = txDate;

  return order;
};


// At this point just validate by expiry date
function validateCreditCard(paymentDetail) {
  const expiryArr = paymentDetail.expiry.split('/');

  const expiryMonth = parseInt(expiryArr[0]);
  const expiryYear = parseInt(expiryArr[1]);

  const today = new Date();
  const currentYear = parseInt(today.getFullYear() % 100);
  const currentMonth = parseInt(today.getMonth() + 1);

  if(expiryMonth < 1 || expiryMonth > 12) {
    return false
  } else if ((expiryYear > currentYear) ||
    (expiryYear === currentYear && expiryMonth >= currentMonth)
  ) {
    return true;
  }
  else {
    return false;
  }
}
