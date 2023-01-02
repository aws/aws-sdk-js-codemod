const AWS = require("aws-sdk"),
  ddbClient = new AWS.DynamoDB(),
  discoveryClient = new AWS.Discovery();

const ddbResponse = await ddbClient.listTables().promise();
const discoveryResponse = await discoveryClient.describeAgents().promise();