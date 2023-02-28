const AWS = require("aws-sdk");

const client = new AWS.DynamoDB();
const data = await client.listTables().promise();