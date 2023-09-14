const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();
const catalogueTable = process.env.CATALOGUE_TABLE;


exports.handler = async (event) => {

  console.log(event);
  var params = {
    "RequestItems" : {
      [catalogueTable]: {
        "Keys" : [],
      },
    }
  }

  console.log(event[0]);
  for(let i=0; i<event.length; i++) {
    params.RequestItems[catalogueTable].Keys.push({"id": event[i].id});
  }


  try {
    let result = await ddb.batchGet(params).promise();
    return result.Responses[catalogueTable];
  } catch(e) {
    console.log(e);
  }

  return null;
};
