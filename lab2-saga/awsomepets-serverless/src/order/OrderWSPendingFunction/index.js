const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();
const clientCallbackTable = process.env.CLIENT_CALLBACK_TABLE;

exports.handler = async (event) => {

  console.log(event);
  let order = JSON.parse(event.body);

  // If there is no orderId in the message, then no response is required
  if(order === undefined || !order.hasOwnProperty('orderId')) {
    const response = {
      statusCode: 200,
      body: JSON.stringify({status : "none"})
    };

    return response;
  }

  // Find the pending unsent connection for the given orderId
  let params = {
    TableName: clientCallbackTable,
    KeyConditionExpression: "#orderId = :oid and begins_with(#connectionId, :cid)",
    ExpressionAttributeNames:{
      "#orderId": "orderId",
      "#connectionId": "connectionId"
    },
    ExpressionAttributeValues: {
      ":oid": order.orderId,
      ":cid": "pending"
    }
  };

  let response;
  try {
    let result = await ddb.query(params).promise();
    console.log(result);

    if(result.Count > 0) {
      // Construct the order status response
      // Only need first record for response and likely one be 1 record
      response = {
        statusCode: 200,
        body: JSON.stringify(result.Items[0].attributes)
      };

      for(let i=0;i<result.Count; i++) {
        let item = result.Items[i];

        params = {
          TableName: clientCallbackTable,
          Key: {
            orderId: item.orderId,
            connectionId: item.connectionId
          }
        }

        // Delete pending callback registry for the Order
        await ddb.delete(params).promise();
      }
    } else {
      response = {
        statusCode: 200,
        body: JSON.stringify({"status": "none"})
      };
    }

  } catch (e) {
    console.log(e);
    response = {
      statusCode: 500,
      body: "Error fetching order item"
    };
  }

  // Return the status updates to the client
  return response;
};
