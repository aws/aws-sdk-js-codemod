const DynamoDB = require("aws-sdk/clients/dynamodb");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");

const client1 = new DynamoDB();
const client2 = new DynamoDBClient();