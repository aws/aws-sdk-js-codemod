import AWS_DynamoDB = require("@aws-sdk/client-dynamodb");

const {
  DynamoDB
} = AWS_DynamoDB;

const client = new DynamoDB();
const data = await client.listTables();