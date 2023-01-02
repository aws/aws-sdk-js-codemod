const {
  DynamoDB
} = require("@aws-sdk/client-dynamodb"),
  client = new DynamoDB();

const response = await client.listTables();