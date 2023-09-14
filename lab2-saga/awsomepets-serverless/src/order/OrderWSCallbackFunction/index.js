const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();
const clientCallbackTable = process.env.CLIENT_CALLBACK_TABLE;

exports.handler = async (event, context) => {

  let order = event;
  const params = {
    TableName: clientCallbackTable,
    KeyConditionExpression: "orderId = :oid",
    ExpressionAttributeValues: {
      ":oid": order.orderId
    }
  };

  try {
    let result = await ddb.query(params).promise();

    if( result.Count === 0) {
      // No connection attached to order for response
      // Put the order into pending status for future sending
      let wsResponse = constructWSResponseJSON(order);
      const dbParams = {
        TableName: clientCallbackTable,
        Item: {
          orderId: order.orderId,
          connectionId: "pending#" + wsResponse.createdOn, // add entropy with created on
          attributes: wsResponse
        }
      };
      await ddb.put(dbParams).promise();
      return order;
    } else {
      // If there is connections attached
      let responseData = constructWSResponseJSON(order);
      for(let i=0; i<result.Items.length; i++) {
        let item = result.Items[i];

        // If connectionId is pending ignore it and go on to next loop
        if (item.connectionId.includes("pending")) {
          continue;
        }

        const endpoint = "https://" + item.attributes.domainName + "/" + item.attributes.stage;
        console.log("Endpoint is:", endpoint);

        // Post message back to the Connection URL to send message back to web client
        const apigwManagementApi = new AWS.ApiGatewayManagementApi({
          apiVersion: '2018-11-29',
          endpoint: endpoint
        });

        try {
          await apigwManagementApi.postToConnection({
            ConnectionId: item.connectionId,
            Data: JSON.stringify(responseData)
          }).promise();
        } catch (err) {
          // Delete stale connection from the callback table
          console.log(err);
          if(err.hasOwnProperty('statusCode') && err.statusCode === 410) {
            // Delete state connections
            const dParam = {
              TableName: clientCallbackTable,
              Key: {
                orderId: order.orderId,
                connectionId: item.connectionId
              }
            }
            ddb.delete(dParam).promise();
          }
        }
      }
    }
  } catch (e) {
    console.log(e);
    throw e;
  }

  return order;

};

// Construct the Websocket response JSON message
function constructWSResponseJSON(order) {
  let responseData;
  if(order.status === 'completed') {
    responseData = {
      status: "success",
      orderId: order.orderId,
      amountPaid: order.paymentDetail.paymentAmount,
      createdOn: Date.now()
    }
  } else if (order.status === 'cancelled') {
    responseData = {
      status: "failed",
      orderId: order.orderId,
      message: order.errorMessage,
      createdOn: Date.now()
    }
  } else {
    responseData = {status: "none", createdOn: Date.now()}
  }

  return responseData;
}
