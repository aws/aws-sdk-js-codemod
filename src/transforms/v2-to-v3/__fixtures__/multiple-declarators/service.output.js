const {
  DynamoDB
} = require("@aws-sdk/client-dynamodb"),
  {
    ApplicationDiscoveryService
  } = require("@aws-sdk/client-application-discovery-service"),
  ddbClient = new DynamoDB(),
  discoveryClient = new ApplicationDiscoveryService();

const ddbResponse = await ddbClient.listTables();
const discoveryResponse = await discoveryClient.describeAgents();