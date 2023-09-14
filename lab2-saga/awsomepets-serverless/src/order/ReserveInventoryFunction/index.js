const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();
const inventoryTable = process.env.INVENTORY_TABLE;

class ErrReserveInventory extends Error {
  constructor(message,) {
    super(message);
    this.name = "ErrReserveInventory";
  }
}

exports.handler = async (event, context) => {

  var order = event;
  console.log("ReserveInventoryFunction Input is:" + JSON.stringify(order));

  if(!order.hasOwnProperty('basket') || !order.basket.length) {
    throw new ErrReserveInventory('Error, no items in the basket');
  }

  if(!validateInventoryLevels(order.basket)) {
    throw new ErrReserveInventory('Error, insufficient inventory');
  }

  // Reserve inventory and save to inventory table
  let orderItems = [];
  let transactionDate = Date.now();
  for(let i=0;i<order.basket.length; i++) {
    let item = order.basket[i];
    orderItems.push({
      PutRequest: {
        Item: {
          orderId: order.orderId,
          sk: "Reserve#" + item.id,
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

  // Put in database, please note currently total number of items is less than 25
  try {
    await ddb.batchWrite(params).promise();
  } catch(e) {
    console.log(e);
    throw new ErrReserveInventory(order, 'Error reserving inventory');
  }

  order.status = "reserved";
  return order;
};


// For now you can't buy more than 10 of any item
function validateInventoryLevels(basket) {

  for(let i=0; i<basket.length; i++) {
    if(basket[i].quantity > 10) {
      return false;
    }
  }
  return true;
}