const AWS = require("aws-sdk/global");

const client = new AWS.DynamoDB();
const data = await client.listTables().promise();