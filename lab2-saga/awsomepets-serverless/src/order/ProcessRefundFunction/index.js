const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();
const paymentsTable = process.env.PAYMENTS_TABLE;

class ErrProcessRefund extends Error {
  constructor(message) {
    super(message);
    this.name = "ErrProcessRefund";
  }
}

exports.handler = async (event, context) => {
  var order = event;
  console.log("ProcessRefundFunction Input is:" + JSON.stringify(order));

  // Save refund to payments table
  var txDate = Date.now();
  try {
    let params = {
      TableName: paymentsTable,
      Item: {
        orderId: order.orderId,
        transactionDate: txDate,
        transactionType: "Debit",
        paymentAmount: -(order.paymentDetail.paymentAmount)
      },
    };

    let result = await ddb.put(params).promise();
  } catch (e) {
    console.log(e);
    throw new ErrProcessRefund('Error processing refund');
  }

  order.status = "refunded";
  order.paymentDetail.paymentAmount  = 0;
  order.paymentDetail.transactionDate = txDate;
  return order;
};
