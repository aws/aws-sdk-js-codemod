const { DynamoDB, Discovery } = require("aws-sdk"),
  ddbClient = new DynamoDB(),
  discoveryClient = new Discovery();

const ddbResponse = await ddbClient.listTables().promise();
const discoveryResponse = await discoveryClient.describeAgents().promise();