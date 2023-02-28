const {
  DynamoDB: DynamoDBClient
} = require("@aws-sdk/client-dynamodb");

const client = new DynamoDBClient();
const data = await client.listTables();