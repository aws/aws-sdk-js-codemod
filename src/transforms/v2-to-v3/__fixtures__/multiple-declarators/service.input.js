const DynamoDB = require("aws-sdk/clients/dynamodb"),
  client = new DynamoDB();

const response = await client.listTables().promise();