const AWS = require("aws-sdk");
const { DynamoDB } = require("@aws-sdk/client-dynamodb");

const client1 = new AWS.DynamoDB();
const client2 = new DynamoDB();