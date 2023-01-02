const {
        ApplicationDiscoveryService: Discovery
      } = require("@aws-sdk/client-application-discovery-service"),
      {
        DynamoDB
      } = require("@aws-sdk/client-dynamodb"),
      ddbClient = new DynamoDB(),
      discoveryClient = new Discovery();

const ddbResponse = await ddbClient.listTables();
const discoveryResponse = await discoveryClient.describeAgents();