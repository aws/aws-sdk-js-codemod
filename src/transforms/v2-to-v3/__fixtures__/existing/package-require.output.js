const {
  DynamoDBClient,
  DynamoDB
} = require("@aws-sdk/client-dynamodb");

const client1 = new DynamoDB();
const client2 = new DynamoDBClient();