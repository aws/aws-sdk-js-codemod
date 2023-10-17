import AWS_DynamoDB = require("@aws-sdk/client-dynamodb");

const client = new AWS_DynamoDB.DynamoDB();
const data = await client.listTables();