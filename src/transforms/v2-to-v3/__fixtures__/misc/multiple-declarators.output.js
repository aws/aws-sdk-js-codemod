const {
  ApplicationDiscoveryService
} = require("@aws-sdk/client-application-discovery-service");

const { DynamoDB } = require("@aws-sdk/client-dynamodb");

const ddbClient = new DynamoDB(),
  discoveryClient = new ApplicationDiscoveryService();

const ddbResponse = await ddbClient.listTables();
const discoveryResponse = await discoveryClient.describeAgents();