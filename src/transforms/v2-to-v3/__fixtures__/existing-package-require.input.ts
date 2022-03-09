const AWS = require("aws-sdk");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");

const client1 = new AWS.DynamoDB();
const client2 = new DynamoDBClient();