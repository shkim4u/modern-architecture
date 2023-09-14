const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();
const clientCallbackTable = process.env.CLIENT_CALLBACK_TABLE;

exports.handler = async (event) => {

  const connectionId = event.requestContext.connectionId;
  const params ={
    TableName: clientCallbackTable,
    IndexName: "connectionId-orderId-index",
    KeyConditionExpression: "connectionId = :c",
    ExpressionAttributeValues: {
      ":c": connectionId
    },
  };

  try {
    // Get all orders attached with connection
    const result = await ddb.query(params).promise();

    // Delete the connection
    for(let i=0; i<result.Items.length; i++) {
      let item = result.Items[i];
      const dParams = {
        TableName: clientCallbackTable,
        Key: {
          orderId: item.orderId,
          connectionId: item.connectionId
        }
      };
      console.log(dParams);
      await ddb.delete(dParams).promise();
    }
  } catch(err) {
    return { statusCode: 500, body: 'Failed to disconnect: ' + JSON.stringify(err) };
  }

  return { statusCode: 200, body: 'Diconnected'};
};
