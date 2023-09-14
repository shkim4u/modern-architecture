const AWS = require('aws-sdk');

const ddb = new AWS.DynamoDB.DocumentClient();
const stepfunctions = new AWS.StepFunctions();

const ordersTable = process.env.ORDERS_TABLE;
const wsApiUrl = process.env.WS_API_URL;
const wsApiStage = process.env.WS_API_STAGE;
const orderOrchestratorARN = process.env.ORDER_ORCHESTRATOR_ARN;


exports.handler = async (event, context) => {
  let response = null;

  // Validate that there are item(s) in the cart
  if(event.basket === undefined || !(event.basket.length > 0)) {
    response = {
      statusCode: 400,
      status: "failed",
      message: "No items in the shopping cart."
    };
    return response;
  }

  // Validate that the credit card details
  if((event.paymentDetail === undefined) ||
    !(event.paymentDetail.cardNumber.length > 0) ||
    !(event.paymentDetail.cardholderName.length > 0) ||
    !(event.paymentDetail.expiry.length > 0) ||
    !(event.paymentDetail.ccv.length > 0)) {
    response = {
      statusCode: 400,
      status: "failed",
      message: "Incomplete credit card details."
    };
    return response;
  }
  // Create new order JSON
  const timestamp = Date.now();
  const orderId = context.awsRequestId;
  let order = {
    orderId: orderId,
    status: "new",
    basket: event.basket,
    paymentDetail: event.paymentDetail,
    shippingAddress: event.shippingAddress
  }

  // Construct the DynamoDB insert parameter for Orders table
  let params = {
    TableName: ordersTable,
    Item: {
      orderId: order.orderId,
      orderStatus: order.status,
      basket: order.basket,
      shippingAddress: order.shippingAddress,
      createdOn: timestamp,
      updatedOn: timestamp,
    },
  };
  // Set the websocket callback URL
  const clientCallbackUrl = wsApiUrl +"/" + wsApiStage  + "?orderId=" + order.orderId;
  try {
    // Insert order
    await ddb.put(params).promise();

    // Start Order Orchestrator
    params = {
      stateMachineArn: orderOrchestratorARN,
      input: JSON.stringify(order)
    }
    await stepfunctions.startExecution(params).promise();

    // Return in callback
    response = {
      statusCode: 202,
      status: "placed",
      orderId: order.orderId,
      clientCallbackUrl: clientCallbackUrl
    };
  } catch (e) {
    console.log(e);
    response = {
      statusCode: 400,
      status: "failed",
      message: "Unable to create order."
    };
  }

  return response;
};
