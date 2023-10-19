const DynamoDB = require("aws-sdk/clients/dynamodb"),
  Discovery = require("aws-sdk/clients/discovery");

const ddbClient = new DynamoDB(),
  discoveryClient = new Discovery();

const ddbResponse = await ddbClient.listTables().promise();
const discoveryResponse = await discoveryClient.describeAgents().promise();