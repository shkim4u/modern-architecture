const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();
const clientCallbackTable = process.env.CLIENT_CALLBACK_TABLE;
const getOrderFunc = process.env.GET_ORDER_FUNCTION;
const lambda = new AWS.Lambda();

exports.handler = async(event) => {

  // Retrieve the order id and connection context from the query parameter
  let orderId = event.queryStringParameters.orderId;
  const domainName = event.requestContext.domainName;
  const stage = event.requestContext.stage;
  const connectionId = event.requestContext.connectionId;

  // Construct the DynamoDB insert parameter for Client Callback table
  const dbParams = {
    TableName: clientCallbackTable,
    Item: {
      orderId: orderId,
      connectionId: connectionId,
      attributes : {
        domainName: domainName,
        stage: stage,
        createdOn: Date.now()
      }
    }
  };

  try {

    // Register connection agaisnt a specific order id for callback in DynamoDB
    await ddb.put(dbParams).promise();

    return { statusCode: 200, body: 'Connected'};
  } catch (err) {
    console.log(err);
    return { statusCode: 500, body: 'Failed to connect: ' + JSON.stringify(err) };
  }
};