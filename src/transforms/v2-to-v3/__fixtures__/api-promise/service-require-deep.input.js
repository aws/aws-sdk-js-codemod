const DynamoDB = require("aws-sdk/clients/dynamodb");

const client = new DynamoDB();
const data = await client.listTables().promise();