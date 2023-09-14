const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();
const ordersTable = process.env.ORDERS_TABLE;

class ErrCompleteOrder extends Error {
  constructor(message) {
    super(message);
    this.name = "ErrCompleteOrder";
  }
}

exports.handler = async (event) => {

  var order = event;
  console.log("CompleteOrderFunction Input is:" + JSON.stringify(order));

  var params = {
    TableName: ordersTable,
    Key:{
      "orderId": order.orderId
    },
    UpdateExpression: "set orderStatus = :s, updatedOn = :u, paymentAmount = :p",
    ExpressionAttributeValues:{
      ":s": "completed",
      ":u": Date.now(),
      ":p": order.paymentDetail.paymentAmount
    },
    ReturnValues:"UPDATED_NEW"
  };

  try {
    await ddb.update(params).promise();
  } catch(e) {
    console.log(e);
    throw new ErrCompleteOrder("Error completing order");
  }

  order.status = "completed";
  return order;
};
