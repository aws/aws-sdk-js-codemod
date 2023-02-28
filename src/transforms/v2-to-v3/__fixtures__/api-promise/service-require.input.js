const { DynamoDB } = require("aws-sdk");

const client = new DynamoDB();
const data = await client.listTables().promise();