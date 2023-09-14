const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();
const ordersTable = process.env.ORDERS_TABLE;

class ErrCancelOrder extends Error {
  constructor(message) {
    super(message);
    this.name = "ErrCancelOrder";
  }
}

exports.handler = async (event) => {

  var order = event;
  console.log("CancelOrderFunction Input is:" + JSON.stringify(order));

  order.status = "cancelled";
  order.errorType = order.error.Error;
  order.errorMessage = JSON.parse(order.error.Cause).errorMessage;
  delete order.error;
  var params = {
    TableName: ordersTable,
    Key:{
      "orderId": order.orderId
    },
    UpdateExpression: "set orderStatus = :s, updatedOn = :t, errorType = :e, errorMessage = :m",
    ExpressionAttributeValues:{
      ":s": "cancelled",
      ":t": Date.now(),
      ":e": order.errorType,
      ":m": order.errorMessage
    },
    ReturnValues:"UPDATED_NEW"
  };

  try {
    await ddb.update(params).promise();
  } catch(e) {
    console.log(e);
    throw new ErrCancelOrder("Error cancelling order");
  }

  return order;
};