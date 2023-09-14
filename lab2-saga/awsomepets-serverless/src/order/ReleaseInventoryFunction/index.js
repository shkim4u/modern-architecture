const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();
const inventoryTable = process.env.INVENTORY_TABLE;

class ErrReleaseInventory extends Error {
  constructor(message) {
    super(message);
    this.name = "ErrReleaseInventory";
  }
}

exports.handler = async (event, context) => {
  var order = event;
  console.log("ReleaseInventoryFunction Input is:" + JSON.stringify(order));

  // Reserve inventory and save to inventory table
  let orderItems = [];
  let transactionDate = Date.now();
  for(let i=0;i<order.basket.length; i++) {
    let item = order.basket[i];
    orderItems.push({
      PutRequest: {
        Item: {
          orderId: order.orderId,
          sk: "Release#" + item.id,
          title: item.title,
          quantity: item.quantity,
          transactionDate: transactionDate
        }
      }
    });
  }

  let params = {
    RequestItems: {
      [ inventoryTable ] : orderItems
    }
  };

  // Put in database
  try {
    await ddb.batchWrite(params).promise();
  } catch(e) {
    console.log(e);
    throw new ErrReleaseInventory("Error releasing inventory")
  }

  order.status = "released";
  return order;
};
