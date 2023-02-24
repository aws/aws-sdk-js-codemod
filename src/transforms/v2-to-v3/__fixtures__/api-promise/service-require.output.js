const {
  DynamoDB: DynamoDBClient
} = require("@aws-sdk/client-dynamodb");

const client = new DynamoDBClient();

// ExpressionStatement
client.listTables();